const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
  }

  h3 {
    margin-bottom: 0;
  }

  #passes {
    color: green;
  }

  #fails {
    color: red;
  }
</style>
<h3 id="title"><slot name="title"></slot></h3>
<div><span id="passes">0</span> - <span id="fails">0</span></div>
<div id="messages"></div>
`;


const failTemplate = document.createElement("template");
failTemplate.innerHTML = `<div id="message"></div>`;

class TestCase extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode:"open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.passes = 0;
    this.fails = 0;
    this.pass.bind(this);
    this.fail.bind(this);
  }

  set title(value) {
    this.shadowRoot.querySelector("#title").textContent = value;
  }

  get title() {
    this.shadowRoot.querySelector("#title").textContent;
  }

  pass() {
    this.passes++;
    this.shadowRoot.querySelector("#passes").textContent = this.passes;
  }

  fail(message) {
    this.fails++;
    this.shadowRoot.querySelector("#fails").textContent= this.fails;
    const failMessageElement = failTemplate.content.cloneNode(true);
    failMessageElement.textContent = message;
    this.shadowRoot.querySelector("#messages").appendChild(failMessageElement);
  }
}

window.customElements.define('test-case', TestCase);