var watersys = {
	"ver": "013119.1453",
	"update_summary": {
		"021019.1825": ""
	},
	"waterit": function(id,t){
		var mesh = scene.getMeshByID(id);
		if(t) window.watermat.addToRenderList(mesh);
		else {
			var w = window.watermat.getRenderList();
			if(id !== null && id !== undefined && id != ""){
				for(var i=0; w.length > i; i++){
					try{
						if(w[i].id == mesh.id && mesh !== null) window.watermat.getRenderList().splice(i, 1);
					} catch(e){}
				}
			}
		}
	},
	"watercallback": function(){
		try{
			//move main water plain with actor
			var thedist = window.funcsys.getdist({x: window.waterMesh.position.x, y: window.waterMesh.position.y, z: window.waterMesh.position.z},{x: window.actorX, y: window.actorY, z: window.actorZ});
			if(thedist > window.terrasize*8){
				window.waterMesh.position.x=window.actorX;
				window.waterMesh.position.z=window.actorZ;
			}
			
			try{
				var meshes = scene.getMeshesByTags("terra || mesh");
				$.each(meshes, function(i,v){
					if(v !== undefined){
						var val = scene.getMeshByID(v.id);
						var thedist = window.funcsys.getdist({x: val.position.x, y: val.position.y, z: val.position.z},{x: scene.activeCamera.globalPosition.x, y: scene.activeCamera.globalPosition.y, z: scene.activeCamera.globalPosition.z});
						//meshes
						if(val.matchesTagsQuery("mesh") && thedist > window.terrasize*8){
							//remove objects and terrain out of range
							var rl = window.watermat.getRenderTargetTextures().data[0]._renderList;
							var result = $.grep(rl, function(e){ return e.id == val.id; });
							if(result.length !== 0){ //already in water list
								rl.forEach(function(v,i){
									if(v.id.indexOf(val.id) !== -1){
										rl.splice(i,1);
										window.watermat.getRenderList().splice(i, 1);
									}
								});
								if(window.debug) window.funcsys.dolog("[WaterSys] Removed "+val.id);
							}
						}
						//terrain
						if(val.matchesTagsQuery("terra") && thedist > window.terrasize*4){
							//remove objects and terrain out of range
							var rl = window.watermat.getRenderTargetTextures().data[0]._renderList;
							var result = $.grep(rl, function(e){ return e.id == val.id; });
							if(result.length !== 0){ //already in water list
								rl.forEach(function(v,i){
									if(v.id.indexOf(val.id) !== -1){
										rl.splice(i,1);
										window.watermat.getRenderList().splice(i, 1);
									}
								});
								if(window.debug) window.funcsys.dolog("[WaterSys] Removed "+val.id);
							}
						}
					}
				});
			} catch(e){if(window.debug) window.funcsys.dolog("[WaterSys C1] Error: "+e);}

			//add objects
			try{
				var w = window.watermat.getRenderList();
				var meshes = scene.getMeshesByTags("terra || mesh");
				$.each(meshes, function(ii,vv){ //add objects and terrain in range
					var thedist = window.funcsys.getdist({x: vv.position.x, y: vv.position.y, z: vv.position.z},{x: scene.activeCamera.globalPosition.x, y: scene.activeCamera.globalPosition.y, z: scene.activeCamera.globalPosition.z});
					//meshes
					if(vv.matchesTagsQuery("mesh") && thedist < window.terrasize*8){
						var result = $.grep(w, function(e){ return e.id == vv.id; });
						if(result.length === 0){ //not already in water list
							window.watersys.waterit(vv.id,1);
							if(window.debug) window.funcsys.dolog("[WaterSys] Added "+vv.id);
						}
					}
					//terrain
					if(vv.matchesTagsQuery("terra") && thedist < window.terrasize*4){
						var result = $.grep(w, function(e){ return e.id == vv.id; });
						if(result.length === 0){ //not already in water list
							window.watersys.waterit(vv.id,1);
							if(window.debug) window.funcsys.dolog("[WaterSys] Added "+vv.id);
						}
					}
				});
			} catch(e){if(window.debug) window.funcsys.dolog("[WaterSys C2] Error: "+e);}
		} catch(e){if(window.debug) window.funcsys.dolog("[WaterSys C3] Error: "+e);}
	}
};
window.console.log('[WaterSys] Loaded.');