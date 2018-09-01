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
  constructor(defaultContext) {
    this.defaultContext = defaultContext;
    this.audioTargets = {};
  }

  createAudioNodes(tree) {
    const options = removeDollarKeys(tree);
    options.context = this.defaultContext;
    const self = new componentMap.audioComponents[tree.$type](options);

    const name = tree.$name;
    if (name) {
      if (this.audioTargets[name]) {
        console.warn(`Duplicate audio target name: ${name}. The existing target will be unaccessible by this name.`);
      }
      this.audioTargets[name] = self;
    }

    if (!tree.$target && (!tree.$targets || tree.$targets.length === 0)) {
      return self;
    }

    const targets = tree.$targets || [tree.$target];
    const components = targets.map(target => this.createAudioNodes(target));
    components.forEach(target => {
      self.connect(target);
    });

    return self;
  }

  createEventNodes(tree, audioTargets) {
    const options = removeDollarKeys(tree);
    options.context = this.defaultContext;
    if (tree.$audioTarget) {
      if (audioTargets[tree.$audioTarget]) {
        options.audioTarget = audioTargets[tree.$audioTarget];
      } else {
        console.warn("Unknown audio target: " + tree.$audioTarget);
      }
    }
    
    const componentType = componentMap.eventComponents[tree.$type];
    if (!componentType) {
      throw new Error("Unknown event component type: " + tree.$type);
    }

    const self = new componentType(options);

    if (!tree.$target && (!tree.$targets || tree.$targets.length === 0)) {
      return self;
    }

    const targets = tree.$targets || [tree.$target];
    const components = targets.map(target => this.createEventNodes(target, audioTargets));
    components.forEach(target => {
      self.connect(target);
    });
    return self;
  }

  loadSetup(setup) {
    setup.audioTrees.forEach((tree) => {
      this.createAudioNodes(tree);
    });
    setup.eventTrees.forEach((tree) => {
      this.createEventNodes(tree, this.audioTargets);
    });
  }
}
