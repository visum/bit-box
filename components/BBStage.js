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
    this.loadedNameElement = this.shadowRoot.querySelector("#loaded-path");

    this.handleDrag = this.handleDrag.bind(this);
  }

  async loadConfig(path) {
    this.program && this.program.dispose();
    this.clearPlugins();
    
    const audioContext = new AudioContext();
    this.program = new Program({context:audioContext});
    this.loadedNameElement.textContent = "Loading...";
    await this.program.loadConfig(path, PLUGIN_ROOT);
    this.loadedNameElement.textContent = path;

    Object.entries(this.program.plugins).forEach(([name, plugin]) => {
      this.drawPlugin(name, plugin);
    });
    this.updateSizes();
    this.drawPatches();
  }

  handleDrag(element, delta) {
    const newPosition = [element.position[0] + delta[0], element.position[1] + delta[1]];
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

  clearPlugins() {
    [...this.pluginsContainer.children].forEach(element => {
      if (typeof element.dispose === "function") {
        element.dispose();
      }
      this.pluginsContainer.removeChild(element);
    });
  }

  drawPatches() {
    this.clearCanvas();
    const context = this.canvasContext;
    const patches = this.program.patches;
    patches.forEach(patch => {
      const type = patch.type;
      const [startX, startY] = this.pluginElements[
        patch.source
      ].getConnectorPositions()[type + "Out"];

      const [endX, endY] = this.pluginElements[
        patch.target
      ].getConnectorPositions()[type + "In"];

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
        Loaded plugin: <span id="loaded-path">none</span>.
        <div id="stage-wrapper">
          <canvas></canvas>
          <div id="plugins"></div>
        </div>
      </div>
    `;
  }
}

window.customElements.define("bb-stage", BBStage);
