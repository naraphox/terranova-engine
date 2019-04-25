var modsys = {
	"ver": "042019.0820",
	"update_summary": {
		"042019.0820": "Added tilesys.bin above terrasys.bin it has no init at this time."
	},
	"init": function(){
		nw.Window.get().evalNWBin(null, 'bin/sysinfo.bin');
		nw.Window.get().evalNWBin(null, 'bin/camsys.bin');
		nw.Window.get().evalNWBin(null, 'bin/guisys.bin');
		nw.Window.get().evalNWBin(null, 'bin/init.bin');
		nw.Window.get().evalNWBin(null, 'bin/filesys.bin');
		nw.Window.get().evalNWBin(null, 'bin/funcsys.bin');
		nw.Window.get().evalNWBin(null, 'bin/comms.bin');
		nw.Window.get().evalNWBin(null, 'bin/skysys.bin');
		nw.Window.get().evalNWBin(null, 'bin/avisys.bin');
		nw.Window.get().evalNWBin(null, 'bin/shadowsys.bin');
		nw.Window.get().evalNWBin(null, 'bin/rezsys.bin');
		nw.Window.get().evalNWBin(null, 'bin/tilesys.bin');
		nw.Window.get().evalNWBin(null, 'bin/terrasys.bin');
		nw.Window.get().evalNWBin(null, 'bin/watersys.bin');
		nw.Window.get().evalNWBin(null, 'bin/tests.bin');
		nw.Window.get().evalNWBin(null, 'bin/cryptsys.bin');
		nw.Window.get().evalNWBin(null, 'bin/updatesys.bin');
		nw.Window.get().evalNWBin(null, 'bin/welcome.bin');
	},
	"start": function(){
		guisys.init();
		init.initphys();
		init.initcam();
		init.initsun();
		window.skysys.init();
		init.initsky();
		init.initwater();
		init.initactions();
		init.initlensflare();
		window.terrasys.init();
		init.initterra();
		init.initglow();
		init.initshadows();
		avisys.addactor(window.uid);
		init.initfog();
		init.initpipeline();
		init.inithighlights();
		comms.init(window.uid);
		tests.init();
		init.finalinit();
	}
};
window.console.log('[ModSys] Loaded.');