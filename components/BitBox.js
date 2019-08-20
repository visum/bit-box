import {html, render} from "../lib/lit-html/lit-html.js";

class BitBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    render(this.render(), this.shadowRoot);
  }

  render(){
    return html`<div>Hello, the world!</div>`;
  }

}

window.customElements.define("bit-box", BitBox);