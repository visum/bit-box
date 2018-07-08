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
              $audioTarget: "$main"
            }
          },
          {
            $type: "BasicOscillator",
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