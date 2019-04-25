# Contributing To Terranova Engine

## Getting Started
**Step one:**  
Become a contributor of this project by contacting Ryan via:

>ryan@werescape.com

You will receive a developer key that you will need to put into a text file and save it as 
_dev.key_ in to the viewers main folder where the executable is located 
(in the root directory).

Due to security systems in place, the Universe system will not allow a viewer to 
access or login to the service if it doesn't pass various checks, so unless you have 
been granted a developer key which is associated to the hardware of your device, 
you will not be able to login.

 If you plan to use more then one device or you have replaced hardware in your device 
 that has gotten you locked out, please contact Ryan for additional developer keys. 
 There is no need to worry about loosing data if your hardware has changed, we will 
 update the associations on our end wherever it is needed!

The additional developer key will be provided to you, simply paste it into a text file and 
save it as **_dev.key_** in the base folder with the executable. Developer keys are 
device restricted and can only be used with a single device, each additional device will 
require it's own developer key.

Go ahead and download the development viewer which runs the modules and libraries 
from this project:

>[Linux Viewer Download 64-bit](https://drive.google.com/file/d/1CKLtXsfYg29dMvcvEX7M9aOJWuCkwx93/view?usp=sharing)  
>[Windows Viewer Download 64-bit](https://drive.google.com/file/d/1__pfmv5CliUpu7bMNJO_Nen4XnodzaeY/view?usp=sharing)

**Step two:**  
We will then invite you to our Asana team, once you have joined as a contributor.  
Asana is our project management platform. Once invited to our Asana team you can 
use the following link to get to the Terranova Engine project on Asana:

>https://app.asana.com/0/176332491475110/list

Using Asana we can easily track what needs to be done, what has been done and who is 
working on what or who has done work on things. In order to be a contributor of this 
open source project you must be willing to use Asana, trust me, it's easy and makes life 
so much better!

## Developer Documentation
This documentation explains everything you need to know about Terranova Engine and 
how to contribute to it.

>https://docs.google.com/document/d/e/2PACX-1vTKl0fDAE-dQ6NejrN2t-hgP_DLfgyh8HAlQSBZreJ7DO1qCe4gA0USHx_ZOQjmnBAmB5Q-NxJ34pO3/pub

## Things Needing Immediate Attention
There are some things that should be done before we get to adding more to the 
project but please do submit pull requests anyways, these are just things that need 
some focus is all.

* Finish the asset system, work together with Ryan if you plan to tackle this one!
* Update compass to be based off of actual avatar rotation!
* Move Settings to an actual dialog GUI window.
* Update the shadow settings in settings to work with the new shadow system.
* Get a minimap made using a limited areal camera at a set height.
* Limit aforementioned camera to render only specific objects, terrain, etc.

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