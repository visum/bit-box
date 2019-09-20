import { html, render } from "../lib/lit-html/lit-html.js";

class BBPluginChooser extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    render(this.render(), this.shadowRoot);

    const pluginName = this.shadowRoot.querySelector("#plugin-name");
    const pluginSelect = this.shadowRoot.querySelector("#plugin-select");
    const addButton = this.shadowRoot.querySelector("#add-button");
    const cancelButton = this.shadowRoot.querySelector("#cancel-button");

    pluginSelect.addEventListener("change", () => {
      if (pluginSelect.value === "none") {
        addButton.setAttribute("disabled");
      } else {
        if (pluginName.value == "") {
          pluginName.value = pluginSelect.selectedOptions[0].innerText;
        }
        addButton.removeAttribute("disabled");
      }
    });

    addButton.addEventListener("click", () => {
      const newPluginPath = pluginSelect.value;
      const newPluginName = pluginName.value;
      this.dispatchEvent(
        new CustomEvent("selectplugin", { detail: { path: newPluginPath, name: newPluginName } })
      );
    });

    cancelButton.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("cancel"));
    });
  }

  setPlugins(plugins) {
    render(this.render(plugins), this.shadowRoot);
  }

  render(plugins = {}) {
    return html`
      <style></style>
      <input id="plugin-name" /><br />
      <select id="plugin-select">
        <option value="none"></option>
        ${Object.entries(plugins).map(
          ([name, path]) =>
            html`
              <option value="${path}">${name}</option>
            `
        )}
      </select>
      <button type="button" id="add-button" disabled>Add</button>
      <button type="button" id="cancel-button">Cancel</button>
    `;
  }
}

window.customElements.define("bb-plugin-chooser", BBPluginChooser);
