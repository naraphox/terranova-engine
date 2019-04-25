var tests = {
	"ver": "041519.1805",
	"update_summary": {
		
	},
	"init": function(){
		//test tree
		window.BABYLON.SceneLoader.ImportMesh("", "data/tree1/", "tree1.babylon", scene, function(newMeshes, particleSystems){
			window.tree = newMeshes[0];
			window.tree.renderingGroupId=3;
			window.tree.isBlocker=true;
			window.tree.position.y=10.1;
			window.tree.position.x=window.tree.position.z=10;
			window.tree.id="tree1";
			window.tree.material.subMaterials[1].specularColor = new window.BABYLON.Color3(0,0,0);
			window.tree.material.subMaterials[1].specularPower=0;
			window.tree.scaling=new window.BABYLON.Vector3(0.005,0.005,0.005);
			window.shadowsys.sgshadow(window.tree.id,1);
			watersys.waterit(window.tree.id,1);
			window.BABYLON.Tags.AddTagsTo(tree, "mesh");
			var func2 = function(e){
				if(!giztog){
					giztog=true;
					window.funcsys.transgizmo(tree,1);
				} else {
					window.funcsys.transgizmo(tree,0);
					giztog=false;
				}
			};
			window.funcsys.actions(tree,func2,null,window.BABYLON.ActionManager.OnRightPickTrigger);
		});
	}
};
window.console.log('[Tests] Loaded.');