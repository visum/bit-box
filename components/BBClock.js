import { html, render } from "../lib/lit-html/lit-html.js";

class BBClock extends HTMLElement {
  constructor() {
    super();
    this.plugin = null;
    this.position = [0, 0];
    this.dimensions = [220, 90];
    this.dragStartPosition = [0, 0];
    this.pluginObserver = null;
    this.attachShadow({ mode: "open" });

    this.state = {
      tick: 0,
      tickInBeat: 0,
      beat: 0,
      beatInMeasure: 0,
      measure: 0
    };
    this.render();

    this.startDrag = this.startDrag.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.handleDrag = this.handleDrag.bind(this);

    this.e$("#handle").addEventListener("mousedown", this.startDrag);
    this.e$("#handle").addEventListener("mouseup", this.endDrag);

    this.e$("#start").addEventListener("click", () => {
      this.plugin.start();
    });
    this.e$("#pause").addEventListener("click", () => {
      this.plugin.pause();
    });
    this.e$("#reset").addEventListener("click", () => {
      this.plugin.reset();
    });

    this.e$("#event-out").addEventListener("mousedown", () => {
      this.dispatchEvent(
        new CustomEvent("startEventConnection", {
          bubbles: true,
          composed: true,
          detail: { pluginName: this.pluginName }
        })
      );
    });

    this.e$("#gear").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("configurePlugin", {
          bubbles: true,
          composed: true,
          detail: { pluginName: this.pluginName, pluginType: this.pluginType }
        })
      );
    });

    this.e$("#delete").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("deletePlugin", {
          bubbles: true,
          composed: true,
          detail: { pluginName: this.pluginName }
        })
      );
    });
  }

  e$(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  startDrag(event) {
    document.addEventListener("mousemove", this.handleDrag);
    this.dragStartPosition = [event.clientX, event.clientY];
    this.e$("#handle").textContent = "✊🏽";
  }

  endDrag() {
    document.removeEventListener("mousemove", this.handleDrag);
    this.e$("#handle").textContent = "🖐🏽";
  }

  handleDrag(event) {
    const deltas = [
      event.clientX - this.dragStartPosition[0],
      event.clientY - this.dragStartPosition[1]
    ];
    this.dragStartPosition = [event.clientX, event.clientY];
    this.dragHandler(this, deltas);
  }

  setPlugin(name, plugin) {
    if (this.pluginObserver) {
      this.pluginObserver.dispose();
    }
    this.plugin = plugin;
    this.pluginName = name;
    this.pluginType = plugin.name;
    this.shadowRoot.querySelector("#name").textContent = name;

    this.pluginObserver = plugin.observe(event => {
      event.type === "clock" && this.eventHandler(event);
    });
  }

  setPosition([x, y]) {
    this.position = [x, y];
    this.shadowRoot.host.style.left = `${x}px`;
    this.shadowRoot.host.style.top = `${y}px`;
  }

  getConnectorPositions() {
    const [x, y] = this.position;
    const [width] = this.dimensions;
    return {
      eventOut: [x + width - 6, y + 6]
    };
  }

  setDragHandler(handler) {
    this.dragHandler = handler;
  }

  eventHandler(event) {
    if (event.subType === "start") {
      this.running = true;
    }
    if (event.subType === "pause") {
      this.running = false;
    }
    this.state = this.plugin.getState();
    this.render();
  }

  dispose() {
    if (this.pluginObserver) {
      this.pluginObserver.dispose();
    }
  }

  render() {
    render(this.getHTML(), this.shadowRoot);
  }

  getHTML() {
    const { running, state } = this;
    return html`
      <style>
        * {
          box-sizing: border-box;
        }

        :host {
          border: 1px solid black;
          position: absolute;
          width: 220px;
          height: 90px;
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

        #event-connectors {
          position: absolute;
          top: 0;
          width: 100%;
          height: 10px;
        }

        .connector {
          border: 1px solid black;
          position: absolute;
          width: 10px;
          height: 10px;
          cursor: crosshair;
        }

        #event-out {
          top: 0;
          right: 0;
        }

        #delete {
          position: absolute;
          bottom: 0;
          left: 58px;
          cursor: pointer;
        }

        #name {
          font-size: 0.8rem;
          margin: 0;
        }

        #controls {
          position: absolute;
          left: 20px;
          top: 20px;
        }

        #display {
          font-family: "Courier New", courier, monospace;
        }

        #start {
        }

        #pause {
        }

        #reset {
        }
      </style>
      <div id="info">
        <h3 id="name"></h3>
      </div>
      <div id="controls">
        <button id="start" ?disabled=${running}>▶️</button>
        <button id="pause" ?disabled=${!running}>⏸</button>
        <button id="reset" ?disabled=${running}>🔄</button>
        <div id="display">
          ${state.measure}:${state.beatInMeasure}:${state.tickInBeat} B:${state.beat} T:${state.tick}
        </div>
      </div>
      <div id="handle">🖐🏽</div>
      <div id="gear">⚙️</div>
      <div id="delete">🗑</div>
      <div id="event-connectors">
        <div id="event-out" class="connector"></div>
      </div>
    `;
  }
}

window.customElements.define("bb-clock", BBClock);
