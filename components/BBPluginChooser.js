import { html, render } from "../lib/lit-html/lit-html.js";
import "./BBPluginConfig.js";

class BBPluginChooser extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.plugins = {};
    this.selectedPluginType = null;

    render(this.render(), this.shadowRoot);

    this.pluginConfig = this.shadowRoot.querySelector("#plugin-config");

    const pluginName = this.shadowRoot.querySelector("#plugin-name");
    const pluginSelect = this.shadowRoot.querySelector("#plugin-select");
    const addButton = this.shadowRoot.querySelector("#add-button");
    const cancelButton = this.shadowRoot.querySelector("#cancel-button");

    pluginSelect.addEventListener("change", () => {
      if (pluginSelect.value === "none") {
        addButton.setAttribute("disabled");
        this.selectedPluginType = null;
      } else {
        if (pluginName.value == "") {
          pluginName.value = pluginSelect.selectedOptions[0].innerText;
        }
        addButton.removeAttribute("disabled");
        this.selectedPluginType = pluginSelect.value;
      }
      render(this.render(), this.shadowRoot);
    });

    addButton.addEventListener("click", () => {
      const selectedPluginType = pluginSelect.value;
      const plugin = this.plugins[selectedPluginType];
      const newPluginPath = plugin.path;
      const newPluginName = pluginName.value;
      this.dispatchEvent(
        new CustomEvent("selectplugin", {
          detail: { path: newPluginPath, name: newPluginName, config: this.getConfig() }
        })
      );
    });

    cancelButton.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("cancel"));
    });
  }

  getConfig() {
    return this.pluginConfig.getConfigValues();
  }

  setPlugins(plugins) {
    this.plugins = plugins;
    render(this.render(), this.shadowRoot);
  }

  render() {
    const { plugins, selectedPluginType } = this;
    const config = (plugins[selectedPluginType] && plugins[selectedPluginType].config) || {};
    return html`
      <input id="plugin-name" /><br />
      <select id="plugin-select">
        <option value="none"></option>
        ${Object.entries(plugins).map(
          ([name]) =>
            html`
              <option value="${name}">${name}</option>
            `
        )}
      </select>
      <bb-plugin-config .config=${config} id="plugin-config"></bb-plugin-config>

      <button type="button" id="add-button" disabled>Add</button>
      <button type="button" id="cancel-button">Cancel</button>
    `;
  }
}

window.customElements.define("bb-plugin-chooser", BBPluginChooser);
