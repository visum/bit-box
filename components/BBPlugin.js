import { html, render } from "../lib/lit-html/lit-html.js";

const isFn = value => typeof value === "function";

class BBPlugin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    render(this.render(), this.shadowRoot);

    this.nameField = this.shadowRoot.querySelector("#name");
    this.typeField = this.shadowRoot.querySelector("#type");
    this.eventIn = this.shadowRoot.querySelector("#event-in");
    this.eventOut = this.shadowRoot.querySelector("#event-out");
    this.audioIn = this.shadowRoot.querySelector("#audio-in");
    this.audioOut = this.shadowRoot.querySelector("#audio-out");
  }

  setPlugin(name, plugin) {
    this.nameField.textContent = name;
    this.typeField.textContent = "Type:" + plugin.name;

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

  render() {
    return html`
      <style>
        #container {
          border: 1px solid black;
          position: relative;
          width: 200px;
          height: 80px;
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
          width: 100%;
          padding-left: 5px;
        }

        .connector {
          border: 1px solid black;
          position: absolute;
          width: 10px;
          height: 10px;
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

      <div id="container">
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
      </div>
    `;
  }
}

window.customElements.define("bb-plugin", BBPlugin);
