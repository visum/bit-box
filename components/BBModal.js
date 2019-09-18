import { html, render } from "../lib/lit-html/lit-html.js";

class BBModal extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: "open"});
    render(this.render(), this.shadowRoot);
  }


  render() {
    return html`
      <style>
        :host {
          box-sizing: border-box;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0,0,0,0.7);
        }

        #container {
          display: flex;
          width: 100%;
          height: 100%;

        }

        #contents {
          background-color: white;
        }
      </style>

      <div id="container">
        <div id="contents">
          <slot></slot>
        </div>
      </div>
    `;
  }

}

window.customElements.define("bb-modal", BBModal);