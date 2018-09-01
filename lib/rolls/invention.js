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
            adjustment: 0.6,
            $target: {
              $type: "Transposer",
              offset: 12,
              $target: {
                $type: "BasicOscillator",
                waveType: "sine",
                volumeEnvelope: sharedEnvelope,
                $audioTarget: "main"
              }
            }
          },
          {
            $type: "VelocityAdjuster",
            adjustment: 0.2,
            $target: {
              $type: "Transposer",
              offset: 7,
              $target: {
                $type: "BasicOscillator",
                waveType: "sine",
                volumeEnvelope: sharedEnvelope,
                $audioTarget: "main"
              }
            }
          },
          {
            $type: "BasicOscillator",
            volumeEnvelope: sharedEnvelope,
            waveType: "sine",
            $audioTarget: "main"
          }
        ]
      }
    }
  ],
  "audioTrees":[
    {
      $type: "SimpleGain",
      $name: "main",
      level: 1,
      $targets: [
        {
          $type: "Destination",
          $name: "destination"
        }
      ]
    }
  ]
};

export default [

];