import { html, render } from "../lib/lit-html/lit-html.js";

class BBAnalyzerNode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._plugin = null;
    this.name = "";
    this.position = [0, 0];
    this.dimensions = [512, 300];
    this.pluginType = null;
    this.mode = "time";

    render(this.render(), this.shadowRoot);

    this.gear = this.shadowRoot.querySelector("#gear");
    this.handle = this.shadowRoot.querySelector("#handle");
    this.audioIn = this.shadowRoot.querySelector("#audio-in");
    this.delete = this.shadowRoot.querySelector("#delete");
    this.canvas = this.shadowRoot.querySelector("#canvas");
    this.name = this.shadowRoot.querySelector("#name");
    this.type = this.shadowRoot.querySelector("#type");
    this.modeToggle = this.shadowRoot.querySelector("#mode-toggle");
    this.canvasContext = this.canvas.getContext("2d");
    this.running = false;

    this.startDrag = this.startDrag.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.handleDrag = this.handleDrag.bind(this);

    this.attachEventListeners();
  }

  attachEventListeners() {
    this.handle.addEventListener("mousedown", this.startDrag);
    this.handle.addEventListener("mouseup", this.endDrag);

    this.modeToggle.addEventListener("click", () => {
      this.mode = this.mode === "time" ? "frequency" : "time";
      render(this.render(), this.shadowRoot);
    });

    this.gear.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("configurePlugin", {
          bubbles: true,
          composed: true,
          detail: { pluginName: this.pluginName, pluginType: this.pluginType }
        })
      );
    });

    this.delete.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("deletePlugin", {
          bubbles: true,
          composed: true,
          detail: { pluginName: this.pluginName }
        })
      );
    });

    this.audioIn.addEventListener("mouseup", () =>
      this.dispatchEvent(
        new CustomEvent("endAudioConnection", {
          bubbles: true,
          composed: true,
          detail: { pluginName: this.pluginName }
        })
      )
    );
  }

  handleDrag(event) {
    const deltas = [
      event.clientX - this.dragStartPosition[0],
      event.clientY - this.dragStartPosition[1]
    ];
    this.dragStartPosition = [event.clientX, event.clientY];
    this.dragHandler(this, deltas);
  }

  startDrag(event) {
    document.addEventListener("mousemove", this.handleDrag);
    this.dragStartPosition = [event.clientX, event.clientY];
    this.handle.textContent = "✊🏽";
  }

  endDrag() {
    document.removeEventListener("mousemove", this.handleDrag);
    this.handle.textContent = "🖐🏽";
  }

  setPosition([x, y]) {
    this.position = [x, y];
    this.shadowRoot.host.style.left = `${x}px`;
    this.shadowRoot.host.style.top = `${y}px`;
  }

  getConnectorPositions() {
    const [x, y] = this.position;
    const [, height] = this.dimensions;
    return {
      audioIn: [x + 6, y + height - 4]
    };
  }

  setDragHandler(handler) {
    this.dragHandler = handler;
  }

  setPlugin(name, plugin) {
    this.pluginName = name;
    this.pluginType = plugin.name;
    this._plugin = plugin;
    this.dataBuffer = plugin.buffer;
    this.name.textContent = name;
    this.type.textContent = plugin.name;
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

  dispose() {
    this.handle.removeEventListener("mousedown", this.startDrag);
    this.handle.removeEventListener("mouseup", this.endDrag);
  }

  render() {
    return html`
      <style>
        * {
          box-sizing: border-box;
        }

        :host {
          width: 512px;
          height: 300px;
          position: absolute;
          border: 1px solid black;
        }

        #info {
          position: absolute;
          top: 15px;
          height: 30px;
          left: 25px;
          width: 85px;
          background-color: rgba(255, 255, 255, 0.7);
        }

        #name {
          font-size: 0.8rem;
          margin: 0;
        }

        #type {
          font-size: 0.7rem;
        }

        #handle {
          position: absolute;
          left: 0;
          top: 10px;
          width: 15px;
          height: 15px;
          cursor: grab;
        }

        #gear {
          position: absolute;
          left: 0;
          top: 35px;
          width: 15px;
          height: 15px;
          cursor: pointer;
        }

        #audio-in {
          bottom: 0;
          left: 0;
          border: 1px solid black;
          position: absolute;
          width: 10px;
          height: 10px;
          cursor: crosshair;
        }

        #delete {
          position: absolute;
          bottom: 0;
          left: 58px;
          cursor: pointer;
        }

        #mode-toggle {
          position: absolute;
          top: 0;
          left: 60px;
        }
      </style>
      <canvas id="canvas" width="512" height="300"></canvas>
      <div id="info">
        <h3 id="name"></h3>
        <span id="type"></span>
      </div>
      <div id="handle">🖐🏽</div>
      <div id="gear">⚙️</div>
      <div id="delete">🗑</div>
      <button id="mode-toggle">${this.mode}</button>
      <div id="audio-in"></div>
    `;
  }
}

window.customElements.define("bb-analyzer-node", BBAnalyzerNode);
