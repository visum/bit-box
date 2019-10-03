// A Program is a set of plugins and connections

class Program {
  constructor(config) {
    this.defaultConfig = config;
    if (!config.context) {
      throw new Error("Provide AudioContext to Program constructor");
    }
    this.plugins = {};
    this.patches = [];
    this.meta = { positions: {} };
  }

  async loadPlugin(path, options) {
    const pluginModule = await import(path);
    const Plugin = pluginModule.default;
    const mergedConfig = { ...this.defaultConfig, ...options };

    const plugin = new Plugin(mergedConfig);
    plugin.__path = path;
    return plugin;
  }

  addPlugin(plugin, name) {
    this.plugins[name] = plugin;
    this.meta.positions[name] = [0, 0];
  }

  removePlugin(pluginName) {
    const plugin = this.plugins[pluginName];
    if (!plugin) {
      return;
    }

    this.patches
      .filter(
        patch =>
          patch.source === pluginName || patch.target === pluginName
      )
      .forEach(patch => this.removePatch(patch));
    
    plugin.dispose && plugin.dispose();

    delete this.plugins[pluginName];
  }

  removePatch(patch) {
    const sourcePlugin = this.plugins[patch.source];
    const targetPlugin = this.plugins[patch.target];

    if (patch.type === "event") {
      targetPlugin.unsubscribeFrom(sourcePlugin);
    }

    if (patch.type === "audio") {
      sourcePlugin.disconnect(targetPlugin);
    }

    const patchIndex = this.patches.indexOf(patch);
    this.patches.splice(patchIndex, 1);
  }

  loadPlugins(pluginConfigs, pluginRoot) {
    return pluginConfigs.reduce(async (chain, { path, name, options }) => {
      await chain;
      let pluginPath = path;
      let pathIsAbsolute = path.startsWith("http");
      if (!pathIsAbsolute) {
        pluginPath = pluginRoot + path;
      }
      const plugin = await this.loadPlugin(pluginPath, options);
      this.addPlugin(plugin, name);
    }, Promise.resolve());
  }

  async loadConfig(configPath, pluginRoot) {
    const module = await import(configPath);
    await this.loadPlugins(module.plugins, pluginRoot);
    this.meta = module.meta;
    module.patches.forEach(({ source, target, type }) =>
      this.connect(source, target, type)
    );
  }

  connect(sourceName, targetName, type) {
    const sourcePlugin = this.plugins[sourceName];
    const targetPlugin = this.plugins[targetName];

    if (!sourcePlugin) {
      console.warn(
        `Source plugin not found with name: ${sourceName}. Check that patch names match plugin names`
      );
      return;
    }

    if (!targetPlugin) {
      console.warn(
        `Target plugin not found with name: ${targetName}. Check that patch names match plugin names.`
      );
    }

    if (type === "audio") {
      try {
        sourcePlugin.connect(targetPlugin);
        this.patches.push({
          source: sourceName,
          target: targetName,
          type: "audio"
        });
      } catch (e) {
        console.error(
          `Audio connection failed: ${sourceName} to ${targetName}. ${e.message}`
        );
      }
    } else if (type === "event") {
      try {
        targetPlugin.subscribeTo(sourcePlugin);
        this.patches.push({
          source: sourceName,
          target: targetName,
          type: "event"
        });
      } catch (e) {
        console.error(
          `Event connection failed: ${sourceName} to ${targetName} . ${e.message}`
        );
      }
    } else {
      console.warn(`Unknown patch type ignored: ${type}`);
    }
  }

  dumpConfig(pathPrefix) {
    const pluginConfigs = Object.entries(this.plugins).map(([name, plugin]) => {
      let path = plugin.__path;
      if (path.startsWith(pathPrefix)) {
        path = path.substring(pathPrefix.length);
      }
      const config = { name, path };
      if (plugin.constructor.configTypes) {
        config.options = {};
        Object.keys(plugin.constructor.configTypes).forEach(key => {
          config.options[key] = plugin[key];
        });
      }

      return config;
    });
    const output = `
export const plugins = ${JSON.stringify(pluginConfigs, null, 2)};

export const patches = ${JSON.stringify(this.patches, null, 2)};

export const meta = ${JSON.stringify(this.meta, null, 2)};
    `;
    return output;
  }

  dispose() {
    Object.values(this.plugins).forEach(plugin => {
      if (typeof plugin.dispose === "function") {
        plugin.dispose();
      }
    });
  }
}

export default Program;
