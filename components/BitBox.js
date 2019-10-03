import {html, render} from "../lib/lit-html/lit-html.js";
import "./BBStage.js";
import "./BBModal.js";
import "./BBPluginChooser.js";
import "./BBPluginConfig.js";
import pluginRegistry from "../plugins/registry.js";
import registry from "../plugins/registry.js";

const configRoot = "../configs/";
const pluginRoot = "../plugins/";

class BitBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    render(this.render(), this.shadowRoot);
    
    const configSelect = this.shadowRoot.querySelector("#config");
    const stage = this.shadowRoot.querySelector("#stage");
    const dumpConfigButton = this.shadowRoot.querySelector("#dump-config");
    const addPluginButton = this.shadowRoot.querySelector("#add-plugin");
    const newProgramButton = this.shadowRoot.querySelector("#new-program");
    const container = this.shadowRoot.querySelector("#container");

    configSelect.addEventListener("change", async () => {
      const path = configRoot + configSelect.value + ".js";
      stage.loadConfig(path);
      dumpConfigButton.removeAttribute("disabled");
      addPluginButton.removeAttribute("disabled");
    });

    addPluginButton.addEventListener("click", () => {
      const modal = document.createElement("bb-modal");
      const chooser = document.createElement("bb-plugin-chooser");
      chooser.setPlugins(pluginRegistry);
      modal.appendChild(chooser);

      chooser.addEventListener("cancel", async () => {
        container.removeChild(modal);
      });

      chooser.addEventListener("selectplugin", async (event) => {
        const {path, name, config} = event.detail;
        if (stage.program.plugins.hasOwnProperty(name)) {
          alert(`There is already a plugin named ${name}.`);
          return;
        }
        container.removeChild(modal);
        const plugin = await stage.program.loadPlugin(pluginRoot + path, config);
        stage.program.addPlugin(plugin, name);
        stage.draw();
        dumpConfigButton.removeAttribute("disabled");
        addPluginButton.removeAttribute("disabled");
      });

      container.appendChild(modal);
    });

    dumpConfigButton.addEventListener("click", () => {
      console.log(stage.getConfigDump());
    });

    newProgramButton.addEventListener("click", () => {
      stage.newProgram();
      dumpConfigButton.removeAttribute("disabled");
      addPluginButton.removeAttribute("disabled");
    });

    this.addEventListener("configurePlugin", event => {
      const pluginType = event.detail.pluginType;
      const pluginName = event.detail.pluginName;
      const plugin = stage.program.plugins[pluginName];
      const modal = document.createElement("bb-modal");
      const pluginConfigElement = document.createElement("bb-plugin-config");
      pluginConfigElement.config = registry[pluginType].config;
      pluginConfigElement.values = plugin;
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.addEventListener("click", () => {
        const configs = pluginConfigElement.getConfigValues();
        Object.entries(configs).forEach(([name, value]) => {
          plugin[name] = value;
        });
        container.removeChild(modal);
      });
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.addEventListener("click", () => {
        container.removeChild(modal);
      });
      modal.appendChild(pluginConfigElement);
      modal.appendChild(saveButton);
      modal.appendChild(cancelButton);

      container.appendChild(modal);
    });
  }

  render(){
    return html`
    <style>
      #container {
        width: 100%;
        height: 100%;
      }
    </style>
    
    <div id="container">
      <select id="config">
        <option></option>
        <option>analyzer</option>
        <option>delay</option>
        <option>fourths</option>
        <option>linearSamplerDemo</option>
        <option>midi</option>
        <option>reverb</option>
        <option>samplerDemo</option>
        <option>socket</option>
        <option>simpleKeyboard</option>
        <option>periodicWave</option>
        <option>stub</option>
      </select>
      <button id="new-program">New Program</button>
      <button id="dump-config" disabled>Dump Config</button>
      <button id="add-plugin" disabled>Add Plugin</button>
      <bb-stage id="stage"/>
    </div>
    `;
  }

}

window.customElements.define("bit-box", BitBox);
