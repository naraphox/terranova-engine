var avisys = {
	"ver": "020619.1815",
	"update_summary": {
		"021019.1825": ""
	},
	//Add Player
	"addactor": function(rid,dname,muuid){ //muuid = mesh uuid to load
		try{
			//Check for local model, if found move on else get from asset service
			
			//Load the local model
			window.BABYLON.SceneLoader.ImportMesh("", "player/", "zuleyka.glb", scene, function(meshes, particleSystems, skeletons){
				if(rid==window.uid){ //this viewer
					window.actor = meshes[0];
					window.actor.skel = skeletons[0];
					var actor = window.actor;
					var mass = window.pl_mass;
					//Cam setup --move to camsys
					scene.activeCamera = window.camera;
					window.camera.parent=actor;
					window.camera.attachControl(renderCanvas,true);
					window.camera.setTarget(new window.BABYLON.Vector3(actor.position.x, actor.position.y+3, actor.position.z));
					window.camera.setPosition(new window.BABYLON.Vector3(actor.position.x, actor.position.y+10, actor.position.z));
					window.camera.alpha=window.camalpha;
					window.camera.beta=window.cambeta;
					window.camera.upperAlphaLimit=window.camalpha;
					window.camera.lowerAlphaLimit=window.camalpha;
					window.camera.upperBetaLimit=window.cambeta;
					window.camera.lowerBetaLimit=window.cambeta;
					window.camera.lowerRadiusLimit=5;
					window.camera.upperRadiusLimit=10;
					window.funcsys.createlabel(actor,sanitize.unescape(window.displayname));
				} else { //remote viewer
					window[rid] = meshes[0];
					window[rid].skel = skeletons[0];
					var actor = window[rid];
					var mass = window.pl_mass;
					window.funcsys.createlabel(actor,dname);
					actor.dname = dname;
				}
				actor.id = actor.name = rid;
				actor.isPickable=true;
				window.BABYLON.Tags.AddTagsTo(actor, "actor");
				actor.isBlocker=true;
				actor.getChildMeshes()[0].renderingGroupId=3;
				actor.scaling=new window.BABYLON.Vector3(.4,.4,.4);
				//Animations
				for(var i=0; i < scene.animationGroups.length; i++){
					if(scene.animationGroups[i].targetedAnimations[0].target._parentNode.parent.id == actor.id){
						window.animations[actor.id] = scene.animationGroups[i]; //assign animation to actor, we will store states in this later!
						window.animations[actor.id].states={};
						window.animations[actor.id].speedRatio=0.55;
						window.animations[actor.id].states["idle"]=function(){
							window.animations[actor.id].stop();
							window.animations[actor.id]._from=0.06;
							window.animations[actor.id]._to=3.15;
							window.animations[actor.id].play(true);
							window.animations[actor.id].current=0;
						};
						window.animations[actor.id].states["walk"]=function(){
							window.animations[actor.id].stop();
							window.animations[actor.id]._from=3.4;
							window.animations[actor.id]._to=3.95;
							window.animations[actor.id].play(true);
							window.animations[actor.id].current=1;
						};
						window.animations[actor.id].states["run"]=function(){
							window.animations[actor.id].stop();
							window.animations[actor.id].current=2;
						};
						window.animations[actor.id].states["fly"]=function(){
							window.animations[actor.id].stop();
							window.animations[actor.id].current=3;
						};
						window.animations[actor.id].states["swim"]=function(){
							window.animations[actor.id].stop();
							window.animations[actor.id].current=4;
						};
						window.animations[actor.id].states["crouch"]=function(){
							window.animations[actor.id].stop();
							window.animations[actor.id].current=5;
						};
						window.animations[actor.id].states["stalk"]=function(){
							window.animations[actor.id].stop();
							window.animations[actor.id].current=6;
						};
						window.animations[actor.id].states["prone"]=function(){
							window.animations[actor.id].stop();
							window.animations[actor.id].current=7;
						};
					}
				}
				//Physics
				actor.phys = window.BABYLON.MeshBuilder.CreateBox("actorphys_"+rid, {height: 1, width: .5, depth: .2}, scene);
				actor.phys.physicsImpostor = new window.BABYLON.PhysicsImpostor(actor.phys, window.BABYLON.PhysicsImpostor.BoxImpostor, { mass: mass, friction: 10000, restitution: 0 }, scene);
				actor.getChildMeshes()[0].id=rid+'_body';
				actor.phys.position.y = window.dheight+1;
				actor.phys.visibility=0;
				actor.phys.isPickable=false;
				actor.position.y=-0.5;
				actor.parent=actor.phys;
				//actions
				var func = function(e){
					if(window.debug) window.funcsys.dolog(e.sourceEvent.button);
				};
				window.funcsys.actions(actor.phys,func);
				//finalize
				window.watersys.waterit(actor.getChildMeshes()[0].id,1);
				window.shadowsys.sgshadow(actor.getChildMeshes()[0].id,1);
				window.shadowsys.shadowR(actor.getChildMeshes()[0].id,1);
				if(rid==window.uid) window.actorpresent=1;
			});
		} catch(e){window.funcsys.dolog(e);}
	},
	//Compass Updater
	"movecompass": function(d=0){
		let dtime = scene.getEngine().getDeltaTime();
		var c = $('#compass').css('background-position').split(' ')[1];
		if(d){
			var cc = parseFloat(c)+(.1605)*dtime;
			$('#compass').css('background-position','top 0 left '+cc+'px');
		} else {
			var cc = parseFloat(c)-(.1605)*dtime;
			$('#compass').css('background-position','top 0 left '+cc+'px');
		}
	},
	//Move Character
	"movecharacter": function(){
		let dtime = scene.getEngine().getDeltaTime(); //speed * dtime
		if(window.keys.forw == 1){
			if(window.animations[window.uid].current!=1) window.animations[window.uid].states["walk"]();
			window.actor.phys.translate(window.BABYLON.Axis.Z, window.speed*dtime, window.BABYLON.Space.LOCAL);
			window.comms.moveav(0);
		}
		if(window.keys.forw == 2){
			if(window.animations[window.uid].current!=2) window.animations[window.uid].states["run"]();
			window.actor.phys.translate(window.BABYLON.Axis.Z, window.rspeed*dtime, window.BABYLON.Space.LOCAL);
			window.comms.moveav(2);
		}
		if(window.keys.rev == 1){
			if(window.animations[window.uid].current!=1) window.animations[window.uid].states["walk"]();
			window.actor.phys.translate(window.BABYLON.Axis.Z, -window.speed*dtime, window.BABYLON.Space.LOCAL);
			window.comms.moveav(1);
		}
		//player rotation
		if(window.keys.left == 1){
			window.actor.phys.rotate(window.BABYLON.Axis.Y, -window.rotstep*dtime, window.BABYLON.Space.WORLD);
			window.comms.rotateav(0);
			window.avisys.movecompass(0);
		}
		if(window.keys.right == 1){
			window.actor.phys.rotate(window.BABYLON.Axis.Y, window.rotstep*dtime, window.BABYLON.Space.WORLD);
			window.comms.rotateav(1);
			window.avisys.movecompass(1);
		}
	}
};
window.console.log('[AviSys] Loaded.');