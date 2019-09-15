import { html, render } from "../lib/lit-html/lit-html.js";
import ConfigLoader from "../lib/ConfigLoader.js";
import "./BBPlugin.js";

const PLUGIN_ROOT = "../plugins/";

class BBStage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.canvasDimensions = [0, 0];
    this.pluginElements = {};
    this.configs = {};
    
    this.configLoader = null;

    render(this.render(), this.shadowRoot);

    this.container = this.shadowRoot.querySelector("#container");
    this.pluginsContainer = this.shadowRoot.querySelector("#plugins");
    this.canvas = this.shadowRoot.querySelector("canvas");
    this.canvasContext = this.canvas.getContext("2d");
    this.loadedNameElement = this.shadowRoot.querySelector("#loaded-path");

    this.handleDrag = this.handleDrag.bind(this);
  }

  async loadConfig(path) {
    this.clearPlugins();
    this.loadedNameElement.textContent = "Loading...";
    if (this.configLoader) {
      this.configLoader.dispose();
    }
    const audioContext = new AudioContext();
    this.configLoader = new ConfigLoader({
      context: audioContext,
      pluginRoot: PLUGIN_ROOT
    });
    await this.configLoader.load(path);
    this.configs.plugins = this.configLoader.configs.plugins;
    this.configs.patches = this.configLoader.configs.patches;
    this.configs.meta = this.configLoader.configs.meta;
    this.plugins = this.configLoader.plugins;

    this.loadedNameElement.textContent = path;
    Object.entries(this.plugins).forEach(([name, plugin]) => {
      const bbPlugin = document.createElement("bb-plugin");
      if (this.configs.meta && this.configs.meta.positions) {
        const position = this.configs.meta.positions[name] || [0, 0];
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
    });
    this.updateSizes();
    this.drawPatches();
  }

  handleDrag(element, delta) {
    const newPosition = [element.position[0] + delta[0], element.position[1] + delta[1]];
    element.setPosition(newPosition);
    if (this.canvasDimensions[0] < newPosition[0] + 100) {
      this.canvasDimensions[0] = newPosition[0] + 100;
    }
    if (this.canvasDimensions[1] < newPosition[1] + 100) {
      this.canvasDimensions[1] = newPosition[1] + 100;
    }
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
    const patches = this.configs.patches;
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

  getConfigs() {
    const plugins = this.configs.plugins;
    const patches = this.configs.patches;
    const meta =  this.configs.meta;

    Object.entries(this.pluginElements).forEach(([name, element]) => {
      meta.positions[name] = element.position;
    });

    return {plugins, patches, meta};
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
