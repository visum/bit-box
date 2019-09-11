import {html, render} from "../lib/lit-html/lit-html.js";

class BBStage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    render(this.render(), this.shadowRoot);
  }

  render() {
    return html`<div>Hello, I am the stage!</div>`;
  }
}

window.customElements.define("bb-stage", BBStage);
