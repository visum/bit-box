# BitBox
A music machine made in the browser

## Components
A working system is a combination of event sources and targets, and audio sources and targets. Events are messages to turn a note on or off, among other things. An Instrument is an event target and audio source. The final audio source can be found on the Machine's `audioOutput` property, which is connected to a master gain node and finally the computer's speakers.

A simple setup might look like this:
* A `Qwerty` input sends events to...
* a `BasicOscillator` instrument, which generates sound and is connected to...
* the `audioOutput` on the `Machine`.

A more involved setup can have multiple event sources, event transforms (such as the `VelocityAdjuster` and `Splitter`), a series of audio effects, and finally the `audioOutput` on the machine.

## Inputs
An input is able to control one or more tracks of the machine.

### Rolls
Rolls consist of two parts: the setup and the sequence. The setup describes configuration of the event and audio trees. The sequence is a series of commands for the machine. The sequence is an array of arrays. Each array is a sequence of commands, called a "track". Each command is separated from the next by a period of time, expressed in clock ticks.

### MIDI inputs
At some point, it will be possible to control the software instruments in the Machine using an external MIDI controller.

### Computer keyboard
Add a keyboard input to control a track with the computer keyboard.

## Machine Commands
Notes are given as the standard note name + ocatave number, for example: `C4` is middle C.

+[Note][Track]
Turn on specified note on given track

-[Note][Track]
Turn off specified note on given track

## Glossary

### Velocity
Based on the MIDI standard, a number between 0-127, inclusive, that usually determines the volume of the sound played.
