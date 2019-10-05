# BitBox

A music machine made in the browser

See it in action here: https://visum.github.io/bit-box/

## Features

* 99% browser metal
* No build/transpile
* ES6 modules
* WebComponents (lit-html is the only imported library)

## Overview

BitBox is a system that can be configured with plugins connected to form networks.

While BitBox is designed with web-based music synthesis in mind, the machine can be used for a variety of sequencing, audio processing and event routing tasks, including with MIDI or potentially other hardware devices.

## Getting started

Just clone the repo and serve its contents using a web server of your choice. An easy way to do this is to use `serve` (available on npm), installed globally:

```sh
> npm i -G serve
> cd path/to/bit-box
> serve
```

BitBox itself has no external dependencies, no node modules, no transpiling, nothing. Just serve it straight up.

## Toolbar

Use the toolbar at the top of the window to load preconfigured programs, make a new program, add plugins to the stage, and dump the current config to the console. This last feature can be used to save the current program as a new preset (more on that later).

## Stage

The stage is where the magic happens.

When you click "Add Plugin", you'll see a form to select and configure a plugin. Added plugins appear on the stage and can be moved around by clicking and dragging on the 🖐🏽icon.

You connect plugins to each other by dragging lines from the boxes in the corners of the plugins on the stage. The boxes on the top represent possible _event_ connections, the boxes on the bottom represent possible _audio_ connections. The boxes on the right are outputs, and the ones on the left are inputs.

To remove a connection, double-click a connecting line.

## Plugins

`EventSource`s make things happen by broadcasting events to connected `EventTarget`s. An `EventSource` could be a drum machine, an arpeggiator, or a plugin that listens to the Web MIDI API or the computer's keyboard and emits events into the plugin network. An `EventTarget` recieves events and acts on them by generating audio or firing other events. The transposer, for example, listens for notes, shifts them by the configured `factor`, and emits them as new events.

`AudioSource` plugins supply audio to `AudioTarget` plugins. They can either generate the audio themselves, or modify audio that they recieved. In order to be heard from the computer speakers, an audio network must terminate at the _AudioDestination_, an `AudioTarget` plugin.

Each plugin must be of one of the types `EventSource`, `EventTarget`, `AudioSource`, and `AudioTarget`, and can be any combination, including all of them.

## Networks

When a plugin is added to the stage, it is given a name. The name must be unique among the plugins on the stage. The Add Plugin form pre-fills the name field with the plugin's type (like Gain) if it is empty.

When you drag lines between connector boxes on the plugins, BitBox records the name of the source and target plugins and the type of connection (`audio` or `event`). If you make a program and click the "Dump Config" button, you will see in the console a list of plugins by type with their names and current configuration values, then a list of "patches", or connections, between the plugins. The config dump also contains a "metadata" section which records things like where the plugin is being displayed on the stage.

## Example Program

Do the following:

 1. Click the "New Program" button in the toolbar.
 1. Add a "KeyboardInput" plugin to the stage and name it "input" in the Add Plugin form. Move it down a little to be out of the way of the next plugin you add.
 1. Add a "NoteToFrequency" plugin and move it to the right of your "input" plugin.
 1. Add a "PeriodicWave" plugin, configured as desired (the attack and decay attributes are in seconds), and move it to the right of the NoteToFrequency plugin.
 1. Add a "Gain" plugin, giving it a gain value of about 0.4, and move it into position.
 1. Finally, add a "AudioDestination" plugin and move it into position.

 At this point, you have a lot of plugins on the stage, but no network, so nothing will happen. Under the hood, BitBox has instantiated an `AudioContext`, an `OscillatorNode`, loaded the periodic wave definition and applied it to the oscillator, and instantiated a `Gain` node. None of these nodes have been connected to anything. The `KeyboardInput` plugin has attached key event listeners, and the `NoteToFrequency` plugin hasn't done much of anything.

Notice that the `KeyboardInput` plugin has one connection in the top-right corner. This means it wants to broadcast events. In this case, it will broadcast events that say specific notes (A4, Bb5, etc). should be turned on or off.

The `PeriodicWave` plugin has a box in its top-left corner, which means it response to events. However, it does not respond to note events, (it doesn't know what notes are, just frequencies). The `NoteToFrequency` plugin translates note events into startSounds and stopSound events, so it has to go between the other two in the network.

The `PeriodicWave` plugin has a top-left box (receives events) and a bottom-right box (sends audio). It's job is to make noise at the frequency requested by the events it recieves.

The `Gain` plugin receives and sends audio, modifying it on its way through by making it quieter.

Finally, the `AudioDestination` plugin has only one connection point to receive audio. Audio entering the `AudioDestination` is sent to the `AudioContext.destination`.

Connect the plugins together by clicking in the various output boxes and dragging to the input boxes on the other plugins.

Once everything is connected (KeyboardInput -> NoteToFrequency -> PeriodicWave -> Gain -> AudioDestination), you should be able to hear sound when pressing the home-row keys on your keyboard.

You can configure plugins by clicking on the gear icon. Try turning the volume up or down with the Gain plugin (range is between 0.0 and 1.0), or changing the wavetable on the PeriodicWave.

## Plugin types

### EventSource

Extends `Observable`, which implements `observe`

### EventTarget

Implements `subsribeTo` and `unsubscribeFrom`

### AudioSource

Implements `connect` and `disconnect`, mirroring the platform `AudioNode`.

### AudioTarget

Implements `getAudioNode`
