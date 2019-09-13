import {html, render} from "../lib/lit-html/lit-html.js";
import ConfigLoader from "../lib/ConfigLoader.js";
import "./BBPlugin.js";

const PLUGIN_ROOT = "../plugins/";

class BBStage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    this.configLoader = null;
    
    render(this.render(), this.shadowRoot);

    this.pluginsContainer = this.shadowRoot.querySelector("#plugins");
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
      bbPlugin.setPlugin(name, plugin);
      this.pluginsContainer.appendChild(bbPlugin);
    });
  }

  render() {
    return html`
    <style>

    </style>

    <div id="container">
      Loaded plugin: <span id="loaded-path">none</span>.
      <div id="plugins"></div>
    </div>`;
  }
}

window.customElements.define("bb-stage", BBStage);
