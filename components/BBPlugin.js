import { html, render } from "../lib/lit-html/lit-html.js";

class BBPlugin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.position = [0, 0];
    this.dimensions = [140, 80];
    this.dragStartPosition = [0, 0];
    this.pluginType = null;

    this.startDrag = this.startDrag.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  connectedCallback() {
    this.render();

    this.eventIn = this.select("#event-in");
    this.eventOut = this.select("#event-out");
    this.audioIn = this.select("#audio-in");
    this.audioOut = this.select("#audio-out");
    this.handle = this.select("#handle");
    this.gear = this.select("#gear");
    this.delete = this.select("#delete");

    this.attachEventListeners();
  }

  select(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  setPlugin(name, plugin) {
    this.pluginName = name;
    this.pluginType = plugin.name;
    this._plugin = plugin;
    this.render();
  }

  setPosition([x, y]) {
    this.position = [x, y];
    this.shadowRoot.host.style.left = `${x}px`;
    this.shadowRoot.host.style.top = `${y}px`;
  }

  getConnectorPositions() {
    const [x, y] = this.position;
    const [width, height] = this.dimensions;
    return {
      eventIn: [x + 6, y + 6],
      eventOut: [x + width - 6, y + 6],
      audioIn: [x + 6, y + height - 4],
      audioOut: [x + width - 4, y + height - 4]
    };
  }

  setDragHandler(handler) {
    this.dragHandler = handler;
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

  attachEventListeners() {
    this.handle.addEventListener("mousedown", this.startDrag);
    this.handle.addEventListener("mouseup", this.endDrag);

    this.eventOut.addEventListener("mousedown", () =>
      this.dispatchEvent(
        new CustomEvent("startEventConnection", {
          bubbles: true,
          composed: true,
          detail: { pluginName: this.pluginName }
        })
      )
    );

    this.audioOut.addEventListener("mousedown", () =>
      this.dispatchEvent(
        new CustomEvent("startAudioConnection", {
          bubbles: true,
          composed: true,
          detail: { pluginName: this.pluginName }
        })
      )
    );

    this.eventIn.addEventListener("mouseup", () =>
      this.dispatchEvent(
        new CustomEvent("endEventConnection", {
          bubbles: true,
          composed: true,
          detail: { pluginName: this.pluginName }
        })
      )
    );

    this.audioIn.addEventListener("mouseup", () =>
      this.dispatchEvent(
        new CustomEvent("endAudioConnection", {
          bubbles: true,
          composed: true,
          detail: { pluginName: this.pluginName }
        })
      )
    );

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
  }

  dispose() {
    this.handle.removeEventListener("mousedown", this.startDrag);
    this.handle.removeEventListener("mouseup", this.endDrag);
  }

  getContent() {
    // to be overridden by subclasses
    return null;
  }

  getTools() {
    // to be overridden by subclasses
    return null;
  }

  getContentStyles() {
    // to be overridden by subclasses
    return "";
  }

  render() {
    const [width, height] = this.dimensions;
    const { pluginName, pluginType } = this;
    const activeConnectors = {};
    if (this._plugin) {
      activeConnectors.audioOut = this._plugin.connect ? true : false;
      activeConnectors.audioIn = this._plugin.getAudioNode ? true : false;
      activeConnectors.eventOut = this._plugin.observe ? true : false;
      activeConnectors.eventIn = this._plugin.subscribeTo ? true : false;
    }
    const content = html`
      <style>
        * {
          box-sizing: border-box;
        }

        :host {
          border: 1px solid black;
          position: absolute;
          width: ${width}px;
          height: ${height}px;
        }

        #name {
          font-size: 0.8rem;
          margin: 0;
        }

        #type {
          font-size: 0.7rem;
        }

        #info {
          position: absolute;
          top: 25px;
          left: 25px;
          height: 30px;
          width: 85px;
          background-color: rgba(255, 255, 255, 0.7);
        }

        #tools {
          position: absolute;
          left: 20px;
          right: 20px;
          display: flex;
        }

        #standard-tools {
          width: 80px;
          display: flex;
          justify-content: space-between;
        }

        #more-tools {
          padding-left: 10px;
        }

        #handle {
          width: 15px;
          height: 15px;
          cursor: grab;
        }

        #gear {
          width: 15px;
          height: 15px;
          cursor: pointer;
        }

        #delete {
          width: 15px;
          height: 15px;
          cursor: pointer;
        }

        #input-connectors {
          position: absolute;
          left: 0;
          width: 10px;
          top: 0;
          bottom: 0;
        }

        #output-connectors {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 10px;
        }

        .connector {
          border: 1px solid black;
          position: absolute;
          width: 10px;
          height: 10px;
          cursor: crosshair;
        }

        .inactive {
          display: none;
        }

        #event-in {
          top: 0;
          left: 0;
        }

        #event-out {
          top: 0;
          right: 0;
        }

        #audio-in {
          bottom: 0;
          left: 0;
        }

        #audio-out {
          bottom: 0;
          right: 0;
        }

        #content {
          position: absolute;
          top: 60px;
          left: 0px;
          right: 0px;
          bottom: 0;
        }

        ${this.getContentStyles()}
      </style>
      <div id="tools">
        <div id="standard-tools">
          <div id="handle">🖐🏽</div>
          <div id="gear">⚙️</div>
          <div id="delete">🗑</div>
        </div>
        <div id="more-tools">${this.getTools()}</div>
      </div>
      <div id="info">
        <h3 id="name">${pluginName}</h3>
        <span id="type">${pluginType}</span>
      </div>
      <div id="content">${this.getContent()}</div>
      <div id="input-connectors">
        <div
          id="event-in"
          class="connector ${!activeConnectors.eventIn && "inactive"}"
        ></div>
        <div
          id="audio-in"
          class="connector ${!activeConnectors.audioIn && "inactive"}"
        ></div>
      </div>
      <div id="output-connectors">
        <div
          id="event-out"
          class="connector ${!activeConnectors.eventOut && "inactive"}"
        ></div>
        <div
          id="audio-out"
          class="connector ${!activeConnectors.audioOut && "inactive"}"
        ></div>
      </div>
    `;
    render(content, this.shadowRoot);
  }
}

window.customElements.define("bb-plugin", BBPlugin);

export default BBPlugin;
