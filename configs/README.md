A "config" is a description of plugins and their connections to one another.

The patch file exports two arrays, one called `plugins`, the other called `patches`.

Each entry in the `plugins` array will result in the instantiation of the referenced module. A module can be instantiated multiple times. `plugins` entries are objects with the following keys:

* `path`:`String` A URI path to the plugin module which should be loaded.
* `name`:`String` A user-defined name used to identify this plugin instance when connection modules.
* `options`: `Object` (optional) Will be given to the module constructor.

Each entry in the `patches` array represents a connection between instances of plugins defined in the `plugins` array. `patches` entries are objects with the following keys:

* `source`:`String` The source plugin's name as defined in the `plugins` array.
* `target`:`String` The target plugin's name as defined in the `plugins` array.
* `type`:`"audio" || "event"`. If `"audio"`, a connection between WebAudio API nodes exposed by the source and targets will be made. If `"event"` the `target` will be added to the `source` node's event target list and will be therefore be notified of broadcast events.
