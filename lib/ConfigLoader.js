class ConfigLoader {
  constructor(config) {
    this.defaultConfig = config;
    if (!config.context) {
      throw new Error("Provide AudioContext to ConfigReader constructor");
    }
    this.pluginRoot = config.pluginRoot || "./";
  }

  async loadPlugins(pluginArray) {
    return pluginArray.reduce(
      async (accumulatorPromise, { path, name, options }) => {
        const accumulator = await accumulatorPromise;
        const pluginModule = await import(this.pluginRoot + path);
        const Plugin = pluginModule.default;

        const mergedConfig = { ...this.defaultConfig, ...options };

        accumulator[name] = new Plugin(mergedConfig);

        return accumulator;
      },
      Promise.resolve({})
    );
  }

  async load(path) {
    const module = await import(path);
    this.plugins = await this.loadPlugins(module.plugins);
    module.patches.forEach(({ source, target, type }) => {
      const sourcePlugin = this.plugins[source];
      const targetPlugin = this.plugins[target];

      if (!sourcePlugin) {
        console.warn(
          `Source plugin not found with name: ${source}. Check that patch names match plugin names`
        );
        return;
      }

      if (!targetPlugin) {
        console.warn(
          `Target plugin not found with name: ${target}. Check that patch names match plugin names.`
        );
      }

      if (type === "audio") {
        try {
          sourcePlugin.connect(targetPlugin);
        } catch (e) {
          console.error(`Audio connection failed: ${source} to ${target}. ${e.message}`);
        }
      } else if (type === "event") {
        try {
          targetPlugin.subscribeTo(sourcePlugin);
        } catch (e) {
          console.error(`Event connection failed: ${source} to ${target} . ${e.message}`);
        }
      } else {
        console.warn(`Unknown patch type ignored: ${type}`);
      }
    });
  }
}

export default ConfigLoader;
