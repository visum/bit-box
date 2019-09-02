import ConfigLoader from "../../lib/ConfigLoader.js";

const configPath = "../../configs/fourths.js";

document.getElementById("go").addEventListener("click", () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();

  const loader = new ConfigLoader({context, pluginRoot:"../plugins/"});

  loader.load(configPath);
});