const template = document.createElement("template");

template.innerHTML = `
<style>
  :host {
    display: inline;
  }
</style>
<span id="test-results"><slot></slot></span>
`;

class TestResult extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true));
  }
}

window.customElements.define("test-result", TestResult);
