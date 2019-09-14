import {html, render} from "../lib/lit-html/lit-html.js";
import ConfigLoader from "../lib/ConfigLoader.js";
import "./BBPlugin.js";

const PLUGIN_ROOT = "../plugins/";

class BBStage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.canvasDimensions = [0,0];
    this.pluginElements = {};

    this.configLoader = null;
    
    render(this.render(), this.shadowRoot);

    this.container = this.shadowRoot.querySelector("#container");
    this.pluginsContainer = this.shadowRoot.querySelector("#plugins");
    this.canvas = this.shadowRoot.querySelector("canvas");
    this.canvasContext = this.canvas.getContext("2d");
  }

  async setConfigPath(path) {
    this.pluginsContainer.innerHTML = "";
    const loadedNameElement = this.shadowRoot.querySelector("#loaded-path");
    loadedNameElement.textContent="Loading...";
    if (this.configLoader) {
      this.configLoader.dispose();
    }
    const audioContext = new AudioContext();
    this.configLoader = new ConfigLoader({context:audioContext, pluginRoot:PLUGIN_ROOT});
    await this.configLoader.load(path);
    loadedNameElement.textContent = path;
    Object.entries(this.configLoader.plugins).forEach(([name, plugin]) => {
      const bbPlugin = document.createElement("bb-plugin");
      if (this.configLoader.meta && this.configLoader.meta.positions) {
        const position = this.configLoader.meta.positions[name] || [0,0];
        bbPlugin.setPosition(position);
        if (this.canvasDimensions[0] < position[0] + 100) {
          this.canvasDimensions[0] = position[0] + 100;
        };
        if (this.canvasDimensions[1] < position[1] + 100) {
          this.canvasDimensions[1] = position[1] + 100;
        }
      }
      bbPlugin.setPlugin(name, plugin);
      this.pluginsContainer.appendChild(bbPlugin);
      this.pluginElements[name] = bbPlugin;
    });
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

  drawPatches() {
    this.clearCanvas();
    const context = this.canvasContext;
    const patches = this.configLoader.patches;
    patches.forEach(patch => {
      const type = patch.type;
      const [startX, startY] = this.pluginElements[patch.source].getConnectorPositions()[type + "Out"];
      const [endX, endY] = this.pluginElements[patch.target].getConnectorPositions()[type + "In"];
      context.lineWidth = 1;
      context.strokeStyle = "black";
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
      context.stroke();
    });
  }

  render() {
    return html`
    <style>
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
      
    </div>`;
  }
}

window.customElements.define("bb-stage", BBStage);
