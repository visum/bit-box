import {html} from "../lib/lit-html/lit-html.js";
import BBPlugin from "./BBPlugin.js";

class BBEventTrigger extends BBPlugin {
  constructor() {
    super();
    this.dimenstions = [140, 80];
  }

  attachEventListeners() {
    super.attachEventListeners();
    this.select("#trigger").addEventListener("click", () => {
      this._plugin.trigger();
    });
  }

  getTools() {
    return html`
    <button id="trigger">🌮</button>
    `;
  }
}

window.customElements.define("bb-event-trigger", BBEventTrigger);
