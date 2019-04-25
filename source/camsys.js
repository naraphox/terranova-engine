var camsys = {
	"ver": "013119.1453",
	"update_summary": {
		"021019.1825": ""
	},
	//Tooggle Camera
	"camtoggle": function(cam){
		scene.activeCamera.detachControl();
			if(window.fxaa) window.pipeline.fxaaEnabled=false;
			if(window.msaa>1) window.pipeline.samples=1;
			if(window.ssao>0) scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline('ssao', scene.activeCamera);
		if(cam===undefined|0){
			if(scene.activeCamera.id=="ArcRotateCamera"){ //default
				scene.activeCamera=window.camera2;
				scene.activeCamera.attachControl(renderCanvas, true);
				scene.activeCamera.position=new window.BABYLON.Vector3(window.actorX, window.actorY+3.8, window.actorZ-15);
			} else if(scene.activeCamera.id=="FreeCamera"){
				scene.activeCamera=window.camera;
				scene.activeCamera.attachControl(renderCanvas, true);
			}
		} else if(cam==1){
			scene.activeCamera=window.camera;
			scene.activeCamera.attachControl(renderCanvas, true);
		} else if(cam==2){
			scene.activeCamera=window.camera2;
			scene.activeCamera.attachControl(renderCanvas, true);
		}
		//post processes
			if(window.fxaa) window.pipeline.fxaaEnabled=true;
			if(window.msaa>1) window.pipeline.samples=window.msaa;
			if(window.ssao>0) scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", scene.activeCamera, true);
		//Other Configs
		scene.activeCamera.minZ=0;
		scene.activeCamera.maxZ=window.cammaxZ;
	},
	"camcallback": function(){
		window.lastcam.x=scene.activeCamera.position.x;
		window.lastcam.y=scene.activeCamera.position.y;
		window.lastcam.z=scene.activeCamera.position.z;
		//resize avatar labels based on camera distance
		var labels = scene.getMeshesByTags("actor_label");
		for(var i=0; i < labels.length; i++){
			var mesh = labels[i];
			var dist = window.funcsys.getdist({x: scene.activeCamera.globalPosition.x, y: scene.activeCamera.globalPosition.y, z: scene.activeCamera.globalPosition.z},{x: mesh.parent.phys.position.x, y: mesh.parent.phys.position.y, z: mesh.parent.phys.position.z});
			if(dist < 6){
				mesh.scalingDeterminant=1;
				mesh.position.y=2.2;
			}
			if(dist >= 6 && dist < 7){
				mesh.scalingDeterminant=1.2;
				mesh.position.y=2.3;
			}
			if(dist >= 7 && dist < 8){
				mesh.scalingDeterminant=1.4;
				mesh.position.y=2.4;
			}
			if(dist >= 8 && dist < 9){
				mesh.scalingDeterminant=1.6;
				mesh.position.y=2.5;
			}
			if(dist >= 9 && dist < 10){
				mesh.scalingDeterminant=1.8;
				mesh.position.y=2.6;
			}
			if(dist >= 10){
				mesh.scalingDeterminant=2.0;
				mesh.position.y=2.7;
			}
			if(dist > 15){
				mesh.visibility=0;
			} else mesh.visibility=1;
		}
	}
};
window.console.log('[CamSys] Loaded.');