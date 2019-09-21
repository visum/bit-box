import { html, render } from "../lib/lit-html/lit-html.js";
import "./BBPluginConfigField.js";

class BBPluginConfig extends HTMLElement {
  constructor() {
    super();
    this._config = null;
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    render(this.render(), this.shadowRoot);
    this.fieldsContainer = this.shadowRoot.querySelector("#fields-container");
  }

  set config(newValue) {
    this._config = newValue;
    render(this.render(), this.shadowRoot);
  }

  get config() {
    return this._config;
  }

  getConfigValues() {
    return [...this.fieldsContainer.children].reduce((config, element) => {
      const {name, value} = element;
      config[name] = value;
      return config;
    }, {});
  }

  render() {
    const { config, values } = this;
    return html`
      <div id="fields-container">
        ${config && Object.entries(config).map(([name, type]) => {
          return html`
            <bb-plugin-config-field
              .name=${name}
              .type=${type}
              .value=${(values && values[name]) || null}
            />
          `;
        })}
      </div>
    `;
  }
}

window.customElements.define("bb-plugin-config", BBPluginConfig);
