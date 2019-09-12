import {html, render} from "../lib/lit-html/lit-html.js";
import ConfigLoader from "../lib/ConfigLoader.js";

const PLUGIN_ROOT = "../plugins/";

class BBStage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    this.configLoader = null;

    render(this.render(), this.shadowRoot);
  }

  async setConfigPath(path) {
    const loadedNameElement = this.shadowRoot.querySelector("#loaded-path");
    loadedNameElement.textContent="Loading...";
    if (this.configLoader) {
      this.configLoader.dispose();
    }
    const audioContext = new AudioContext();
    this.configLoader = new ConfigLoader({context:audioContext, pluginRoot:PLUGIN_ROOT});
    await this.configLoader.load(path);
    loadedNameElement.textContent=path;
  }

  render() {
    return html`<div>Hello, I am the stage! Loaded plugin: <span id="loaded-path">none</span>.</div>`;
  }
}

window.customElements.define("bb-stage", BBStage);
