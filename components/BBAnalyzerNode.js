import { html } from "../lib/lit-html/lit-html.js";
import BBPlugin from "./BBPlugin.js";

class BBAnalyzerNode extends BBPlugin {
  constructor() {
    super();
    this.dimensions = [512, 330];
    this.mode = "time";
    this.running = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.canvas = this.select("#canvas");
    this.canvasContext = this.canvas.getContext("2d");
  }

  attachEventListeners() {
    super.attachEventListeners();

    this.select("#mode-toggle").addEventListener("click", () => {
      this.mode = this.mode === "time" ? "frequency" : "time";
      this.render();
    });
  }

  setPlugin(name, plugin) {
    super.setPlugin(name, plugin);
    this.dataBuffer = plugin.buffer;
    this.start();
  }

  tick() {
    if (this.running) {
      requestAnimationFrame(() => this.draw());
    }
  }

  draw() {
    const { canvasContext, canvas, mode } = this;
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    if (mode === "time") {
      this.drawTimeData();
    } else {
      this.drawFequencyData();
    }
  }

  drawTimeData() {
    const { canvasContext, canvas, _plugin, dataBuffer } = this;
    const { width, height } = canvas;
    _plugin.updateTimeDomainData();
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = "rgb(0,0,0)";
    canvasContext.beginPath();
    const sliceWidth = width / _plugin.bufferSize;
    let x = 0;
    for (let i = 0; i < _plugin.bufferSize; i++) {
      const v = dataBuffer[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }
    canvasContext.lineTo(width, height / 2);
    canvasContext.stroke();
    this.tick();
  }

  averageSlice(array, start, size) {
    let total = 0;
    for (let i = 0; i < size; i++) {
      total += array[i + start];
    }
    return total / size;
  }

  drawFequencyData() {
    // we'll just zoom in on the first 256 values of the data
    const {canvasContext, canvas, _plugin, dataBuffer} = this;
    const {height} = canvas;
    _plugin.updateFrequencyDomainData();
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = "rgb(0,0,0)";
    let x = 0;
    let i = 0;
    while(i < 512) {
      const v = (dataBuffer[i] / 255) * height;
      canvasContext.beginPath();
      canvasContext.moveTo(x, height);
      canvasContext.lineTo(x, height - v);
      canvasContext.stroke();
      x += 1;
      i += 1;
    }
    
    this.tick();
  }

  pause() {
    this.running = false;
  }

  start() {
    this.running = true;
    this.tick();
  }

  getContent() {
    return html`<canvas id="canvas" width="512" height="300"></canvas>`;
  }

  getContentStyles() {
    return `
    #canvas {
      position: relative;
      top: -30px;
    }
    `;
  }

  getTools() {
    return html`<button id="mode-toggle">${this.mode}</button>`;
  }

}

window.customElements.define("bb-analyzer-node", BBAnalyzerNode);
