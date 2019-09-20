import {html, render} from "../lib/lit-html/lit-html.js";
import "./BBStage.js";
import "./BBModal.js";
import "./BBPluginChooser.js";
import pluginRegistry from "../plugins/registry.js";

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
        const {path, name} = event.detail;
        container.removeChild(modal);
        const plugin = await stage.program.loadPlugin(pluginRoot + path);
        stage.program.addPlugin(plugin, name);
        stage.draw();
      });

      container.appendChild(modal);
    });

    dumpConfigButton.addEventListener("click", () => {
      console.log(stage.getConfigDump());
    });

    newProgramButton.addEventListener("click", () => {
      stage.newProgram();
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
        <option>unconnected</option>
        <option>fourths</option>
        <option>linearSamplerDemo</option>
        <option>samplerDemo</option>
        <option>simpleKeyboard</option>
        <option>test</option>
      </select>
      <button id="new-program">New Program</button>
      <button id="dump-config">Dump Config</button>
      <button id="add-plugin">Add Plugin</button>
      <bb-stage id="stage"/>
    </div>
    `;
  }

}

window.customElements.define("bit-box", BitBox);
