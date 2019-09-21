import { html, render } from "../lib/lit-html/lit-html.js";

class BBPluginConfigField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._value = null;
    render(this.render(), this.shadowRoot);
  }

  getInputElement() {
    return this.shadowRoot.querySelector("#input-field");
  }

  connectedCallback() {
    render(this.render(), this.shadowRoot);
  }

  set value(newValue) {
    const element = this.getInputElement();
    this._value = newValue;
    if (element) {
      this.getInputElement().value = newValue;
    }
  }

  get value() {
    const value = this.getInputElement().value;
    const type = this.type || "string";
    if (type === "number") {
      return parseFloat(value);
    } else if (type === "boolean") {
      return value === "true";
    } else if (Array.isArray(type)) {
      return value;
    }
    return value;
  }

  render() {
    const { _value, type, name } = this;
    return html`
      <div>
        <label>
          <span id="label">${name}</span>
          ${Array.isArray(type)
            ? html`
                <select id="input-field">
                <option></option>${type.map(
                    item =>
                      html`<option ?selected=${item == _value}>${item}</option>`
                  )}</select>`
            : html`
                <input type="text" value=${_value || ""} id="input-field" />
              `}
        </label>
      </div>
    `;
  }
}

window.customElements.define("bb-plugin-config-field", BBPluginConfigField);
