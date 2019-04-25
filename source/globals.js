var globals = {
	"ver": "03219.1415",
	"update_summary": {
		"021019.1825": ""
	},
	"init": function(){
		//General
		window.conopen=0; //console open or not
		window.updates={}; //list of pending updates
		window.veri='s9df7489gd9sgh9ow9syhdd'; //universe authentication key
		window.plat='lin64'; //holds platform type mainly used for updates
		window.uuid=''; //holds this viewers uuid
		window.uid=''; //holds this viewers internal id
		window.tick=0; //server frame tick, resets at 60
		window.debug=1;
		window.port=28520;
		window.inv_open=0;
		window.map_open=0;
		window.ctrl=0;
		window.shift=0;
		window.alt=0;
		window.runtimer=0;
		window.jump=0;
		window.stog=0;
		window.wireframemode=false;
		window.lclick=0; //holds mousedown state
		window.dialogs={};
		window.PI=Math.PI;
		//Radar System
		window.radar={};
		window.radar['3m']=[];
		window.radar['5m']=[];
		window.radar['25m']=[];
		//Rendering
		window.fxaa=false;
		window.msaa=1;
		window.ssao=0;
		window.water=true;
		window.lflare=true;
		window.bloom=true;
		window.bweight=0.25;
		window.bscale=0.5;
		window.exposure=1.1;
		window.contrast=1.1;
		window.chromatic=0; //for old style red/blue 3D glasses
		window.gl_inc={}; //objects containing objects with properties
		//Physics
		window.grav=-10;
		window.indup=[]; //indices needing updated
		window.indtmr=null; //holds indices update timer
		//Actor
		window.displayname='Nara Phox';
		window.mt=null; //movement timer for terrain tile checking
		window.actorX=null;
		window.actorY=null;
		window.actorZ=null;
		window.keys={letft:0,right:0,forw:0,rev:0};
		window.movelock=0;
		window.speed=0.0015;
		window.rspeed=0.0031;
		window.rotstep=0.0028;
		window.actorpresent=0;
		window.pl_mass=100;
		window.animations={};
		//Lights
		window.timeoverride=false;
		window.vol_light=true;
		window.sunorbdelta=0;
		window.sunorbdis=29000;
		window.sunspeed=0.0001;
		window.sunintensity=1;
		window.sunmove=true;
		window.moonintensity=0.25;
		window.norays=[];
		//Camera
		window.fov=0.8;
		window.camalpha=window.PI/2;
		window.cambeta=1.6;
		window.camminZ=0;
		window.cammaxZ=1500000;
		window.upperAlphaLimit=4.6;
		window.lowerAlphaLimit=-1.35;
		window.lowerBetaLimit=0.4;
		window.upperBetaLimit=window.PI/1.95;
		window.lastcam=[];
		//Sky
		window.skyrotspeed=0.00005;
		window.time=0; //sky shader timeslice
		window.cr=1; //cloud colours
		window.cg=1;
		window.cb=1;
		//Tiles
		window.toolstrength=0.05; //strength of terraform tool
		window.tooltype='raise'; //raise; lower; flatten; zero; smooth
		window.toolradius=1; //2 = effect faces directly around current face; 4 = 2 face radius around current face; etc.
		window.fl_last=null; //holds last value for flatten tool
		window.curtileX=0;
		window.curtileZ=0;
		window.ctile; //holds current tile object
		window.terrasize=64; //size of terrain tile
		window.tsubdiv=64; //terrain tile subdivisions
		window.tinitsize=2; //initial subdivisions
		window.tcnt=0;
		window.dheight=10; //default terra height
		window.terrapresent=0; //whether or not terrain is present; must be present before actor is loaded in scene unless in space
		window.dtval=3; //how far out should terrain tiles be generated; this determines draw distance
		window.terraedit=[]; //holds which tiles are in terraform mode
		window.ptiles=[]; //pending tiles to rez
		//Shadows
		window.shadows=0; //shadows on/off
		window.tshadows=2; //terrain shadow
		window.sgshadows=2; //object shadows
		//Fog
		window.fogStart=102;
		window.fogEnd=128;
		window.fogR=0.28;
		window.fogG=0.55;
		window.fogB=1;
		window.fogtype=3;
		//Context Menu
		window.ctoggle=false; //context menu open or not
		//Object Editor
		window.giztog=false;
		//Presence Server
		window.servcon=false; //set true once conntected to presence server
		window.clients=[]; //keep track of local client peer id's using this array
		window.registered=false; //are we registered with presence server?
		//p2p
		window.offers = {};
		window.answers = {};
		window.candidates = {};
		window.move = {}; //JSON of type of movement should be performed, e.g. window.move[uid] = {"type":"0"} 0 for walk, 1 for run, etc.
		window.rotate = {}; //JSON of type of rotation should be performed, e.g. window.move[uid] = {"type":"1"} 0 for left, 1 for right
		window.p2passets = {}; //hols list of assets a peer has, use this to request actual asset from the peer!
	}
};
window.console.log('[Globals] Loaded.');