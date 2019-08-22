const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
    }
  </style>
  <h2 id="title"><slot name="title">Title</slot></h2>
  <div id="test-container"><slot></slot></div>
`;

class TestSuite extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  set title(value) {
    this.shadowRoot.querySelector("#title").textContent = value;
  }

  get title() {
    this.shadowRoot.querySelector("#title").textContent;
  }
}

window.customElements.define("test-suite", TestSuite);