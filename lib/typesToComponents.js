import Qwerty from "./inputs/Qwerty.js";

import BasicOscillator from "./instruments/BasicOscillator.js";

import Splitter from "./eventTransforms/Splitter.js";
import VelocityAdjuster from "./eventTransforms/VelocityAdjuster.js";
import Transposer from "./eventTransforms/Transposer.js";

import Destination from "./audioNodes/Destination.js";
import SimpleGain from "./audioNodes/SimpleGain.js";

export default { 
  audioComponents:{
    "Destination": Destination,
    "SimpleGain": SimpleGain
  },
  eventComponents:{
    "BasicOscillator": BasicOscillator,
    "Splitter": Splitter,
    "VelocityAdjuster": VelocityAdjuster,
    "Qwerty": Qwerty,
    "Transposer": Transposer
  }
};