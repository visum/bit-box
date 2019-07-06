import BasicOscillator from "../lib/plugins/BasicOscillator.js";
import Context from "../lib/plugins/Context.js";

const context = new Context();

export default () => {
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.3, context.currentTime);

  gain.connect(context.destination);

  const osc = new BasicOscillator({
    context,
    frequency: 440,
    type: "sine",
    target: gain
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      osc.stop();
      resolve();
    }, 1000);

    osc.start();
  });
};
