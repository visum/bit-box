import {html, render} from "../lib/lit-html/lit-html.js";
import "./BBStage.js";
import ConfigLoader from "../lib/ConfigLoader.js";

const configRoot = "../configs/";

class BitBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    render(this.render(), this.shadowRoot);

    
    
    const configSelect = this.shadowRoot.querySelector("#config");
    const stage = this.shadowRoot.querySelector("#stage");

    configSelect.addEventListener("change", async () => {
      const path = configRoot + configSelect.value + ".js";
      const audioContext = new AudioContext();
      const configLoader = new ConfigLoader({context:audioContext, pluginRoot:"../plugins/"});
      configLoader.load(path);
      configSelect.disabled = true;
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
      </select>
      <bb-stage id="stage"/>
    </div>
    `;
  }

}

window.customElements.define("bit-box", BitBox);
