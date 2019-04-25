var init = {
	"ver": "031519.1805",
	"update_summary": {
		"031519.1805":"Updated key bindings to include F4 to open webrtc internals debug window."
	},
	//Init Physics
	"initphys": function(){
		scene.enablePhysics(new window.BABYLON.Vector3(0,window.grav,0), new window.BABYLON.CannonJSPlugin());
	},
	//Init Camera
	"initcam": function(){
		scene.clearColor = new window.BABYLON.Color3(window.fogR,window.fogG,window.fogB); // Change the scene background color to light blue.
		window.camera = new window.BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, window.BABYLON.Vector3.Zero(), scene);
		window.camera.fov = window.fov;
		window.camera.panningSensibility = 0;
		window.camera.minZ=0;
		window.camera.maxZ=window.maxZ;
		window.camera.attachControl(renderCanvas,true);
		window.camera.globalPosition = new window.BABYLON.Vector3(0,15,0);
		window.camera.setTarget(new window.BABYLON.Vector3(0,0,0));
		window.camera2 = new window.BABYLON.UniversalCamera("FreeCamera", new window.BABYLON.Vector3(0, 10, 0), scene);
		window.camera2.minZ=0;
		window.camera2.maxZ=window.maxZ;
		window.minimapcam = new window.BABYLON.UniversalCamera("minimapcam", new window.BABYLON.Vector3(0, 100, 0), scene);
		window.minimapcam.rotation.x=1.49;
	},
	// Init Sun
	"initsun": function(){
		window.sun = window.BABYLON.MeshBuilder.CreateDisc("sun", {radius: 1500}, scene);
		window.sun.billboardMode=7;
		window.sun.id="sun";
		window.sun.scaling=new window.BABYLON.Vector3(.3,.3,.3);
		window.sun.position=new window.BABYLON.Vector3(window.sunorbdis * Math.sin(window.sunorbdelta), window.sunorbdis * Math.cos(window.sunorbdelta), 0);
		window.sun.renderingGroupId=2;
		window.sun.infiniteDistance = true;
		var myMaterial = new window.BABYLON.StandardMaterial("myMaterial", scene);
		myMaterial.diffuseColor=myMaterial.emissiveColor=new window.BABYLON.Color3(1,1,1);
		myMaterial.fogEnabled=false;
		window.sun.material=myMaterial;
		window.light = new window.BABYLON.DirectionalLight("light", new window.BABYLON.Vector3(0, -1, 0), scene);
		window.light.intensity = window.sunintensity; // Dim the light a small amount
		window.light.diffuse = window.light.specular = new window.BABYLON.Color3(1, 1, 1);
		window.light.infiniteDistance = true;
		window.light.shadowMinZ=10000;
		window.light.shadowMaxZ=30000;
		window.light.position=window.sun.position;
		//Night light
		window.night = new window.BABYLON.DirectionalLight("light", new window.BABYLON.Vector3(0, -1, 0), scene);
		window.night.intensity = window.moonintensity;
		window.night.diffuse = new window.BABYLON.Color3(1,1,1);
		window.night.specular=new window.BABYLON.Color3(0,0,0);
		window.night.position.y = 2000;
		//VLS
		window.sunvls = new window.BABYLON.VolumetricLightScatteringPostProcess('vls', { postProcessRatio: 1.0, passRatio: 0.7 }, null, window.sun, 50, window.BABYLON.Texture.TRILINEAR_SAMPLINGMODE, engine, true, scene);
		window.sunvls.decay=0.99;
		window.sunvls.density=0.92;
		window.sunvls.weight=0.4;
		window.sunvls.exposure=0.1;
		window.sunvls.excludedMeshes=window.norays;
		window.sunvls.infiniteDistance=true;
		window.sunvls.alphaMode=0;
		window.camera.attachPostProcess(window.sunvls);
		window.camera2.attachPostProcess(window.sunvls);
	},
	// Init Skybox
	"initsky": function(){
		window.skyShaderMaterial = new window.BABYLON.ShaderMaterial("shader", scene, {
			vertex: "custom",
			fragment: "custom",
		},{
			needAlphaBlending: true,
			attributes: ["position", "normal", "uv"],
			uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
		});
		window.skyShaderMaterial.setFloat("time", 0);
		window.skyShaderMaterial.setFloat("cr", 1.0);
		window.skyShaderMaterial.setFloat("cg", 1.0);
		window.skyShaderMaterial.setFloat("cb", 1.0);
		window.skyShaderMaterial.setVector3("cameraPosition", window.BABYLON.Vector3.Zero());
		window.skyShaderMaterial.backFaceCulling=false;
		window.skyShaderMaterial.fogEnabled=true;
		window.skyShaderMaterial.alphaMode=1;
		window.skyShaderMaterial.onBind = function(mat, mesh){
			var effect = window.skyShaderMaterial.getEffect();
			effect.setMatrix("view", scene.getViewMatrix());
		}
		window.shaderMaterial = scene.getMaterialByName("shader");

		window.skybox = window.BABYLON.Mesh.CreateBox("skybox", 55000, scene);
		window.skybox.scaling=new window.BABYLON.Vector3(14,14,14);
		window.skybox.id="skybox";
		window.skybox.infiniteDistance=true;

		var mat = new window.BABYLON.StandardMaterial("skybox_mat", scene);
		mat.backFaceCulling = false;
		mat.disableLighting = true;
		mat.fogEnabled = false;
		mat.emissiveColor = mat.diffuseColor = new window.BABYLON.Color3(0,0,0);
		mat.reflectionTexture = new window.BABYLON.CubeTexture("img/skybox/skybox", scene);
		mat.reflectionTexture.coordinatesMode = window.BABYLON.Texture.SKYBOX_MODE;
			if(window.wireframemode) mat.wireframe = true;
		window.skybox.material = mat;
		window.sky = window.BABYLON.Mesh.CreateGround("sky", 45000, 45000, 2, scene);
		window.sky.material = window.skyShaderMaterial;
		window.sky.rotation.z = window.PI;
		window.sky.rotation.y=window.PI+2;
		window.sky.position.y = 30000;
		window.sky.renderingGroupId=1;
		window.sky.infiniteDistance=true;
		window.sky.scaling=new window.BABYLON.Vector3(30,1,30);
		window.sky.material.alphaMode=5;
	},
	// Init Water
	"initwater": function(){
		window.waterMesh = window.BABYLON.Mesh.CreateGround("water", window.terrasize*16, window.terrasize*16, 2, scene, false);
		window.waterMesh.position.y=window.dheight-0.9;
		window.waterMesh.renderingGroupId=3;
		window.waterMesh.isPickable=false;
		window.watermat = new window.BABYLON.WaterMaterial("watermat", scene, new window.BABYLON.Vector2(1024,1024));
		window.watermat.backFaceCulling=true;
		window.watermat.bumpTexture = new window.BABYLON.Texture("img/waterbump.png", scene);
		window.watermat.windForce = -1;
		window.watermat.waveHeight = 0;
		window.watermat.bumpHeight = 0.05;
		window.watermat.waveLength = 0.2;
		window.watermat.waterColor = new window.BABYLON.Color3(0.2, 0.3, 0.3);
		window.watermat.specularColor = new window.BABYLON.Color3(0,0,0);
		window.watermat.colorBlendFactor = 0.6;
			if(window.water) window.waterMesh.material = window.watermat;
		window.watersys.waterit(window.skybox.id,1);
		window.watersys.waterit(window.sky.id,1);
	},
	//Key Bindings Init
	"initactions": function(){
		scene.actionManager = new window.BABYLON.ActionManager(scene);
		scene.actionManager.registerAction(new window.BABYLON.ExecuteCodeAction(window.BABYLON.ActionManager.OnKeyDownTrigger,function(e){
			//modifiers
			if(e.sourceEvent.key == "Control") window.ctrl=1;
			//non-modifiers
			if(!window.movelock && e.sourceEvent.key == "w"){
				var now = parseInt((Date.now()/1000).toFixed(0));
					if(now-window.runtimer<1) window.keys.forw=2; //run
					else if(window.keys.forw!=2) window.keys.forw=1; //walk if not running
			}
			if(!window.ctrl && !window.movelock && e.sourceEvent.key == "s"){
				window.keys.rev=1;
			}
			if(!window.movelock && e.sourceEvent.key == "a") window.keys.left=1;
			if(!window.movelock && e.sourceEvent.key == "d") window.keys.right=1;
			if(e.sourceEvent.key == "Enter"){
				if(!$('.chatbar').is(":focus")){
					setTimeout(function(){
						$('.chatbar').attr('contenteditable','true').focus();
					},100);
				}
			}
			if(e.sourceEvent.key == "F11") $('#gui').toggle();
			if(e.sourceEvent.key == "c") window.funcsys.togchat();
			if(e.sourceEvent.key == "i") $('#inventory').trigger('click');
			if(e.sourceEvent.key == "m") $('#map').trigger('click');
			if(e.sourceEvent.key == "b") window.guisys.makedialog('Build');
		}));
		
		scene.actionManager.registerAction(new window.BABYLON.ExecuteCodeAction(window.BABYLON.ActionManager.OnKeyUpTrigger,function(e){
			if(!window.movelock && e.sourceEvent.key == " "){
					if(!window.jump){
						window.jump=1;
						window.actor.phys.getPhysicsImpostor().setLinearVelocity(new window.BABYLON.Vector3(0,4,0));
						setTimeout(function(){
							window.jump=0;
						}, 1200);
					}
			}
			if(e.sourceEvent.key == "Control") window.ctrl=0;
			if(e.sourceEvent.key == "w"){
					if(window.keys.forw!=2) window.runtimer=parseInt((Date.now()/1000).toFixed(0));
					else window.runtimer=0;
				window.keys.forw=0;
			}
			if(e.sourceEvent.key == "s") window.keys.rev=0;
			if(e.sourceEvent.key == "a") window.keys.left=0;
			if(e.sourceEvent.key == "d") window.keys.right=0;
			if(e.sourceEvent.key == "Escape"){
				if(scene.activeCamera==window.camera) window.camera.alpha=window.camalpha;
			}
			if(e.sourceEvent.key == "F2"){
				if(window.stog == 0){
					scene.debugLayer.show({
						initialTab : 2,
						enablePopup: false,
						overlay: true
					});
					window.stog=1;
					$('#gui').hide();
				} else {
					scene.debugLayer.hide();
					window.stog=0;
					$('#gui').show();
				}
				$('div[title="Tools"].label').hide();
				$('#sceneExplorer #header #logo').hide();
			}
			if(e.sourceEvent.key == "F3") window.funcsys.console();
			if(e.sourceEvent.key == "F4") {
				window.open('chrome://webrtc-internals');
			}
			if(e.sourceEvent.key == "F12") nwin.showDevTools();
		}));
	},
	// Init Lensflare
	"initlensflare": function(){
		if(window.lflare) window.lensFlareSystem = new window.BABYLON.LensFlareSystem("lensFlareSystem", window.light, scene);
		window.flare0 = new window.BABYLON.LensFlare(0.07, 0.2, new window.BABYLON.Color3(0.5, 0.5, 1), "img/lens4.png", window.lensFlareSystem);
		window.flare1 = new window.BABYLON.LensFlare(0.12, 0.4, new window.BABYLON.Color3(1, 0.5, 1), "img/Flare.png", window.lensFlareSystem);
		window.flare2 = new window.BABYLON.LensFlare(0.05, 0.6, new window.BABYLON.Color3(1, 1, 1), "img/lens5.png", window.lensFlareSystem);
		window.flare3 = new window.BABYLON.LensFlare(0.1, 0.8, new window.BABYLON.Color3(1, 1, 1), "img/lens4.png", window.lensFlareSystem);
	},
	// InitTerrain
	"initterra": function(){
		//Setup gridmaterial
		window.gridmat = new window.BABYLON.GridMaterial("gridmat", window.scene);
		window.gridmat.gridRatio = 0.3;
		window.gridmat.mainColor = new window.BABYLON.Color3(0, 0, 0);
		window.gridmat.lineColor = new window.BABYLON.Color3(1,1,1);

		//Setup Default Terrain Material
		window.terramat = new window.BABYLON.StandardMaterial("terramat", window.scene);
		window.terramat.specularColor = new window.BABYLON.Color3(0, 0, 0);
		window.terramat.diffuseTexture = new window.BABYLON.Texture("img/grass.png", window.scene);
		window.terramat.diffuseTexture.vScale=window.terramat.diffuseTexture.uScale=96;
		window.terramat.backFaceCulling=true;
		window.terramat.diffuseTexture.level=1.15;

		window.tilesys.addtile(0,0);
		window.terrapresent=1;

		//Edge blocking planes
		window.terramat2 = new window.BABYLON.StandardMaterial("terramat2", window.scene);
		window.terramat2.specularColor=window.terramat2.ambientColor=window.terramat2.diffuseColor=window.terramat2.emissiveColor=window.scene.fogColor;
		window.terramat2.disableLighting=window.terramat2.backFaceCulling=true;
		
		window.fogplane1 = window.BABYLON.MeshBuilder.CreatePlane("fogplane", {width: 5, height: 2}, window.scene);
		window.fogplane1.scaling=new window.BABYLON.Vector3(128,20,1);
		window.fogplane1.infiniteDistance=true;
		window.fogplane1.position.z=128;
		window.fogplane1.renderingGroupId=3;
		window.fogplane1.position.y=-20;
		window.fogplane1.material=window.terramat2;

		window.fogplane2 = window.BABYLON.MeshBuilder.CreatePlane("fogplane2", {width: 5, height: 2}, window.scene);
		window.fogplane2.scaling=new window.BABYLON.Vector3(128,20,1);
		window.fogplane2.infiniteDistance=true;
		window.fogplane2.position.z=-128;
		window.fogplane2.renderingGroupId=3;
		window.fogplane2.position.y=-20;
		window.fogplane2.rotation.x=window.PI;
		window.fogplane2.material=window.terramat2;
		
		window.fogplane3 = window.BABYLON.MeshBuilder.CreatePlane("fogplane3", {width: 5, height: 2}, window.scene);
		window.fogplane3.scaling=new window.BABYLON.Vector3(128,20,1);
		window.fogplane3.infiniteDistance=true;
		window.fogplane3.position.x=128;
		window.fogplane3.renderingGroupId=3;
		window.fogplane3.position.y=-20;
		window.fogplane3.rotation.y=window.PI/2;
		window.fogplane3.material=window.terramat2;

		window.fogplane4 = window.BABYLON.MeshBuilder.CreatePlane("fogplane4", {width: 5, height: 2}, window.scene);
		window.fogplane4.scaling=new window.BABYLON.Vector3(128,20,1);
		window.fogplane4.infiniteDistance=true;
		window.fogplane4.position.x=-128;
		window.fogplane4.renderingGroupId=3;
		window.fogplane4.position.y=-20;
		window.fogplane4.rotation.y=-window.PI/2;
		window.fogplane4.material=window.terramat2;

		window.tilesys.tileneighbor();
	},
	//Init GlowLayer
	"initglow": function(){
		window.gl = new window.BABYLON.GlowLayer("glow", window.scene, {
			blurKernelSize: 32,
			mainTextureSamples: 4,
			mainTextureFixedSize: 1024,
			blurKernelSize: 64,
			renderingGroupId: 3
		});

		//On init add objects from gl_inc array
		window.gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
			if(typeof window.gl_inc[mesh.id] == "object"){
				result.set(window.gl_inc[mesh.id].r, window.gl_inc[mesh.id].g, window.gl_inc[mesh.id].b, window.gl_inc[mesh.id].brt);
			} else result.set(0, 0, 0, 0);
		};

		window.addgl = function(id,ramt=1,gamt=1,bamt=1,brt=1){ //amt is float from 0 to 1
			if(typeof window.gl_inc[id] == "object"){ //check if mesh is included or not
				var i = window.gl_inc[id];
				i.r=ramt,i.g=gamt,i.b=bamt,i.brt=brt;
				window.funcsys.dolog('[GlowLayer] Modified '+id);
			} else { //not included, so add it
				var m = scene.getMeshByID(id);
				window.gl.removeExcludedMesh(id);
				window.gl.addIncludedOnlyMesh(m);
				window.gl_inc[id] = {'r':ramt,'g':gamt,'b':bamt,'brt':brt};
				window.funcsys.dolog('[GlowLayer] Added '+id);
			}
		};

		//Remove glow from object
		window.remgl = function(id){
			var m = scene.getMeshByID(id);
			delete window.gl_inc[id];
		};
	},
	// Init Shadows
	"initshadows": function(){
		window.shadows=1;
		window.sg = new window.BABYLON.ShadowGenerator(4096, window.light);
		window.sg.bias=0.00000001;
		window.sg.normalBias=0.001;
		window.sg.blurScale=5;
		window.sg.setDarkness(0.65);
		window.sg.forceBackFacesOnly=true;
		window.sg.usePercentageCloserFiltering=true;
	},
	//Init Fog
	"initfog": function(){
		scene.fogMode = window.fogtype;
		scene.fogStart = window.fogStart;
		scene.fogEnd = window.fogEnd;
		scene.fogColor=new window.BABYLON.Color3(window.fogR,window.fogG,window.fogB);
	},
	//Init Pipeline
	"initpipeline": function(){
		/* SSAO Pipeline */
		window.ssao_pp = new window.BABYLON.SSAO2RenderingPipeline('ssao', scene, {ssaoRatio: 0.5, blurRatio: 0.5});
		window.ssao_pp.radius = 3;
		window.ssao_pp.totalStrength = 1;
		window.ssao_pp.expensiveBlur = false;
        window.ssao_pp.samples = 8;
        window.ssao_pp.maxZ = 250;
		if(window.ssao>0) scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", scene.activeCamera, true);
		/* Default Rendering Pipeline */
		window.pipeline = new window.BABYLON.DefaultRenderingPipeline(
			"default", // The name of the pipeline
			true, // Do you want HDR textures ?
			scene, // The scene instance
			[window.camera,window.camera2] // The list of cameras to be attached to
		);
		//Bloom
		if(window.bloom) window.pipeline.bloomEnabled=true;
		window.pipeline.bloomThreshold = 0.7;
		window.pipeline.bloomKernel = 64;
		window.pipeline.bloomScale = window.bscale;
		window.pipeline.bloomWeight = window.bweight;
		//Sharpening
		window.pipeline.sharpenEnabled=true;
		window.pipeline.sharpen.edgeAmount = 0.3;
		window.pipeline.sharpen.colorAmount = 1.2;
		//ImageProcessing
		window.pipeline.imageProcessingEnabled=true;
		window.pipeline.imageProcessing.exposure=window.exposure;
		window.pipeline.imageProcessing.contrast=window.contrast;
		//Chromatic
		if(window.chromatic) window.pipeline.chromaticAberrationEnabled=true;
		//FXAA
		if(window.fxaa) window.pipeline.fxaaEnabled=true;
		//MSAA
		if(window.msaa!=1) window.pipeline.samples=window.msaa; else window.pipeline.samples=1; //1 is off
		//ToneMapping
		window.pipeline.imageProcessing.toneMappingEnabled=true;
		window.pipeline.imageProcessing.imageProcessingConfiguration.toneMappingType=1;
		//GlowLayer
		window.pipeline.glowLayerEnabled=false;
	},	
	"inithighlights": function(){
		window.hl = new window.BABYLON.HighlightLayer("hl1", scene);
	},
	"hladd": function(mesh,col){
		window.hl.addMesh(mesh, window.BABYLON.Color3(col.r,col.g,col.b));
	},
	"hlrem": function(mesh){
		window.hl.removeMesh(mesh);
	},
	/* Render Loop */
	"dorender": function(){
		//Things that must have actor present
		if(window.actorpresent){
			if(window.keys.forw || window.keys.rev || window.keys.right || window.keys.left) window.avisys.movecharacter();
			else if(window.animations[window.uid].current!=0){
				window.animations[window.uid].states["idle"]();
				window.comms.idle();
			}
			if(window.keys.left == 0 && window.keys.right == 0) window.comms.norot();
			var ltarget = new window.BABYLON.Vector3(window.actorX, window.actorY-1, window.actorZ); //light target
			window.light.setDirectionToTarget(ltarget); //fix shadow and light direction
		}
		if(window.terrapresent){
			//Terrain neighbor check
			window.tilesys.tileneighbor();
			//Add tiles from ptiles array, until empty
			if(window.ptiles.length > 0){
				var a = window.ptiles[0];
				window.tilesys.addtile(a[0],a[1]);
				window.ptiles.splice(0,1);
			}
		}
		//Render Frame
		window.guisys.guicallback();
		scene.render();
	},
	//Final Init
	"finalinit": function(){
		/* Compute Before Render */
		window.scene.beforeRender = function(){
			if(typeof window.skysys == "object"){
				window.skybox.rotation.z -= window.skyrotspeed;
				if([5,10,15,20,25,30,35,40,45,50,55,60].includes(window.tick)) window.skysys.cloudcallback(); //runs every 5th frame
			}
			if(window.actorpresent){
				if(window.sunmove && [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60].includes(window.tick)) window.skysys.sunmovecallback(); //every other frame
				if(window.scene.getPhysicsEngine().gravity.y != window.grav) window.scene.getPhysicsEngine().setGravity(new window.BABYLON.Vector3(0,window.grav,0)); //move to function, on change call the function!
				//position system
				var pX = window.actor.phys.position.x.toString().indexOf('.');
				window.actorX=window.actor.phys.position.x.toString().substring(0, pX);
				var pY = window.actor.phys.position.y.toString().indexOf('.');
				window.actorY=window.actor.phys.position.y.toString().substring(0, pY);
				var pZ = window.actor.phys.position.z.toString().indexOf('.');
				window.actorZ=window.actor.phys.position.z.toString().substring(0, pZ);
				//make sure actors stay upright!
				var actors = window.scene.getMeshesByTags("actor");
				for(var i=0; i < actors.length; i++){
					if(actors[i].id != window.uid){
						window[actors[i].id].phys.rotationQuaternion.x=0;
						window[actors[i].id].phys.rotationQuaternion.z=0;
					} else window.actor.phys.rotationQuaternion.x=window.actor.phys.rotationQuaternion.z=0;
				}
				//if player not moving clamp linearvelocity and angularvelocity after 2 second delay
				if(window.keys.forw == 0 && window.keys.rev == 0){
					window.setTimeout(function(){
						window.actor.phys.physicsImpostor.setAngularVelocity(new window.BABYLON.Vector3(0,0,0));
						window.actor.phys.physicsImpostor.setLinearVelocity(new window.BABYLON.Vector3(0,0,0));
					},2000);
				}
			}
			if(typeof window.watersys == "object") window.watersys.watercallback();
			if(typeof window.camsys == "object") window.camsys.camcallback();
			/* Move or Rotate Other Players */
			if(Object.keys(window.move).length>0){
				let dtime = scene.getEngine().getDeltaTime(); //speed * dtime
				for(var i=0; i<Object.keys(window.move).length; i++){
					let cid = Object.keys(window.move)[i];
					let t = window.move[cid]['type'];
					switch(t){
						case "0": //walk
							window[cid].phys.translate(window.BABYLON.Axis.Z, window.speed*dtime, window.BABYLON.Space.LOCAL);
						break;
						case "1": //back
							window[cid].phys.translate(window.BABYLON.Axis.Z, -window.speed*dtime, window.BABYLON.Space.LOCAL);
						break;
						case "2": //run
							window[cid].phys.translate(window.BABYLON.Axis.Z, window.rspeed*dtime, window.BABYLON.Space.LOCAL);
						break;
						case "3": //fly
							
						break;
						case "4": //swim
							
						break;
					}
				}
			}
			if(Object.keys(window.rotate).length>0){
				let dtime = scene.getEngine().getDeltaTime(); //speed * dtime
				for(var i=0; i<Object.keys(window.rotate).length; i++){
					let cid = Object.keys(window.rotate)[i];
					let t = window.rotate[cid]['type'];
					switch(t){
						case "0": //left
							window[cid].phys.rotate(window.BABYLON.Axis.Y, -window.rotstep*window.dtime, window.BABYLON.Space.WORLD);
						break;
						case "1": //right
							window[cid].phys.rotate(window.BABYLON.Axis.Y, window.rotstep*window.dtime, window.BABYLON.Space.WORLD);
						break;
					}
				}
			}
			/* Frame Tick */
			if(window.tick==60){ //run every 60th frame
				window.shadowsys.shadowcallback();
				if(window.actorpresent) window.terrasys.terradel();
			}
			if(window.tick < 60) window.tick+=1; //increase tick count
			else window.tick=0;
		};
		/* End Compute Before Render */
		
		window.hl.addMesh(window.sun, new window.BABYLON.Color3(.7,.8,.7)); //sun highlight
		window.addgl(window.sun.id,.7,.8,.7,1); //sun glow
		window.camsys.camtoggle(1);
		window.scene.hoverCursor='default';
		//Gizmo Layer
		window.init.gizmoManager = new window.BABYLON.GizmoManager(window.scene);
		window.init.gizmoManager.usePointerToAttachGizmos=false;
		window.init.gizmoManager.attachableMeshes = [];
		//Start Render Loop
		engine.runRenderLoop(function(){
			window.init.dorender();
		});
		$('#compass').css('background-position','top 0 left -157.5px'); //set compass north
		//update radar every 2 seconds
		var radar_updater = window.setInterval(function(){window.funcsys.radar();},2000);
		var sunorbdelta_set = window.setInterval(function(){window.sunorbdelta+=window.sunspeed;},20);
	}
};
window.console.log('[InitSys] Loaded.');