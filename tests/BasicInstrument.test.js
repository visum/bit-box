import BasicInstrument from "../lib/plugins/BasicInstrument.js";
import Context from "../lib/plugins/Context.js";

const context = new Context();

const gain = context.createGain();
gain.gain.setValueAtTime(0.3, context.currentTime);
gain.connect(context.destination);

const getPromiseNote = ({ frequency, duration, instrument }) => {
  return new Promise((resolve, reject) => {
    const key = instrument.play({ frequency });
    setTimeout(() => {
      instrument.stop(key);
      resolve();
    }, duration);
  });
};

export default () => {
  return new Promise((resolve, reject) => {
    const sine = new BasicInstrument({ context, type: "sine", target: gain });
    getPromiseNote({ instrument: sine, frequency: 440, duration: 500 }).then(
      () => getPromiseNote({ instrument: sine, frequency: 880, duration: 500 })
    ).then(
      () => getPromiseNote({ instrument: sine, frequency: 220, duration: 500 })
    ).then(() => {
      const square = new BasicInstrument({context, type: "square", target: gain});
      square.play({frequency: 380, duration: 250});
    }).then(() => Promise.all([getPromiseNote({ instrument: sine, frequency: 880, duration: 500 }), getPromiseNote({ instrument: sine, frequency: 220, duration: 500 })])).then(resolve);
  });
};
