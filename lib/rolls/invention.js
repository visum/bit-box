const sharedEnvelope = {
  attack:{ volume: 1, delay: 0.1 },
  decay:{ volume: 0.8, delay: 0.2},
  sustain:{ volume: 0.5, delay: 0.3},
  release:{ volume: 0.0001, delay: 0.1}
};

export const setup = {
  "eventTrees":[
    {
      $type: "Qwerty",
      $target: {
        $type: "Splitter",
        $targets: [
          {
            $type: "VelocityAdjuster",
            adjustment: 0.4,
            $target: {
              $type: "BasicOscillator",
              waveType: "sawtooth",
              volumeEnvelope: sharedEnvelope,
              $audioTarget: "$main"
            }
          },
          {
            $type: "BasicOscillator",
            volumeEnvelope: sharedEnvelope,
            waveType: "sine",
            $audioTarget: "$main"
          }
        ]
      }
    }
  ],
  "audioTrees":[]
};

export default [

];