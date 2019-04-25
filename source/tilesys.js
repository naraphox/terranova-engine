var tilesys = {
	"ver": "042019.0740",
	"update_summary": {
		"042019.0740": "Created."
	},
	//Current tile occupied by the actor
	"setcurtile": function(){
		window.curtileX = Math.round(window.actor.phys.physicsImpostor.getObjectCenter().x / window.terrasize) * window.terrasize;
		window.curtileZ = Math.round(window.actor.phys.physicsImpostor.getObjectCenter().z / window.terrasize) * window.terrasize;
			if(typeof window.ctile === 'object') window.ltile = window.ctile; //last tile
			else window.ltile = scene.getMeshByID(window.curtileZ+'z'+window.curtileX+'x');
		window.ctile = scene.getMeshByID(window.curtileZ+'z'+window.curtileX+'x');
	},
	//Get Neighboring Tiles
	"tileneighbor": function(){
		if(window.ptiles.length != 0) return false;
		if(window.actorpresent) window.tilesys.setcurtile();
		//load neighboring X tiles, except already loaded ones
		var pZ = 0;
		var pX = 0;
			while(pZ<window.dtval){
				//positive Z
				let z = window.curtileZ;
				var pz = ((window.curtileZ)+(window.tsubdiv)*(pZ));
				var nz = ((window.curtileZ)-(window.tsubdiv)*(pZ));
				var x = window.curtileX;
				let px = ((window.curtileX)+(window.tsubdiv)*(pX));
				let nx = ((window.curtileX)-(window.tsubdiv)*(pX));
				var nn = scene.getMeshByID(pz+'z'+x+'x');
				if(nn === null) window.ptiles.push([pz,x]);
				//negative Z
				nn = scene.getMeshByID(nz+'z'+x+'x');
				if(nn === null) window.ptiles.push([nz,x]);
				//positive X
				nn = scene.getMeshByID(z+'z'+px+'x');
				if(nn === null) window.ptiles.push([z,px]);
				//negative X
				nn = scene.getMeshByID(z+'z'+nx+'x');
				if(nn === null) window.ptiles.push([z,nx]);
				pZ++;
			}
		pZ = 0;
		pX = 0;
			while(pZ<window.dtval){
				let pz = ((window.curtileZ)+(window.tsubdiv)*(pZ));
				let nz = ((window.curtileZ)-(window.tsubdiv)*(pZ));
				while(pX<window.dtval){
					let px = ((window.curtileX)+(window.tsubdiv)*(pX));
					let nx = ((window.curtileX)-(window.tsubdiv)*(pX));
					//positive Z & positive X corner
					var nn = scene.getMeshByID(pz+'z'+px+'x');
					if(nn === null) window.ptiles.push([pz,px]);
					//negative Z & positive X corner
					nn = scene.getMeshByID(nz+'z'+px+'x');
					if(nn === null) window.ptiles.push([nz,px]);
					//positive Z & negative X corner
					nn = scene.getMeshByID(pz+'z'+nx+'x');
					if(nn === null) window.ptiles.push([pz,nx]);
					//negative Z & negative X corner
					nn = scene.getMeshByID(nz+'z'+nx+'x');
					if(nn === null) window.ptiles.push([nz,nx]);
					pX++;
				}
				pX = 0;
				pZ++;
			}
	},
	// Add Tile
	"addtile": function(tileZ,tileX){
		if(!scene.getMeshByID(tileZ+'z'+tileX+'x')){ //if not found add it
			var mesh2 = window.BABYLON.Mesh.CreateGround(tileZ+'z'+tileX+'x', window.terrasize, window.terrasize, window.tinitsize, scene);
			mesh2.material=window.terramat;
			//Set default level
			var ind = mesh2.getIndices();
			var posi = mesh2.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
			for(var i=0; i < ind.length; i++){
				var ind0 = ind[i*3];
				var ind1 = ind[i*3+1];
				var ind2 = ind[i*3+2];
					posi[ind0*3+1]=posi[ind1*3+1]=posi[ind2*3+1]=window.dheight;
			}
			mesh2.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, posi);
			mesh2.position = new window.BABYLON.Vector3(tileX,0,tileZ);
			mesh2.id = mesh2.name = tileZ+'z'+tileX+'x'; //ID based off of coordinates
			window.BABYLON.Tags.AddTagsTo(mesh2, "terra addwater");
				if(window.wireframemode) mesh2.material.wireframe = true;
				mesh2.physicsImpostor = new window.BABYLON.PhysicsImpostor(mesh2, window.BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0, friction: 10000, restitution: 0 }, scene);
				if(window.shadows && window.tshadows) window.shadowsys.tsgshadow(mesh2.id,1);
			window.shadowsys.shadowR(mesh2.id,1);
			mesh2.isBlocker = true;
			mesh2.renderingGroupId=3;
			window.watersys.waterit(mesh2.id,1);
			//Actions
				// This needs moved to actor actions manager
				//	else if(window.picked.matchesTagsQuery('actor')){
				//		document.getElementById('cmenu').style='display:block;position:absolute;top:'+(they-155)+'px;left:'+(thex-225)+'px;';
				//		window.guisys.setcontext({1: {'text':'Profile','func':'window.guisys.closecontext();'}});
				//	} else {
				//		document.getElementById('cmenu').style='display:block;position:absolute;top:'+(they-155)+'px;left:'+(thex-225)+'px;';
				//		window.guisys.setcontext({1: {'text':'About','func':''}, 2: {'text':'Edit','func':''}});
				//	}
			var func1 = function(e){
				window.picked = e.meshUnderPointer;
				if(e.sourceEvent.button==2){
					scene.activeCamera.detachControl(renderCanvas);
					var thex = scene.pointerX;
					var they = scene.pointerY;
						if(window.BABYLON.Tags.HasTags(window.picked)){
							if(window.picked.matchesTagsQuery('terra')){
								try{
									if(window.picked.material.id != 'gridmat' && window.picked.matchesTagsQuery('terra') && window.terraedit.length == 0){
										window.guisys.setcontext({1: {}, 2: {'text':'Edit','func':'window.terrasys.editterra();window.guisys.closecontext();window.ctoggle=true;'}});
										document.getElementById('cmenu').style='display:block;position:absolute;top:'+(they-155)+'px;left:'+(thex-225)+'px;';
									} else if(window.picked.matchesTagsQuery('terra') && window.terraedit.length > 0) window.terrasys.editterra();
								} catch(e){window.funcsys.dolog(e);}
							}
						}
				}
			};
			var func2 = function(e){
				if(e.sourceEvent.button==2){
					var el = document.elementFromPoint(e.sourceEvent.clientX, e.sourceEvent.clientY);
					if($(el).is('.gui, .renderCanvas')) window.guisys.closecontext();
					else $(el).closest('.hexagon').click();
					scene.activeCamera.attachControl(renderCanvas, true);
				}
			};
			window.funcsys.actions(mesh2,func1,null,window.BABYLON.ActionManager.OnPickDownTrigger);
			window.funcsys.actions(mesh2,func2,null,window.BABYLON.ActionManager.OnPickUpTrigger);
			// End Actions
			
			//loadtile(mesh2.id);
			window.rezsys.rezfromfile(tileZ+'z'+tileX+'x','assets'); //load in the objects for the tile
			//join tile presence room
			window.comms.join(mesh2.id);
			
			mesh2=ind=ind0=ind1=ind2=posi=null;
		}
	}
};
window.console.log('[TileSys] Loaded.');