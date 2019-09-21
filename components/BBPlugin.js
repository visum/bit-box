import { html, render } from "../lib/lit-html/lit-html.js";

const isFn = value => typeof value === "function";

class BBPlugin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.position = [0, 0];
    this.dimensions = [100, 60];
    this.dragStartPosition = [0, 0];
    this.name = "";
    this.pluginType = null;

    render(this.render(), this.shadowRoot);

    this.nameField = this.shadowRoot.querySelector("#name");
    this.typeField = this.shadowRoot.querySelector("#type");
    this.eventIn = this.shadowRoot.querySelector("#event-in");
    this.eventOut = this.shadowRoot.querySelector("#event-out");
    this.audioIn = this.shadowRoot.querySelector("#audio-in");
    this.audioOut = this.shadowRoot.querySelector("#audio-out");
    this.handle = this.shadowRoot.querySelector("#handle");
    this.gear = this.shadowRoot.querySelector("#gear");

    this.startDrag = this.startDrag.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.handleDrag = this.handleDrag.bind(this);

    this.attachEventListeners();
  }

  setPlugin(name, plugin) {
    this.pluginName = name;
    this.nameField.textContent = name;
    this.typeField.textContent = plugin.name;
    this.pluginType = plugin.name;

    if (isFn(plugin.connect)) {
      this.audioOut.classList.remove("inactive");
    }
    if (isFn(plugin.getAudioNode)) {
      this.audioIn.classList.remove("inactive");
    }
    if (isFn(plugin.observe)) {
      this.eventOut.classList.remove("inactive");
    }
    if (isFn(plugin.subscribeTo)) {
      this.eventIn.classList.remove("inactive");
    }
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
      this.dispatchEvent(new CustomEvent("configurePlugin", {
        bubbles: true,
        composed: true,
        detail: { pluginName: this.pluginName, pluginType: this.pluginType }
      }));
    });
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
          border: 1px solid black;
          position: absolute;
          width: 100px;
          height: 60px;
        }

        #name {
          font-size: 0.7rem;
          margin: 0;
        }

        #type {
          font-size: 0.6rem;
        }

        #event-connectors {
          position: absolute;
          top: 0;
          width: 100%;
          height: 10px;
        }

        #audio-connectors {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 10px;
        }

        #info {
          position: absolute;
          top: 10px;
          bottom: 10px;
          left: 15px;
          width: 85px;
          background-color: rgba(255, 255, 255, 0.7);
        }

        #handle {
          position: absolute;
          left: 0;
          top: 5px;
          width: 15px;
          height: 15px;
          cursor: grab;
        }

        #gear {
          position: absolute;
          left: 0;
          top: 25px;
          width: 15px;
          height: 15px;
          cursor: pointer;
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
      </style>

      <div id="handle">🖐🏽</div>
      <div id="gear">⚙️</div>
      <div id="info">
        <h3 id="name"></h3>
        <span id="type"></span>
      </div>
      <div id="event-connectors">
        <div id="event-in" class="connector inactive"></div>
        <div id="event-out" class="connector inactive"></div>
      </div>
      <div id="audio-connectors">
        <div id="audio-in" class="connector inactive"></div>
        <div id="audio-out" class="connector inactive"></div>
      </div>
    `;
  }
}

window.customElements.define("bb-plugin", BBPlugin);
