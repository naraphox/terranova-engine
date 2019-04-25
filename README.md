# Welcome to Terranova Engine Open Source Repo

## About Terranova Engine
Terranova Engine is the engine that will power Werescape which is a peer to peer 
(p2p) based infinite virtual ~~world~~ universe where users can explore galaxies, 
solar systems and their planets, stars, moons, space stations, etc. Users can also own 
planets, regions of space, moons, space stations and so on or just own parcels on said 
planets or moons or rooms on space stations, they can also build, sell and buy objects!

Feel free to help us make the future living infinite virtual universe!  
Werescape is cross-platform and runs on Linux and Windows and eventually Mac OS!

**Please excuse the mess while we get setup here on GitHub!**

## General Project Description
I developed Terranova Engine to be modular and scalable in nature so that people can 
easily work with it for the sake of the project and to be able to use for their own game 
development in the future once we have developed a way to allow for that, we've got 
the basics down for that but I want to add in features to make it easier and remove 
some of the coding from common tasks and make it more like traditional game 
engines before hand.

The base language used for this project is ECMA 6 with CSS 3. The graphics and audio 
library used is a slightly modified version of BabylonJS. Please familiarise yourself with 
BabylonJS if you are not already versed in it!

>https://www.babylonjs.com/

Be sure to keep up with the latest changes and additions to BabylonJS 4.0 as we have 
migrated to the BETA codeset of 4.0 already.

>https://github.com/BabylonJS/Babylon.js/tree/master/dist/preview%20release

The project is separated into JSON modules which are loaded in dynamically. Modules 
can be updated live using the micro auto-updating system which will unload a module 
from memory, load in the revision and continue on thereafter without the need for the 
viewer to be reloaded. Updates are pushed when a pull has been reviewed and 
worked into the main commit.

>**[Contributing To This Project](CONTRIBUTING.md)**  
Click the above link to learn how you can contribute to this project!

## Alpha Testers Welcome!
We are now at the alpha stage of development which means that the very basics are 
now available such as the ability to log on, move around the scene, infinite tile space 
(walk forever), basic GUI is functional, etc. but alpha stage software is generally not 
functional (playable), it is this phase where things are tested for major bugs as things 
get added to the software, so don't expect much in the form of playability during the 
alpha stage!

**Download the ALPHA viewer below!**  
>[Alpha viewer for Linux (64-bit)](https://drive.google.com/file/d/17_SlerOWlgIM1A2FnzzX0HP--t-TMtCW/view?usp=sharing)  
>[Alpha viewer for Windows (64-bit)](https://drive.google.com/file/d/1h6GEnemLLyhcUKzfSOQGE5xFJr8Oa3Tt/view?usp=sharing)

If you get the following message from Windows:
>Windows Defender SmartScreen prevented an unrecognized app from starting.  
Running this app might put your PC at risk.

it is due to the fact the program has not yet been digitally signed. Click the "More 
info" link which will then present the "Run anyway" button which will allow the 
program to run. This is a one time warning, once you have clicked "Run anyway" 
button you will never see the message again!

>**Please be aware that this is NOT the development viewer!**  
If you are contributing to this projects source please [go here](CONTRIBUTING.md) 
for the development viewer!

## What is Limited & What is Not?
The core viewer in it's most basic form (an empty window essentially) is closed source 
and the project leader is the only person to commit code to it, this accounts for about 
5% of the entire project, basically it's just the bits that should never be shown publicly 
for security reasons.

The rest of the code including the entire GUI, 3D scene, simulation, physics, p2p 
communications, cloud signaling infrastructure is all open source and accessible to 
you!

You can feel free to make web enabled modules that extend the games functionality
beyond it's current state such as maybe making a weather module that pulls 
weather data from a real life place and making the weather match in a given area 
in the 3D environment.

## Coding Conventions Used
> Write Beautiful Code - Ryan Farnham (project leader)

Please follow the coding practices that came before you while modifying someone 
else's modules. Feel free to adapt your own style in your own modules but try 
to keep things easily legible, not everyone uses or has the same IDE as you do!

It is suggested to keep your own module code similar to that or the rest of the 
project for consistancy sake and it may be modified in whole or in part by others 
including by the project leader as seen fit.

Please be sure to always reference window object before module and function 
names **_unless_** you are referencing the current module. If you are 
referencing a function within the current module you can use modulename.func()

We use simplified coding wherever possible, such as un-bracketed if statements 
such as:

`if(this==that) my_function(this);`  
`else my_function(somevar);`

Since we're coding in ECMA 6 every space is memory used, so be conscious of this 
at all times as we do not yet minimise code in the live viewer, we will in the 
future.

## Naming Conventions Used
When naming your modules be sure to name the file after the name you have assigned 
the module object, for instance if you name your module in the code similar to:
`var mymodule = {};`
you should name your file mymodule.js as this keeps things straight forward and 
easier for everyone involved. We also typically name modules something like camsys 
or updatesys, but this is optional.

## Regarding Security
This project uses the latest version of NW.JS previously known as Node-Webkit and it's 
NWJC application which compiles our ECMA script into V8 byte code. This protects the 
source from altercation by third parties as it is a one way compiler, there does not 
exist to date a way to decompile the binary files as V8 runs this code directly and does 
not its self decompile it. Also in the debug window it is not possible to directly view the 
source of these bin files without first knowing what you are looking for and everything 
security related are load once self terminating orbjects so they do not remain to be 
accessed via the debug console.

Although it is possible to reference node modules, we do not use them due to the 
exposed source code. If you reference a node module we will get the contents of 
that node module and compile it and reference it to the libs folder.

Since we're working with ECMA 6 we had to make sure there was no way to inject 
code into the loading of the viewer, so the source of index.html and package.json are 
checked against internal copies of the code for altercation. If the code in those two 
files has been modified in any way the viewer will refuse to load. We also do not 
reference any ECMA or JavaScript variants of ECMA directly, this is why node modules 
can not be used directly!

If you have found a security vulnerability DO NOT post it in any of the online 
discussion methods, for security purposes please report it directly to:
> ryan@werescape.com
