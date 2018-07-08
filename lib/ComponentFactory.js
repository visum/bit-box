import componentMap from "./typesToComponents.js";

const removeDollarKeys = obj => {
  const newObj = {};
  Object.keys(obj)
    .filter(key => key.substr(0, 1) !== "$")
    .forEach(key => {
      newObj[key] = obj[key];
    });
  return newObj;
};

export default class ComponentFactory {
  constructor(defaultContext, defaultAudioOutput) {
    this.defaultContext = defaultContext;
    this.defaultAudioOutput = defaultAudioOutput;
  }

  create(tree) {
    const options = removeDollarKeys(tree);
    options.context = this.defaultContext;
    if (tree.$audioTarget === "$main") {
      options.audioTarget = this.defaultAudioOutput;
    }
    const self = new componentMap[tree.$type](options);

    if (!tree.$target && (!tree.$targets || tree.$targets.length === 0)) {
      return self;
    }

    const targets = tree.$targets || [tree.$target];
    const components = targets.map(target => this.create(target));
    components.forEach(target => {
      self.connect(target);
    });
    return self;
  }
}
