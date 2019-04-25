var shadowsys = {
	"ver": "013119.1453",
	"update_summary": {
		"021019.1825": ""
	},
	//recieve shadows
	"shadowR": function(id,t){
		var mesh = scene.getMeshByID(id);
		if(t) mesh.receiveShadows=true;
		else mesh.receiveShadows=false;
	},
	//object shadows
	"sgshadow": function(id,t){
		var mesh = scene.getMeshByID(id);
		if(t) window.sg.getShadowMap().renderList.push(mesh);
		else {
			var shad = window.sg.getShadowMap().renderList;
			for(var i=0; shad.length > i; i++){
				if(shad[i].id == mesh.id) window.sg.getShadowMap().renderList.splice(i, 1);
			}
		}
	},
	//terrain shadows --todo check if still needed or can share same shadow generator as sg
	"tsgshadow": function(id,t){
		/*
		var mesh = scene.getMeshByID(id);
		if(t) window.terrain_sg.getShadowMap().renderList.push(mesh);
		else {
			var shad = window.terrain_sg.getShadowMap().renderList;
			for(var i=0; shad.length > i; i++){
				if(shad[i].id == mesh.id) window.terrain_sg.getShadowMap().renderList.splice(i, 1);
			}
		}
		*/
	},
	//shadow callback
	"shadowcallback": function(){
		var shad = window.sg.getShadowMap().renderList;
		var meshes = scene.getMeshesByTags("mesh");
		for(var i=0; i < meshes.length; i++){
			var themesh = meshes[i];
			var thedist = window.funcsys.getdist(
				{x: themesh.position.x, y: themesh.position.y, z: themesh.position.z},
				{x: scene.activeCamera.globalPosition.x, y: scene.activeCamera.globalPosition.y, z: scene.activeCamera.globalPosition.z}
			);
			if(thedist > window.terrasize*2/1.8823529412){ //68m out we remove shadows
				var result = $.grep(shad, function(e){ return e.id == themesh.id; });
				if(result.length > 0){ //found mesh in shadow list, so remove it
					window.shadowsys.sgshadow(themesh.id,0);
					if(window.debug) window.funcsys.dolog('[ObjShadow] Removed '+themesh.id);
				}
			}
		}
		for(var i=0; i < meshes.length; i++){
			var themesh = meshes[i];
			var thedist = window.funcsys.getdist(
				{x: themesh.position.x, y: themesh.position.y, z: themesh.position.z},
				{x: scene.activeCamera.globalPosition.x, y: scene.activeCamera.globalPosition.y, z: scene.activeCamera.globalPosition.z}
			);
			if(thedist < window.terrasize*2/1.8823529412){ //add to shadow map
				var result = $.grep(shad, function(e){ return e.id == themesh.id; });
				if(result.length == 0){ //not found in shadows list
					window.shadowsys.sgshadow(themesh.id,1);
					if(window.debug) window.funcsys.dolog('[ObjShadow] Added '+themesh.id);
				}
			}
		}
	}
};
window.console.log('[ShadowSys] Loaded.');