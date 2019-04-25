var terrasys = {
	"ver": "042519.0300",
	"update_summary": {
		"042519.0300": "Removed references to window.debug.",
		"042019.0740": "Removed setcurtile and addtile functions, moved them to tilesys module.",
		"032019.2230": "Updated window.rezsys.rezit to use window.rezsys.rezfromfile."
	},
	"init": function(){
		//Create tri-planar material
		window.trimat = new window.BABYLON.TriPlanarMaterial("trimat", scene);
		window.trimat.diffuseTextureX = new window.BABYLON.Texture("img/rock.png", scene);
		window.trimat.diffuseTextureY = new window.BABYLON.Texture("img/grass.png", scene);
		window.trimat.diffuseTextureZ = new window.BABYLON.Texture("img/floor.png", scene);
		window.trimat.normalTextureX = new window.BABYLON.Texture("img/rockn.png", scene);
		window.trimat.normalTextureY = new window.BABYLON.Texture("img/grassn.png", scene);
		window.trimat.normalTextureZ = new window.BABYLON.Texture("img/rockn.png", scene);
		window.trimat.specularPower=64;
		window.trimat.tileSize=8;
		window.trimat.needDepthPrePass=true;
		/*
		//Terrain FaceID Arrays
		// NORTH SIDE
		window.narr = [1987,1989,1991,1993,1995,1997,1999,2001,2003,2005,2007,2009,2011,2013,2015,2017,2019,2021,2023,2025,2027,2029,2031,2033,2035,2037,2039,2041,2043,2045,2047];
		window.narr2 = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60];
		// EAST SIDE
		window.earr = [65,129,193,257,321,385,449,513,577,641,705,769,833,897,961,1025,1089,1153,1217,1281,1345,1409,1473,1537,1601,1665,1729,1793,1857,1921];
		window.earr2 = [127,191,255,319,383,447,511,575,639,703,767,831,895,959,1023,1087,1151,1215,1279,1343,1407,1471,1535,1599,1663,1727,1791,1855,1919,1983];
		// SOUTH SIDE
		window.sarr = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60];
		window.sarr2 = [1987,1989,1991,1993,1995,1997,1999,2001,2003,2005,2007,2009,2011,2013,2015,2017,2019,2021,2023,2025,2027,2029,2031,2033,2035,2037,2039,2041,2043,2045,2047];
		// WEST SIDE/
		window.warr = [126,190,254,318,382,446,510,574,638,702,766,830,894,958,1022,1086,1150,1214,1278,1342,1406,1470,1534,1598,1662,1726,1790,1854,1918,1982];
		window.warr2 = [65,129,193,257,321,385,449,513,577,641,705,769,833,897,961,1025,1089,1153,1217,1281,1345,1409,1473,1537,1601,1665,1729,1793,1857,1921];
		// SE Corner
		window.searr = [0,1];
		window.searr2 = [1985,62];
		// NE Corner
		window.nearr = [1985];
		window.nearr2 = [0];
		// SW Corner
		window.swarr = [62];
		window.swarr2 = [2047];
		// NW Corner
		window.nwarr = [2046,2047];
		window.nwarr2 = [0,1];
		*/

		/* ignored verts */
		window.noup = [
			8065,7937,7809,7681,7553,7425,7297,7169,7041,6913,6785,6657,6529,6401,6273,6145,
			6017,5889,5761,5633,5505,5377,5249,5121,4993,4865,4737,4609,4481,4353,4225,4097,
			3969,3841,3713,3585,3457,3329,3201,3073,2945,2817,2689,2561,2433,2305,2177,2049,
			1921,1793,1665,1537,1409,1281,1153,1025,897,769,641,513,385,257,129,1,
				0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,
				32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,
				64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,
				96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,
			254,382,510,638,766,894,1022,1150,1278,1406,1534,1662,1790,1918,2046,2174,
			2302,2430,2558,2686,2814,2942,3070,3198,3326,3454,3582,3710,3838,3966,4094,4222,
			4350,4478,4606,4734,4862,4990,5118,5246,5374,5502,5630,5758,5886,6014,6142,6270,
			6398,6526,6654,6782,6910,7038,7166,7294,7422,7550,7678,7806,7934,8062,8190,
				127,255,383,511,639,767,895,1023,1151,1279,1407,1535,1663,1791,1919,2047,
				2175,2303,2431,2559,2687,2815,2943,3071,3199,3327,3455,3583,3711,3839,3967,4095,
				4223,4351,4479,4607,4735,4863,4991,5119,5247,5375,5503,5631,5759,5887,6015,6143,
				6271,6399,6527,6655,6783,6911,7039,7167,7295,7423,7551,7679,7807,7935,8063,
			8067,8069,8071,8073,8075,8077,8079,8081,8083,8085,8087,8089,8091,8093,8095,8097,
			8099,8101,8103,8105,8107,8109,8111,8113,8115,8117,8119,8121,8123,8125,8127,8129,
			8131,8133,8135,8137,8139,8141,8143,8145,8147,8149,8151,8153,8155,8157,8159,8161,
			8163,8165,8167,8169,8171,8173,8175,8177,8179,8181,8183,8185,8187,8189,8191,
				8064,8066,8068,8070,8072,8074,8076,8078,8080,8082,8084,8086,8088,8090,8092,8094,8096,
				8098,8100,8102,8104,8106,8108,8110,8112,8114,8116,8118,8120,8122,8124,8126,8128,8130,
				8132,8134,8136,8138,8140,8142,8144,8146,8148,8150,8152,8154,8156,8158,8160,8162,8164,
				8166,8168,8170,8172,8174,8176,8178,8180,8182,8184,8186,8188
		];
		//window.noup = [63,127,191,255,319,383,447,511,575,639,703,767,831,895,959,1023,1087,1151,1215,1279,1343,1407,1471,1535,1599,1663,1727,1791,1855,1919,
		//1984,1986,1988,1990,1992,1994,1996,1998,2000,2002,2004,2006,2008,2010,2012,2014,2016,2018,2020,2022,2024,2026,2028,2030,2032,2034,2036,2038,2040,2042,2044];
	},
	//Replace 2 subdivision tiles with 32 subdivision for editing or if they have heightmap data
	//todo: rename to editheightmap, update all references
	"replacetile": function(id,p){
		var oldmesh = scene.getMeshByID(id);
		window.watersys.waterit(id,0);
		window.shadowsys.tsgshadow(id,0);
		var oldpos = oldmesh.position;
		if(oldmesh.subdivisions==2){ //if not 32 subdivisions make 32 subdivided
		oldmesh.dispose();
			var mesh2 = window.BABYLON.Mesh.CreateGround(id, window.terrasize, window.terrasize, window.tsubdiv, scene);
			mesh2.material=window.terramat;
			mesh2.position=oldpos;
			mesh2.physicsImpostor = new window.BABYLON.PhysicsImpostor(mesh2, window.BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0, friction: 10000, restitution: 0 }, scene);
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
				window.funcsys.indupdate(mesh2);
			mesh2.id = mesh2.name = id;
			window.BABYLON.Tags.AddTagsTo(mesh2, "terra addwater");
			if(window.wireframemode) mesh2.material.wireframe = true;
			if(window.shadows && window.tshadows) window.shadowsys.tsgshadow(id,1);
			window.shadowsys.shadowR(id,1);
			mesh2.isBlocker = true;
			mesh2.renderingGroupId=3;
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
			if(p) window.picked=scene.getMeshByID(id);
		}
	},
	"editterra": function(){
		if(window.picked.subdivisions==2) window.terrasys.replacetile(window.picked.id,1);
		if(window.picked.material.name != 'gridmat' && window.picked.matchesTagsQuery('terra')){
			window.picked.material = window.gridmat;
			window.terraedit.push(window.picked.id);

			window.func_tedit_dwn = function(e){
				if(e.sourceEvent.button==0 && window.picked.material.id == 'gridmat' && window.picked.matchesTagsQuery('terra')){
					if(!window.lclick){
						window.lclick=1;
						scene.activeCamera.detachControl(renderCanvas);
						window.funcsys.indupdate(null,1);
					}
				}
			};
			window.func_tedit_up = function(e){
				if(window.lclick){
					window.lclick=0;
					scene.activeCamera.attachControl(renderCanvas, true);
					window.funcsys.indupdate(null,0);
					window.fl_last=null;
				}
			};
			window.func_tedit_ef = function(e){
				if(window.lclick){ //edit terrain vertices if left mouse button is down
					window.funcsys.mousemovecallback();
				}
			};
			window.funcsys.actions(window.picked,window.func_tedit_dwn,null,window.BABYLON.ActionManager.OnPickDownTrigger);
			window.funcsys.actions(window.picked,window.func_tedit_up,null,window.BABYLON.ActionManager.OnPickUpTrigger);
			window.funcsys.actions(scene,window.func_tedit_ef,null,window.BABYLON.ActionManager.OnEveryFrameTrigger);
		} else {
		window.fl_last=null;
		window.terraedit.splice(window.terraedit.indexOf(window.picked.id),1);
		window.picked.material = window.terramat;
		/*
		window.terrasys.savetile(window.picked.id);
		window.terrasys.savetile(((window.picked.position.z)+(window.tsubdiv))+'z'+window.picked.position.x+'x');
		window.terrasys.savetile(((window.picked.position.z)+(window.tsubdiv))+'z'+((window.picked.position.x)+(window.tsubdiv))+'x');
		window.terrasys.savetile(window.picked.position.z+'z'+((window.picked.position.x)+(window.tsubdiv))+'x');
		window.terrasys.savetile(((window.picked.position.z)-(window.tsubdiv))+'z'+((window.picked.position.x)+(window.tsubdiv))+'x');
		window.terrasys.savetile(((window.picked.position.z)-(window.tsubdiv))+'z'+window.picked.position.x+'x');
		window.terrasys.savetile(((window.picked.position.z)-(window.tsubdiv))+'z'+((window.picked.position.x)-(window.tsubdiv))+'x');
		window.terrasys.savetile(window.picked.position.z+'z'+((window.picked.position.x)-(window.tsubdiv))+'x');
		window.terrasys.savetile(((window.picked.position.z)+(window.tsubdiv))+'z'+((window.picked.position.x)-(window.tsubdiv))+'x');
		*/
		}
	},
	"terradel": function(){
		var terratiles = scene.getMeshesByTags("terra");
		var meshes = scene.getMeshesByTags("mesh");
		for(var index=0; index < terratiles.length; index++){
			var tt = terratiles[index];
			var ttid = tt.id;
			var thedist = window.funcsys.getdist({x: tt.position.x, y: tt.position.y, z: tt.position.z},{x: window.ctile.position.x, y: window.ctile.position.y, z: window.ctile.position.z});
				//Remove objects & tiles outside of maxtilerange
				if(thedist > (window.terrasize*window.dtval)){
					var ttobs = scene.getMeshesByTags(tt.id+'_mesh');
					ttobs.filter(function(e){
						var eid = e.id;
						if(eid.indexOf(ttid) > -1){
							var shad = window.sg.getShadowMap().renderList;
							for(var i=0; shad.length > i; i++){
								if(shad[i].id == e.id){window.shadowsys.sgshadow(e.id,0); window.watersys.waterit(e.id,0);}
							}
							e.dispose();
						}
					});
					if(ttobs.length <= 0){
						var shad = window.sg.getShadowMap().renderList;
							for(var i=0; shad.length > i; i++){
								if(shad[i].id == tt.id){window.shadowsys.tsgshadow(tt.id,0); window.watersys.waterit(tt.id,0);}
							}
						//leave tile presence room
						window.comms.leave(tt.id);
						tt.dispose();
					}
					shad=eid=ttobs=ttid=null;
				}
				
				//remove shadow or add shadow of terrain based on distance
				if(window.shadows){
					var shad = window.sg.getShadowMap().renderList;
					if(thedist > (window.terrasize*2/1.3333333333333333)){ //96m away
						for(var i=0; shad.length > i; i++){
							if(shad[i].id == tt.id){
								var theid = tt.id;
								//window.shadowsys.tsgshadow(theid,0);
								//window.funcsys.dolog('[TerraShadow] Removed '+theid);
							}
						}
					} else {
						if(shad.filter(function(e){return e.id === tt.id}).length < 1){
							//if(window.tshadows) window.shadowsys.tsgshadow(tt.id,1);
							//window.funcsys.dolog('[TerraShadow] Added '+tt.id);
						}
					}
					if(!window.tshadows){
						for(var i=0; shad.length > i; i++){
							if(shad[i].id == tt.id){
								var theid = tt.id;
								//window.shadowsys.tsgshadow(theid,0);
							}
						}
					}
				}
			shad=tt=ttid=null;
		}
		terratiles=meshes=null;
	},
	//Terraforming
	"terraform": function(a1=null,a2=null,picked,posZ,posX,pid,posi,ind,la=[0,0,0,0,0,0],n=null){
		var i0 = ind[pid * 3];
		var i1 = ind[pid * 3 + 1];
		var i2 = ind[pid * 3 + 2];

		if(window.noup.indexOf(pid) == -1){ //update if not in ignored list
			if(window.tooltype == 'raise'){
				if(window.toolradius==1){
					if(la[0] == 1) posi[i0*3+1]+=window.toolstrength;
					if(la[1] == 1) posi[i1*3+1]+=window.toolstrength;
					if(la[2] == 1) posi[i2*3+1]+=window.toolstrength;
				}
			}
			if(window.tooltype == 'lower'){
				if(la[0] == 1) posi[i0*3+1]-=window.toolstrength;
				if(la[1] == 1) posi[i1*3+1]-=window.toolstrength;
				if(la[2] == 1) posi[i2*3+1]-=window.toolstrength;
			}
			if(window.tooltype == 'zero'){
				if(la[0] == 1) posi[i0*3+1]=window.dheight;
				if(la[1] == 1) posi[i1*3+1]=window.dheight;
				if(la[2] == 1) posi[i2*3+1]=window.dheight;
			}
			if(window.tooltype == 'flatten'){
				if(window.fl_last === null) window.fl_last=posi[i0*3+1];
				else {
					if(la[0] == 1) posi[i0*3+1]=window.fl_last;
					if(la[1] == 1) posi[i1*3+1]=window.fl_last;
					if(la[2] == 1) posi[i2*3+1]=window.fl_last;
				}
			}

			//if updating neighbor
			if(n !== null){
				if(n == 'n'){ //--done
					var nid = scene.getMeshByID(((posZ)-(window.tsubdiv))+'z'+posX+'x');
					var ind2 = nid.getIndices();
					var nposi = nid.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
				}
				if(n == 'ne'){ //--done
					var nid = scene.getMeshByID(((posZ)-(window.tsubdiv))+'z'+posX+'x');
					var ind2 = nid.getIndices();
					var nposi = nid.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
					//update 2046 of E tile
					var ne = scene.getMeshByID(posZ+'z'+((posX)-(window.tsubdiv))+'x');
					var neind = ne.getIndices();
					var neposi = ne.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
					var nenind2 = neind[2046*3];
					neposi[nenind2*3+1]=posi[i0*3+1];
					ne.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, neposi);
						if(window.indup.indexOf(ne) == -1) window.indup.push(ne);
					//update 62 of north tile
					var nn = scene.getMeshByID(((posZ)-(window.tsubdiv))+'z'+((posX)-(window.tsubdiv))+'x');
					var nnind = nn.getIndices();
					var nnposi = nn.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
					var nnnind2 = nnind[62*3+1];
					nnposi[nnnind2*3+1]=posi[i0*3+1];
					nn.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, nnposi);
						if(window.indup.indexOf(nn) == -1) window.indup.push(nn);
				}
				if(n == 'e'){ //--done
					var nid = scene.getMeshByID(posZ+'z'+((posX)-(window.tsubdiv))+'x');
					var ind2 = nid.getIndices();
					var nposi = nid.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
				}
				if(n == 'se'){ //--done
					if(pid == '0'){ //update 62 of E tile and 2046 of NE tile
						var nid = scene.getMeshByID(((posZ)+(window.tsubdiv))+'z'+posX+'x');
							var ne = scene.getMeshByID(posZ+'z'+((posX)-(window.tsubdiv))+'x');
							var neind = ne.getIndices();
							var neposi = ne.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
							var nenind2 = neind[62*3+1];
							neposi[nenind2*3+1]=posi[i2*3+1];
							ne.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, neposi);
								if(window.indup.indexOf(ne) == -1) window.indup.push(ne);
							var nne = scene.getMeshByID(((posZ)+(window.tsubdiv))+'z'+((posX)-(window.tsubdiv))+'x');
							var nneind = nne.getIndices();
							var nneposi = nne.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
							var nnenind2 = nneind[2046*3];
							nneposi[nnenind2*3+1]=posi[i2*3+1];
							nne.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, nneposi);
								if(window.indup.indexOf(nne) == -1) window.indup.push(nne);
					}
					if(pid == '1'){
						var nid = scene.getMeshByID(posZ+'z'+((posX)-(window.tsubdiv))+'x');
							var ne = scene.getMeshByID(((posZ)+(window.tsubdiv))+'z'+((posX)-(window.tsubdiv))+'x');
							var neind = ne.getIndices();
							var neposi = ne.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
							var nenind2 = neind[2047*3+1];
							neposi[nenind2*3+1]=posi[i2*3+1];
							ne.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, neposi);
								if(window.indup.indexOf(ne) == -1) window.indup.push(ne);
							var nne = scene.getMeshByID(((posZ)+(window.tsubdiv))+'z'+posX+'x');
							var nneind = nne.getIndices();
							var nneposi = nne.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
							var nnenind2 = nneind[1985*3];
							nneposi[nnenind2*3+1]=posi[i2*3+1];
							nne.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, nneposi);
								if(window.indup.indexOf(nne) == -1) window.indup.push(nne);
					}
					var ind2 = nid.getIndices();
					var nposi = nid.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
				}
				if(n == 's'){ //--done
					var nid = scene.getMeshByID(((posZ)+(window.tsubdiv))+'z'+posX+'x');
					var ind2 = nid.getIndices();
					var nposi = nid.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
				}
				if(n == 'sw'){ //--done
					var nid = scene.getMeshByID(((posZ)+(window.tsubdiv))+'z'+posX+'x');
					var ind2 = nid.getIndices();
					var nposi = nid.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
					//update 1 of W tile
					var nw = scene.getMeshByID(posZ+'z'+((posX)+(window.tsubdiv))+'x');
					var nwind = nw.getIndices();
					var nwposi = nw.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
					var nwnind2 = nwind[1*3+2];
					nwposi[nwnind2*3+1]=posi[i1*3+1];
					nw.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, nwposi);
						if(window.indup.indexOf(nw) == -1) window.indup.push(nw);
					//update 1985 of SW tile
					var nsw = scene.getMeshByID(((posZ)+(window.tsubdiv))+'z'+((posX)+(window.tsubdiv))+'x');
					var nswind = nsw.getIndices();
					var nswposi = nsw.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
					var nswnind2 = nswind[1985*3];
					nswposi[nswnind2*3+1]=posi[i1*3+1];
					nsw.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, nswposi);
						if(window.indup.indexOf(nsw) == -1) window.indup.push(nsw);
				}
				if(n == 'w'){ //--done
					var nid = scene.getMeshByID(posZ+'z'+((posX)+(window.tsubdiv))+'x');
					var ind2 = nid.getIndices();
					var nposi = nid.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
				}
				if(n == 'nw'){ //--done
					var nid = scene.getMeshByID(((posZ)-(window.tsubdiv))+'z'+((posX)+(window.tsubdiv))+'x');
					var ind2 = nid.getIndices();
					var nposi = nid.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
					var nn = scene.getMeshByID(((posZ)-(window.tsubdiv))+'z'+posX+'x');
					var nsw = scene.getMeshByID(posZ+'z'+((posX)+(window.tsubdiv))+'x');
					if(pid == '2046'){
						//update 62 of north tile
						var nnind = nn.getIndices();
						var nnposi = nn.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
						var nnnind2 = nnind[62*3+1];
						nnposi[nnnind2*3+1]=posi[i0*3+1];
						nn.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, nnposi);
							if(window.indup.indexOf(nn) == -1) window.indup.push(nn);
						//update 1985 of SW tile
						var nswind = nsw.getIndices();
						var nswposi = nsw.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
						var nswnind2 = nswind[1985*3];
						nswposi[nswnind2*3+1]=posi[i0*3+1];
						nsw.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, nswposi);
							if(window.indup.indexOf(nsw) == -1) window.indup.push(nsw);
					}
					if(pid == '2047'){
						//update 62 of north tile
						var nnind = nn.getIndices();
						var nnposi = nn.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
						var nnnind2 = nnind[62*3+1];
						nnposi[nnnind2*3+1]=posi[i1*3+1];
						nn.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, nnposi);
							if(window.indup.indexOf(nn) == -1) window.indup.push(nn);
						//update 1985 of SW tile
						var nswind = nsw.getIndices();
						var nswposi = nsw.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
						var nswnind2 = nswind[1985*3];
						nswposi[nswnind2*3+1]=posi[i1*3+1];
						nsw.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, nswposi);
							if(window.indup.indexOf(nsw) == -1) window.indup.push(nsw);
					}
					
				}
				var i = a1.indexOf(pid);
				var nf = a2[i]; //neighbor faceID
				var nind0 = ind2[nf*3];
				var nind1 = ind2[nf*3+1];
				var nind2 = ind2[nf*3+2];
				if(la[0] == 1) var ti = i0;
				if(la[1] == 1) var ti = i1;
				if(la[2] == 1) var ti = i2;
				if(la[3] == 1) nposi[nind0*3+1]=posi[ti*3+1];
				if(la[4] == 1) nposi[nind1*3+1]=posi[ti*3+1];
				if(la[5] == 1) nposi[nind2*3+1]=posi[ti*3+1];

				nid.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, nposi);
				if(window.indup.indexOf(nid) == -1) window.indup.push(nid);
			}

			picked.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, posi);
				if(window.indup.indexOf(picked) == -1) window.indup.push(picked);
		}
	},
	//Terrain Shadows
	"terrashadows": function(){
		if(window.tshadows) window.tshadows=false;
		else window.tshadows=true;
	},

	/*
	todo: is this used anymore or needing removal?
	//Check if missing terrain inside terraradius (distance from actor)
	terracheck = function(){
		if(actorpresent){
			setcurtile();
			terraneigh();
		}
	}
	*/

	//Load tile heightmap data
	//todo: rename to loadheightmap, update all references
	"loadtile": function(file,callback){
		window.readfile(file,'terra',function(e){
			var data = JSON.parse(e);
			var oldmesh = scene.getMeshByID(file);
			var oldp = oldmesh.position;
			window.watersys.waterit(oldmesh.id,0);
			oldmesh.dispose();
			var mesh2 = window.BABYLON.Mesh.CreateGround(file, window.terrasize, window.terrasize, window.tsubdiv, scene);
			mesh2.material=window.terramat;
			mesh2.position=oldp;
			mesh2.id = mesh2.name = file;
			window.BABYLON.Tags.AddTagsTo(mesh2, "terra");
				if(window.wireframemode) mesh2.material.wireframe=true;
				mesh2.physicsImpostor = new window.BABYLON.PhysicsImpostor(mesh2, window.BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0, friction: 10000, restitution: 0 }, scene);
				if(window.shadows && window.tshadows) window.shadowsys.tsgshadow(mesh2.id,1);
			window.shadowsys.shadowR(mesh2.id,1);
			mesh2.isBlocker = true;
			mesh2.renderingGroupId=3;
			var func = function(e){
				
			};
			window.funcsys.actions(mesh2,func);
			if(mesh2){
				mesh2.setVerticesData(window.BABYLON.VertexBuffer.PositionKind, data.posi);
					window.funcsys.indupdate(mesh2);
			}
				if(callback) callback();
		});
	},
	//Save tile heightmap data
	//todo: rename to saveheightmap, update all references
	"savetile": function(id,callback){
		if(id !== null){
			var mesh = scene.getMeshByID(id);
			if(mesh){
				var data = {};
				data.id = id;
				data.posi = mesh.getVerticesData(window.BABYLON.VertexBuffer.PositionKind);
				data.norms = mesh.getVerticesData(window.BABYLON.VertexBuffer.NormalKind);
				data.uv = mesh.getVerticesData(window.BABYLON.VertexBuffer.UVKind);
				data = JSON.stringify(data);
				window.savefile(mesh.id,'terra',window.encodeURIComponent(data));
			}
			if(callback) callback();
		} else {
			window.funcsys.dolog('[Save Tile Error] No tile ID specified!');
		}
	}
};
window.console.log('[TerraSys] Loaded.');