import { html } from "../lib/lit-html/lit-html.js";
import BBPlugin from "./BBPlugin.js";

class BBClock extends BBPlugin {
  constructor() {
    super();
    this.dimensions = [260, 90];
    this.pluginObserver = null;

    this.state = {
      tick: 0,
      tickInBeat: 0,
      beat: 0,
      beatInMeasure: 0,
      measure: 0
    };
  }

  attachEventListeners() {
    super.attachEventListeners();
    this.select("#start").addEventListener("click", () => {
      this._plugin.start();
    });
    this.select("#pause").addEventListener("click", () => {
      this._plugin.pause();
    });
    this.select("#reset").addEventListener("click", () => {
      this._plugin.reset();
    });
  }

  setPlugin(name, plugin) {
    super.setPlugin(name, plugin);
    if (this.pluginObserver) {
      this.pluginObserver.dispose();
    }
    this.pluginObserver = plugin.observe(event => {
      event.type === "clock" && this.eventHandler(event);
    });
  }

  eventHandler(event) {
    if (event.subType === "start") {
      this.running = true;
    }
    if (event.subType === "pause") {
      this.running = false;
    }
    this.state = this._plugin.getState();
    this.render();
  }

  dispose() {
    super.dispose();
    if (this.pluginObserver) {
      this.pluginObserver.dispose();
    }
  }

  getTools() {
    const {running} = this;
    return html`
    <button id="start" ?disabled=${running}>▶️</button>
    <button id="pause" ?disabled=${!running}>⏸</button>
    <button id="reset" ?disabled=${running}>🔄</button>`;
  }

  getContent() {
    const { state } = this;
    const displayValue = `${state.measure}:${state.beatInMeasure}:${state.tickInBeat} B:${state.beat} T:${state.tick}`;
    return html`<div id="clock-display">${displayValue}</div>`;
  }

  getContentStyles() {
    return `
      #clock-display {
        font-family: monospace;
        padding-left: 30px;
      }
    `;
  }
}

window.customElements.define("bb-clock", BBClock);
