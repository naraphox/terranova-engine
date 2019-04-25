var rezsys = {
	"ver": "032019.0920",
	"update_summary": {
		"032019.0920": "Added rezit function to contain what to do with loaded asset data so to resuse code."
	},
	"rezfromfile": function(file,dir,cb=null){
		window.filesys.dirlist(dir,function(res){
			for(var i=0; i < res[0].length; i++){
				if(res[0][i].name.indexOf(file+'_') > 0){
					var thisfile = res[0][i].name;
					window.filesys.readfile(thisfile,dir,function(e){
						window.BABYLON.SceneLoader.ImportMesh("", null, 'data:'+e, scene, window.rezsys.rezit(meshes, particleSystems, skeletons, cb));
					});
				}
			}
		});
	},
	"rezfromdata": (d,cb=null) => {
		window.BABYLON.SceneLoader.ImportMesh("", null, 'data:'+d, scene, window.rezsys.rezit(meshes, particleSystems, skeletons, cb));
	},
	"rezit": (meshes, particleSystems, skeletons, cb=null) => {
		var mesh = meshes[0];
		mesh.phys=true; //temp
		mesh.renderingGroupId=3;
		mesh.isBlocker=true;
		//shadowsys.shadowR(mesh.id,1);
		window.watersys.waterit(mesh.id,1);
		window.BABYLON.Tags.AddTagsTo(mesh, "mesh");
		if(window.sgshadows) window.shadowsys.sgshadow(mesh.id,1);
		if(mesh.phys) mesh.physicsImpostor = new window.BABYLON.PhysicsImpostor(mesh, window.BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
		if(cb!==null) cb();
	}
};
window.console.log('[RezSys] Loaded.');