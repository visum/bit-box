import { html, render } from "../lib/lit-html/lit-html.js";

class BBPluginChooser extends HTMLElement {
  constructor(plugins) {
    super();
    this.attachShadow({ mode: "open" });

    render(this.render(plugins), this.shadowRoot);

    const pluginSelect = this.shadowRoot.querySelector("#plugin-select");
    const addButton = this.shadowRoot.querySelector("#add-button");
    const cancelButton = this.shadowRoot.querySelector("#cancel-button");

    const self = this;

    pluginSelect.addEventListener("change", () => {
      if (this.value === "none") {
        this.setAttribute("disabled");
      } else {
        this.removeAttribute("disabled");
      }
    });

    addButton.addEventListener("click", () => {

    });

    cancelButton.addEventListener("click", () => {
      
    });

  }

  render(plugins) {
    return html`
      <style></style>
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
