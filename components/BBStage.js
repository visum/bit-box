import { html, render } from "../lib/lit-html/lit-html.js";
import "./BBPlugin.js";
import Program from "../lib/Program.js";

const PLUGIN_ROOT = "../plugins/";

class BBStage extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.canvasDimensions = [0, 0];
    this.pluginElements = {};
    this.program = null;

    render(this.render(), this.shadowRoot);

    this.container = this.shadowRoot.querySelector("#container");
    this.pluginsContainer = this.shadowRoot.querySelector("#plugins");
    this.canvas = this.shadowRoot.querySelector("canvas");
    this.canvasContext = this.canvas.getContext("2d");

    this.connectionLineStart = null;
    this.connectionLineEnd = null;
    this.connectionEventSource = null;
    this.connectionAudioSource = null;

    this.handleDrag = this.handleDrag.bind(this);

    this.addEventListener("startEventConnection", event => {
      this.addEventListener("mousemove", this.handleConnectionMove);

      const pluginName = event.detail.pluginName;
      const element = this.pluginElements[pluginName];

      this.connectionLineStart = element.getConnectorPositions().eventOut;
      this.connectionEventSource = pluginName;
    });

    this.addEventListener("endEventConnection", event => {
      if (!this.connectionEventSource) {
        return;
      }
      const pluginName = event.detail.pluginName;
      this.program.connect(this.connectionEventSource, pluginName, "event");
      this.drawCanvas();
      this.cancelConnection();
    });

    this.addEventListener("startAudioConnection", event => {
      this.addEventListener("mousemove", this.handleConnectionMove);
      const pluginName = event.detail.pluginName;
      this.connectionAudioSource = pluginName;
      this.connectionLineStart = this.pluginElements[
        pluginName
      ].getConnectorPositions().audioOut;
    });

    this.addEventListener("endAudioConnection", event => {
      if (!this.connectionAudioSource) {
        return;
      }
      const pluginName = event.detail.pluginName;
      this.program.connect(this.connectionAudioSource, pluginName, "audio");
      this.drawCanvas();
      this.cancelConnection();
    });

    this.addEventListener("mouseup", () => {
      if (this.connectionAudioSource || this.connectionEventSource) {
        this.cancelConnection();
      }
    });

    this.addEventListener("deletePlugin", (event) => {
      const pluginName = event.detail.pluginName;
      this.program.removePlugin(pluginName);
      this.draw();
    });

    this.canvas.addEventListener("dblclick", event => {
      const canvasBounds = this.canvas.getBoundingClientRect();
      const adjustedPoint = [
        event.clientX - (canvasBounds.left + window.scrollX),
        event.clientY - (canvasBounds.top + window.scrollY)
      ];

      const getLineLength = ([[x0, y0],[x1, y1]]) => {
        const run = Math.abs(x1 - x0);
        const rise = Math.abs(y1 - y0);
        return Math.sqrt(Math.pow(run,2) + Math.pow(rise,2));
      }


      const matchedPatches = this.program.patches.filter((patch) => {
        const [patchStart, patchEnd] = this.getPatchLine(patch);
        const aToB = getLineLength([patchStart, patchEnd]);
        const aToC = getLineLength([patchStart, adjustedPoint]);
        const cToB = getLineLength([adjustedPoint, patchEnd]);
        const segmentTotal = aToC + cToB;
        return Math.abs(segmentTotal - aToB) < 4;
      });

      if (matchedPatches.length === 1) {
        this.program.removePatch(matchedPatches[0]);
        this.draw();
      }
      if (matchedPatches.length > 1) {
        console.error("Too many matches!");
      }
      
    });
  }

  handleConnectionMove(event) {
    const canvasBounds = this.canvas.getBoundingClientRect();
    this.connectionLineEnd = [
      event.clientX - (canvasBounds.left + window.scrollX),
      event.clientY - (canvasBounds.top + window.scrollY)
    ];
    this.clearCanvas();
    this.drawPatches();
    this.drawConnectionInProgress();
  }

  cancelConnection() {
    this.connectionAudioSource = null;
    this.connectionEventSource = null;
    this.connectionLineStart = null;
    this.connectionLineEnd = null;
    this.removeEventListener("mousemove", this.handleConnectionMove);
    this.drawCanvas();
  }

  newProgram() {
    if (this.program) {
      this.program.dispose();
      this.clearPlugins();
    }
    this.program = new Program({ context: new AudioContext() });
    this.draw();
  }

  draw() {
    this.clearPlugins();
    Object.entries(this.program.plugins).forEach(([name, plugin]) => {
      this.drawPlugin(name, plugin);
    });
    this.updateSizes();
    this.drawCanvas();
  }

  drawCanvas() {
    this.clearCanvas();
    this.drawPatches();
    this.drawConnectionInProgress();
  }

  async loadConfig(path) {
    this.program && this.program.dispose();
    this.clearPlugins();

    const audioContext = new AudioContext();
    this.program = new Program({ context: audioContext });
    await this.program.loadConfig(path, PLUGIN_ROOT);
    this.draw();
  }

  handleDrag(element, delta) {
    const newPosition = [
      element.position[0] + delta[0],
      element.position[1] + delta[1]
    ];
    const pluginName = element.pluginName;
    element.setPosition(newPosition);
    if (this.canvasDimensions[0] < newPosition[0] + 100) {
      this.canvasDimensions[0] = newPosition[0] + 100;
    }
    if (this.canvasDimensions[1] < newPosition[1] + 100) {
      this.canvasDimensions[1] = newPosition[1] + 100;
    }
    this.program.meta.positions[pluginName] = newPosition;
    this.updateSizes();
    this.drawPatches();
  }

  updateSizes() {
    this.container.style.width = this.canvasDimensions[0];
    this.container.style.height = this.canvasDimensions[1];
    this.canvas.width = this.canvasDimensions[0];
    this.canvas.height = this.canvasDimensions[1];
  }

  clearCanvas() {
    const context = this.canvasContext;
    const [width, height] = this.canvasDimensions;
    context.clearRect(0, 0, width, height);
  }

  drawPlugin(name, plugin) {
    const bbPlugin = document.createElement("bb-plugin");
    if (this.program.meta && this.program.meta.positions) {
      const position = this.program.meta.positions[name] || [0, 0];
      bbPlugin.setPosition(position);
      if (this.canvasDimensions[0] < position[0] + 100) {
        this.canvasDimensions[0] = position[0] + 100;
      }
      if (this.canvasDimensions[1] < position[1] + 100) {
        this.canvasDimensions[1] = position[1] + 100;
      }
    }
    bbPlugin.setPlugin(name, plugin);
    bbPlugin.setDragHandler(this.handleDrag);
    this.pluginsContainer.appendChild(bbPlugin);
    this.pluginElements[name] = bbPlugin;
  }

  drawConnectionInProgress() {
    if (!(this.connectionLineStart && this.connectionLineEnd)) {
      return;
    }
    const [startX, startY] = this.connectionLineStart;
    const [endX, endY] = this.connectionLineEnd;
    const context = this.canvasContext;
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "red";
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
  }

  clearPlugins() {
    [...this.pluginsContainer.children].forEach(element => {
      if (typeof element.dispose === "function") {
        element.dispose();
      }
      this.pluginsContainer.removeChild(element);
    });
  }

  getPatchLine(patch) {
    const type = patch.type;
    const [startX, startY] = this.pluginElements[
      patch.source
    ].getConnectorPositions()[type + "Out"];

    const [endX, endY] = this.pluginElements[
      patch.target
    ].getConnectorPositions()[type + "In"];

    return [[startX, startY], [endX, endY]];
  }

  drawPatches() {
    this.clearCanvas();
    const context = this.canvasContext;
    const patches = this.program.patches;
    patches.forEach(patch => {
      const [[startX, startY], [endX, endY]] = this.getPatchLine(patch);

      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = "black";
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
      context.stroke();
    });
  }

  getConfigDump() {
    return this.program.dumpConfig(PLUGIN_ROOT);
  }

  render() {
    return html`
      <style>
        :host {
          user-select: none;
        }

        #stage-wrapper {
          position: relative;
        }

        #plugins {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        canvas {
          position: absolute;
        }
      </style>

      <div id="container">
        <div id="stage-wrapper">
          <canvas></canvas>
          <div id="plugins"></div>
        </div>
      </div>
    `;
  }
}

window.customElements.define("bb-stage", BBStage);
