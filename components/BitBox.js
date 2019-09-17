import {html, render} from "../lib/lit-html/lit-html.js";
import "./BBStage.js";

const configRoot = "../configs/";

class BitBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    render(this.render(), this.shadowRoot);
    
    const configSelect = this.shadowRoot.querySelector("#config");
    const stage = this.shadowRoot.querySelector("#stage");
    const dumpConfigButton = this.shadowRoot.querySelector("#dump-config");

    configSelect.addEventListener("change", async () => {
      const path = configRoot + configSelect.value + ".js";
      stage.loadConfig(path);
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
      <bb-stage id="stage"/>
    </div>
    `;
  }

}

window.customElements.define("bit-box", BitBox);
