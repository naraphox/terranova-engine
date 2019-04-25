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
>[Alpha viewer for Linux (64-bit)](https://drive.google.com/uc?id=17_SlerOWlgIM1A2FnzzX0HP--t-TMtCW&export=download)  
>[Alpha viewer for Windows (64-bit)](https://drive.google.com/uc?id=1h6GEnemLLyhcUKzfSOQGE5xFJr8Oa3Tt&export=download)

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
