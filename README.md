# BitBox

A music machine made in the browser

BitBox is a system that can be configured with a series of modules connected together in arbitrary networks intended for web audio synthesis.

Predefined configurations of module networks can be provided on a “reel” which describes time-stamped instructions in BitBox Reel Language, or BBRL (pronounced “burbble”).

While BitBox is designed with web-based music synthesis in mind, the machine can be used for a variety of sequencing, audio processing and event routing tasks, including MIDI or other hardware devices.

## Interface

The user interface consists of a toolbar presents tools like start/pause/rewind buttons, tempo control, the current timestamp, etc. Below the toolbar, filling most of the window, is the stage, where modules are added, removed, and connected to one another.

### Toolbar

The toolbar contains the following tools:

* _Master Volume_ control
* _Transport_ controls (start/stop/pause/rewind, timecode, tempo)
* _Panic Button_ stops everyting going on in the machine, events and audio
* _Load Button_ for loading BBRL files
* _Save Button_ for saving current configuration to a BBRL file

### Stage

The stage is where the magic happens. It always has at least two modules on it:

* The _Clock_ is an `EventSource`/`EventTarget` module that broadcasts information about the time state of the machine: whether it is running or stopped, the current tempo, and the current time stamp. It can also recieve events telling the machine to stop, rewind, seek to a specific time stamp, etc. It is bound to the transport tools in the toolbar.
* The _AudioDestination_ is the ultimate audio output for the modules, and is connected to the `AudioContext.destination` node by way of the master volume control in the toolbar.

There are a few other controls on the stage as well:

* The floating _Add Module_ button is positioned in the lower-right of the stage
* _Zoom_ controlls allow the user to zoome in and out on the stage.
* By clicking anywhere on the stage where there is no module, the user can pan around.

## Modules

The BitBox is programmed by adding modules to the stage and connecting them to form networks. 

`EventSource`s make things happen by broadcasting events to connected `EventTarget`s. An `EventTarget` could be a drum machine, an arpeggiator, or a module that listens to the Web MIDI API or the computer's keyboard and emits events into the module network. And `EventTarget` recieves events and acts on them by generating audio or firing other, modified events (a transposer, for example).

`AudioSource` modules supply audio to `AudioTarget` modules. They can either generate the audio themselves, or modify audio that they recieved. In order to be heard from the computer speakers, an audio network must terminate at the _AudioDestination_, an `AudioTarget` module that is built-in to the stage.

Each module must be of one of the types `EventSource`, `EventTarget`, `AudioSource`, and `AudioTarget`, and can be any combination, including all of them.

### Networks

Modules on the stage will indicate their Audio/Event Source/Target properties by displaying appropriate handles and drop-zones. Click and drag from a module's EventSource handle to another module's EventTarget dropzone to connect the two modules. Do a similar thing with a modules' Audio Source/Target zones to connect audio modules. The connections between all of the modules on the stage form an event network and audio network.
