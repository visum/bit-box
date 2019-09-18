import {html, render} from "../lib/lit-html/lit-html.js";
import "./BBStage.js";
import "./BBModal.js";

const configRoot = "../configs/";

class BitBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    render(this.render(), this.shadowRoot);
    
    const configSelect = this.shadowRoot.querySelector("#config");
    const stage = this.shadowRoot.querySelector("#stage");
    const dumpConfigButton = this.shadowRoot.querySelector("#dump-config");
    const addPluginButton = this.shadowRoot.querySelector("#add-plugin");
    const container = this.shadowRoot.querySelector("#container");

    configSelect.addEventListener("change", async () => {
      const path = configRoot + configSelect.value + ".js";
      stage.loadConfig(path);
    });

    addPluginButton.addEventListener("click", () => {
      const modal = document.createElement("bb-modal");
      container.appendChild(modal);

      setTimeout(() => {
        container.removeChild(modal);
      }, 10000);
    });

    dumpConfigButton.addEventListener("click", () => {
      console.log(stage.getConfigDump());
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
        <option>fourths</option>
        <option>linearSamplerDemo</option>
        <option>samplerDemo</option>
        <option>simpleKeyboard</option>
        <option>test</option>
      </select>
      <button id="dump-config">Dump Config</button>
      <button id="add-plugin">Add Plugin</button>
      <bb-stage id="stage"/>
    </div>
    `;
  }

}

window.customElements.define("bit-box", BitBox);
