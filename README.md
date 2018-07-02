# BitMachine
A music machine made in the browser

## Instruments
To make noise, add instruments to the machine. Instruments may generate sound in the machine, or control external devices like MIDI synths. Each instrument is assigned to a track on the machine. A track can have only one instrument at a time.

## Inputs
An input is able to control one or more tracks of the machine.

### Rolls
Rolls are a sequence of commands for the machine. A Roll is a 2D array with rows representing time increments and columns representing tracks. Each cell in the array may have zero or one command.

Rolls may use the `Clock` class for timing and tempo control.

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