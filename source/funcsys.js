var funcsys = {
	"ver": "032019.2345",
	"update_summary": {
		"032019.2345": "Added optimizer function for auto optimitation.",
		"031519.1805": "Added debug console function to be called using F4."
	},
	//Mouse Move Callback
	"mousemovecallback": () => {
		var pickResult = scene.pick(scene.pointerX,scene.pointerY);
		if(pickResult.hit){ //detected object
			var picked = pickResult.pickedMesh;
			var pid = pickResult.faceId;
			try{
				if(picked.material.id == 'gridmat' && picked.matchesTagsQuery('terra')){
					var posi = picked.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
					var ind = picked.getIndices();
					var posZ = picked.position.z;
					var posX = picked.position.x;
					//Central
					/*
					if(window.narr.indexOf(pid) == -1 && window.earr.indexOf(pid) == -1 && window.sarr.indexOf(pid) == -1 && 
					window.warr.indexOf(pid) == -1 && window.nearr.indexOf(pid) == -1 && window.searr.indexOf(pid) == -1 && 
					window.swarr.indexOf(pid) == -1 && window.nwarr.indexOf(pid) == -1){
						window.terrasys.terraform([pid],null,picked,posZ,posX,pid,posi,ind,[1,1,0],null);
					} else {
						//North --done
						if(window.narr.indexOf(pid) > -1) window.terrasys.terraform(window.narr,window.narr2,picked,posZ,posX,pid,posi,ind,[1,0,0,0,1,0],'n');
						//East --done
						if(window.earr.indexOf(pid) > -1) window.terrasys.terraform(window.earr,window.earr2,picked,posZ,posX,pid,posi,ind,[1,0,0,0,1,0],'e');
						//South --done
						if(window.sarr.indexOf(pid) > -1) window.terrasys.terraform(window.sarr,window.sarr2,picked,posZ,posX,pid,posi,ind,[0,1,0,1,0,0],'s');
						//West --done
						if(window.warr.indexOf(pid) > -1) window.terrasys.terraform(window.warr,window.warr2,picked,posZ,posX,pid,posi,ind,[0,1,0,0,0,1],'w');
						//SouthEast --done
						if(pid == window.searr[0]) window.terrasys.terraform(window.searr,window.searr2,picked,posZ,posX,pid,posi,ind,[0,0,1,1,0,0],'se');
						if(pid == window.searr[1]) window.terrasys.terraform(window.searr,window.searr2,picked,posZ,posX,pid,posi,ind,[0,0,1,0,1,0],'se');
						//NorthEast --done
						if(pid == window.nearr[0]) window.terrasys.terraform(window.nearr,window.nearr2,picked,posZ,posX,pid,posi,ind,[1,0,0,0,0,1],'ne');
						//SouthWest --done
						if(pid == window.swarr[0]) window.terrasys.terraform(window.swarr,window.swarr2,picked,posZ,posX,pid,posi,ind,[0,1,0,0,1,0],'sw');
						//NorthWest --done
						if(pid == window.nwarr[0]) window.terrasys.terraform(window.nwarr,window.nwarr2,picked,posZ,posX,pid,posi,ind,[1,0,0,0,0,1],'nw');
						if(pid == window.nwarr[1]) window.terrasys.terraform(window.nwarr,window.nwarr2,picked,posZ,posX,pid,posi,ind,[0,1,0,0,0,1],'nw');
					}
					*/
					window.terrasys.terraform([pid],null,picked,posZ,posX,pid,posi,ind,[1,1,0],null);
					posi=ind=posX=posZ=null;
				}
			}catch(e){}
		}
	},	
	//Radar
	"radar": async () => {
		var keys = Object.keys(window.clients);
		for(var i =0; keys.length > i; i++){
			var cmesh = window[keys[i]];
			var cid = cmesh.id;
			var thedist = window.funcsys.getdist({x: cmesh.phys.position.x, y: cmesh.phys.position.y, z: cmesh.phys.position.z},{x: window.actorX, y: window.actorY, z: window.actorZ});
			if(thedist<=25&&thedist>5){ //shout dist
				if(window.radar['3m'].indexOf(cid) > -1) window.radar['3m'].splice(window.radar['3m'].indexOf(cid),1);
				if(window.radar['5m'].indexOf(cid) > -1) window.radar['5m'].splice(window.radar['5m'].indexOf(cid),1);
				if(window.radar['25m'].indexOf(cid) == -1) window.radar['25m'].push(cid);
			}
			if(thedist<=5&&thedist>3){ //normal dist
				if(window.radar['3m'].indexOf(cid) > -1) window.radar['3m'].splice(window.radar['3m'].indexOf(cid),1);
				if(window.radar['25m'].indexOf(cid) > -1) window.radar['25m'].splice(window.radar['25m'].indexOf(cid),1);
				if(window.radar['5m'].indexOf(cid) == -1) window.radar['5m'].push(cid);
			}
			if(thedist<=3){ //whisper dist
				if(window.radar['5m'].indexOf(cid) > -1) window.radar['5m'].splice(window.radar['5m'].indexOf(cid),1);
				if(window.radar['25m'].indexOf(cid) > -1) window.radar['25m'].splice(window.radar['25m'].indexOf(cid),1);
				if(window.radar['3m'].indexOf(cid) == -1) window.radar['3m'].push(cid);
			}
			if(thedist>25){ //out of chat range
				if(window.radar['3m'].indexOf(cid) > -1) window.radar['3m'].splice(window.radar['3m'].indexOf(cid),1);
				if(window.radar['5m'].indexOf(cid) > -1) window.radar['5m'].splice(window.radar['5m'].indexOf(cid),1);
				if(window.radar['25m'].indexOf(cid) > -1) window.radar['25m'].splice(window.radar['25m'].indexOf(cid),1);
			}
		}
	},
	//Dialog Close Event
	"dialogCE": () => {
		var id = $(this).attr('id');
		delete window.dialogs[id];
		$('#dialogmin_'+id).off();
		$("#dialog_"+id).parent().find(".ui-dialog-titlebar-close").unbind("click", window.funcsys.dialogCE);
	},
	//Log Stuff
	"dolog": (msg,type,e) => { //use dolog rather than console.log in case we want to output to custom element (aka make pretty)
		if(window.debug>0){
			if(type === null || type == 1 || type === undefined){
				if(e) window.console.log(msg,e);
				else window.console.log(msg);
			}
			if(type == 2) window.console.dir(msg);
		}
	},
	"notice": (msg,type,buttons=[],id) => {
		if(type==null||type==undefined||type==0){
			var t = 'alert'; //used solely for chat (white background)
			var tm = 5000;
			var cw = ['click'];
		}
		if(type==1){
			var t = 'info';
			var tm = 5000;
			var cw = ['click'];
		}
		if(type==2){
			var t = 'warning';
			var tm = 10000;
			var cw = ['click'];
		}
		if(type==3){
			var t = 'error';
			var tm = false;
			var cw = ['button'];
			if(buttons.length==0) buttons = [
				Noty.button('OK', 'btn btn-success', function(){
					window.notice.close();
				}, {id: 'button1', 'data-status': 'ok'})
			];
		}
		window['notice'] = new window.Noty({
			type: t,
    		text: msg,
			timeout: tm,
			progressBar: true,
			buttons: buttons,
			closeWith: cw
		}).show();
	},
	//Check if even number
	"isEven": (n) => {
		return n % 2 === 0;
	},	
	"getKeyByValue": (object, value) => {
		return Object.keys(object).find(key => object[key] === value)
	},
	//Chat caret placement
	"placeCaretAtEnd": (el) => {
		el.focus();
		if(typeof window.getSelection != "undefined" && typeof document.createRange != "undefined"){
			var range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false);
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	},
	//Calculate Distance --move to math web worker!
	"getdist": (start,end) => {
		var x1 = start.x;
		var y1 = start.y;
		var z1 = start.z;
		var x2 = end.x;
		var y2 = end.y;
		var z2 = end.z;
		return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)+Math.pow(z2-z1,2));
	},
	//Toggle Chat
	"togchat": () => {
		if(!$('.chatlog').is(':visible')){
			window.chatlog=1;
			$('.tempchat').toggle(false);
		} else {
			window.chatlog=0;
			$('.tempchat').toggle(true);
		}
		$('.chatlog').slideToggle('slow', function(){
			$('.chatlog').stop().animate({ scrollTop: $('.chatlog')[0].scrollHeight}, 1000);
		});
	},
	//Minimap
	"minimap": () => {
		scene.activeCameras.push(window.camera);
		scene.activeCameras.push(window.minimapcam);
		window.camera.viewport = new window.BABYLON.Viewport(0, 0, 1, 1);
		window.minimapcam.viewport = new window.BABYLON.Viewport(0.819, 0.028, 0.182, 0.295);
		window.minimapcam.setTarget(new window.BABYLON.Vector3(0,0,0));
	},
	/*
	Actions Manager
		When setting up actions, define the function for what it should do
		then call this function with the function as the second parameter.
			var func = function(e){
				if(window.debug) dolog(e.meshUnderPointer.id);
			};
			actions(mesh2,func);
		Optionally, the third and fourth parameters can be specified to override
		the defaults, so other actions and triggers may be used.
	*/
	"actions": (m,func,act,trig) => {
		if(trig===null||trig===undefined) trig=window.BABYLON.ActionManager.OnPickTrigger; //trigger type defaults to OnPickTrigger
		if(act===null||act===undefined) act=new window.BABYLON.ExecuteCodeAction(trig,func); //action defaults to ExecuteCodeAction
		if(m.actionManager === null) m.actionManager = new window.BABYLON.ActionManager(scene); //if no action manager on mesh, add it
		m.actionManager.registerAction(act); //register action on the action manager for the mesh
	},
	//Physics Functions
	"indupdate": (id,st) => {
		/*	
			This function should be called using a single given mesh instance or 
			by providing the indup array mesh instances then calling this function
			without any parameters and then clearing the indup array afterwards.
				Example:
				indup.push(instance,instance2);
				indupdate(null,1);
			When done with timer updating method call for cleanup, this will stop timer
			and clear the indup array.
				indupdate(null,0);
			While failure to clear the indup array isn't a show stopper, it will lead to
			unneeded updates to the physics engine thus causing additional CPU use.
		*/
		if(id !== null){
			id.physicsImpostor.forceUpdate();
		} else if(id === null && st === null){
			$.each(window.indup, function(i,v){
				if(v !== undefined) v.physicsImpostor.forceUpdate();
			});
		} else if(id === null && st == 1){
			window.indtmr = setInterval(function(){window.funcsys.indupdate(null,null);}, 5000);
		} else if(id === null && st == 0){
			$.each(window.indup, function(i,v){
				if(v !== undefined) v.physicsImpostor.forceUpdate();
			});
			window.clearInterval(window.indtmr); //clear 5 second physics indices updater
			window.indup=[];
		}
	},
	//Translate Gizmo --todo 
	"transgizmo": (obj,st) => {
		if(st=='1'){ //add and enable
			window.init.gizmoManager.positionGizmoEnabled=true;
			window.init.gizmoManager.attachableMeshes.push(obj);
			window.init.gizmoManager.positionGizmoEnabled=true;
			window.init.gizmoManager.attachToMesh(obj);
			if(window.debug) window.funcsys.dolog('[Gizmo] Added Gizmo to: '+obj.id+'.');
		} else { //dispose
			var i = window.init.gizmoManager.attachableMeshes.indexOf(obj);
			window.init.gizmoManager._attachedMesh=null;
			//window.init.gizmoManager.attachableMeshes.splice(i,1);
			window.init.gizmoManager.positionGizmoEnabled=window.init.gizmoManager.rotationGizmoEnabled=window.init.gizmoManager.scaleGizmoEnabled=window.init.gizmoManager.boundingBoxGizmoEnabled=false;
			if(window.debug) window.funcsys.dolog('[Gizmo] Removed Gizmo from: '+obj.id+'.');
		}
	},
	//Label System
    "createlabel": (mesh,txt,off) => {
    	var plane = window.BABYLON.Mesh.CreatePlane(mesh.id+'_label', 2);
		plane.id=plane.name=mesh.id+'_label';
    	plane.parent = mesh;
    	plane.position.y = 2.2;
		plane.renderingGroupId=3;
		plane.billboardMode=7;
		window.norays.push(plane);
		//actions
		var func = function(e){
			window.camera.upperAlphaLimit=window.upperAlphaLimit;
			window.camera.lowerAlphaLimit=window.lowerAlphaLimit;
			window.camera.upperBetaLimit=window.upperBetaLimit;
			window.camera.lowerBetaLimit=window.lowerBetaLimit;
		};
		var func2 = function(e){
			window.camera.upperAlphaLimit=window.camalpha;
			window.camera.lowerAlphaLimit=window.camalpha;
			window.camera.upperBetaLimit=window.cambeta;
			window.camera.lowerBetaLimit=window.cambeta;
		};
		window.funcsys.actions(plane,func,null,window.BABYLON.ActionManager.OnPickDownTrigger);
		window.funcsys.actions(plane,func2,null,window.BABYLON.ActionManager.OnPickUpTrigger);

		//Advanced Texture
		var advancedTexture = window.BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane, 1024, 1024, false);
		advancedTexture.renderAtIdealSize = true;
        var label = new window.BABYLON.GUI.Rectangle(mesh.name+'_lbl');
		window.BABYLON.Tags.AddTagsTo(plane, "actor_label");
        label.background = "black";
		label.fontWeight = 'bold';
        label.height = "60px";
        label.alpha = 0.8;
        label.width = "150px";
        label.cornerRadius = 20;
        label.thickness = 0;
		label.resizeToFit = true;
        advancedTexture.addControl(label); 
        var text1 = new window.BABYLON.GUI.TextBlock();
        text1.text = txt;
        text1.color = "white";
        label.addControl(text1);
    },
	"nonrtf": (fnc,st) => {
		/*	st = state, 1 = load, 0 or any other value means unload
			fnc = the function you wish to load and use
		*/
		if(st==1){ //load function from file, base64 decrypt it
			//window[fnc] = 
			var cb = function(d){
				/*	Should receive decrypted function as string.
					Assign the string to a new function using fnc as the name.
				*/
				window[fnc] = d;
			};
			filesys.dfs_read(fnc,cb,1);
		} else {
			window[fnc] = null;
		}
	},
	"console": () => { //show or hide console
		if(window.conopen==1){
			$('#theconsole').hide();
			window.conopen=0;
		} else {
			$('#theconsole').show();
			$('#theconsole').stop().animate({ scrollTop: $('#theconsole')[0].scrollHeight}, 1000);
			window.conopen=1;
		}
	},
	"settings": () => {
		var html = `
		
		`;
		window.guisys.makedialog('Settings',encodeURIComponent(html));
	},
	"optimize": (t=0) => {
		if(t==1){
			window.opt_options = new window.BABYLON.SceneOptimizerOptions(60, 500);
			window.opt_options.addOptimization(new window.BABYLON.ShadowsOptimization(0));
			window.opt_options.addOptimization(new window.BABYLON.TextureOptimization(1, 2048));
			window.opt_options.addOptimization(new window.BABYLON.HardwareScalingOptimization(2, 2));
			window.optimizer = new window.BABYLON.SceneOptimizer(scene, window.opt_options);
			window.optimizer.start();
		} else {
			window.optimizer.stop();
			window.opt_options=window.optimizer=null;
		}
	}
};
window.console.log('[FuncSys] Loaded.');