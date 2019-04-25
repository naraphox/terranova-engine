var guisys = {
	"ver": "013119.1453",
	"update_summary": {
		"021019.1825": ""
	},
	//Tools GUI
	"init": function(){
		var gui = new window.dat.GUI({ autoPlace: false });
		var thegui = document.getElementById('settings');
		thegui.appendChild(gui.domElement);
		var tover = gui.add(window, 'timeoverride');
		var f1 = gui.addFolder('Time Controls');
		f1.add(window, 'sunmove');
		f1.add(window, 'sunorbdelta', -3, 3).listen();
		f1.add(window, 'sunspeed', 0.0001, 0.01);
		$(f1.domElement).attr("hidden", true);
		tover.onChange(function(v){
			if(v){
				$(f1.domElement).attr("hidden", false);
			} else {
				$(f1.domElement).attr("hidden", true);
			}
		});
		gui.add(window, 'skyrotspeed', 0.00002, 0.001);
		var f2 = gui.addFolder('Terrain Controls');
		f2.add(window, 'grav', -20, 0);
		f2.add(window, 'toolstrength', 0.01, 0.25);
		f2.add(window, 'toolradius', 1, 5);
		f2.add(window, 'tooltype', [ 'raise', 'lower', 'flatten', 'zero', 'smooth' ] );
		var f3 = gui.addFolder('Character Controls');
		f3.add(window, 'speed', 0.1, 1.0);
		var f3_mass = f3.add(window, 'pl_mass', 0, 1000);
		f3_mass.onChange(function(v){
			window.actor.phys.physicsImpostor.physicsBody.mass=v;
		});
		var f4 = gui.addFolder('Rendering Controls');
		var f4_fxaa = f4.add(window, 'fxaa');
		f4_fxaa.onChange(function(v){
			if(v) window.pipeline.fxaaEnabled=true;
			else window.pipeline.fxaaEnabled=false;
		});
		var f4_msaa = f4.add(window, 'msaa', [1,2,4,8,16]);
		f4_msaa.onChange(function(v){
			window.pipeline.samples=v;
		});
		var f4_ssao = f4.add(window, 'ssao', [0,1,2,3,4]);
		f4_ssao.onChange(function(v){
			if(v>0){
				window.ssao_pp.radius = 3;
				window.ssao_pp.totalStrength = 1;
				window.ssao_pp.maxZ = 250;
				window.ssao_pp.expensiveBlur = false;
				if(v==1) window.ssao_pp.samples = 8;
				if(v==2) window.ssao_pp.samples = 12;
				if(v==3){window.ssao_pp.expensiveBlur = true; window.ssao_pp.samples = 16;}
				if(v==4){window.ssao_pp.expensiveBlur = true; window.ssao_pp.samples = 20;}
				scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", scene.activeCamera, true);
			} else scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline('ssao', scene.activeCamera);
		});
		var f4_oshadow = f4.add(window, 'sgshadows').min(0).max(3).step(1);
		f4_oshadow.onChange(function(v){
			if(v==1){window.sg.usePoissonSampling=false; window.sg.useBlurExponentialShadowMap=false; window.sg.bias=0.000004;}
			if(v==2){window.sg.useBlurExponentialShadowMap=false; window.sg.usePoissonSampling=true; window.sg.bias=0.000004;}
			if(v==3){window.sg.usePoissonSampling=false; window.sg.useBlurExponentialShadowMap=true; window.sg.bias=0.001;}
		});
		var f4_tshadow = f4.add(window, 'tshadows').min(0).max(3).step(1);
		f4_tshadow.onChange(function(v){
			if(v==1){window.terrain_sg.usePoissonSampling=false; window.terrain_sg.useBlurExponentialShadowMap=false; window.terrain_sg.bias=0.000004;}
			if(v==2){window.terrain_sg.useBlurExponentialShadowMap=false; window.terrain_sg.usePoissonSampling=true; window.terrain_sg.bias=0.000004;}
			if(v==3){window.terrain_sg.usePoissonSampling=false; window.terrain_sg.useBlurExponentialShadowMap=true; window.terrain_sg.bias=0.001;}
		});
		var f4_vlight = f4.add(window, 'vol_light');
		f4_vlight.onChange(function(v){
			if(v) scene.activeCamera.attachPostProcess(window.sunvls);
			else scene.activeCamera.detachPostProcess(window.sunvls);
		});
		var f4_bloom = f4.add(window, 'bloom');
		f4_bloom.onChange(function(v){
			if(v) window.pipeline.bloomEnabled=true;
			else window.pipeline.bloomEnabled=false;
		});
		var f4_water = f4.add(window, 'water');
		f4_water.onChange(function(v){
			if(v) window.waterMesh.dispose();
			else window.init.initwater();
		});
		var f4_lflare = f4.add(window, 'lflare');
		f4_lflare.onChange(function(v){
			if(v){
				window.lensFlareSystem = new window.BABYLON.LensFlareSystem("lensFlareSystem", window.light, scene);
				window.flare0 = new window.BABYLON.LensFlare(0.07, 0.2, new window.BABYLON.Color3(0.5, 0.5, 1), "img/lens4.png", window.lensFlareSystem);
				window.flare1 = new window.BABYLON.LensFlare(0.12, 0.4, new window.BABYLON.Color3(1, 0.5, 1), "img/Flare.png", window.lensFlareSystem);
				window.flare2 = new window.BABYLON.LensFlare(0.05, 0.6, new window.BABYLON.Color3(1, 1, 1), "img/lens5.png", window.lensFlareSystem);
				window.flare3 = new window.BABYLON.LensFlare(0.1, 0.8, new window.BABYLON.Color3(1, 1, 1), "img/lens4.png", window.lensFlareSystem);
			} else window.lensFlareSystem.dispose();
		});
		gui.close();
		$('#gui').show();
	},
	"guicallback": function(){
		document.getElementById('fps').textContent = Math.round(engine.getFps());
		if(typeof window.actor === "object"){
			var pX = window.actor.phys.position.x.toString().indexOf('.')+3;
			var pY = window.actor.phys.position.y.toString().indexOf('.')+3;
			var pZ = window.actor.phys.position.z.toString().indexOf('.')+3;
			var pos = {x: window.actor.phys.position.x.toString().substring(0, pX), y:  window.actor.phys.position.y.toString().substring(0, pY), z:  window.actor.phys.position.z.toString().substring(0, pZ)};
			if([5,10,15,20,25,30,35,40,45,50,55,60].includes(window.tick)) document.getElementById('wb_coords').textContent = pos.x+' , '+pos.y+' , '+pos.z; //update every 5th frame
		}
		document.getElementById('wb_coords2').textContent = window.curtileX+' , '+window.curtileZ;
	},
	//Context Menu
	"setcontext": function(s){
		for(var i=1; i < 6; i++){
			document.getElementById('c'+i).setAttribute('class','hexagon');
			document.getElementById('c'+i+'_text').textContent='';
			document.getElementById('c'+i).onclick=function(){};
		}
		for(var i=0; i < Object.keys(s).length; i++){
			var obj = s[i+1];
			if(obj != undefined && Object.keys(obj).length > 0){
				document.getElementById('c'+(i+1)).setAttribute('class','hexagon active');
				document.getElementById('c'+(i+1)+'_text').textContent=obj.text;
				document.getElementById('c'+(i+1)).onclick=function(){eval(obj.func);};
			}
		}
	},
	"closecontext": function(){
		$('#cmenu').css('display','none');
		$('#renderCanvas').focus();
	},
	//Make Dialog Window
	"makedialog": function(t,c){
		var id = Math.random().toString(36).substring(7);
		$('body').append('<div id="dialog_'+id+'" class="dialog" title="'+decodeURIComponent(t)+'">'+decodeURIComponent(c)+'</div>');
		$("#dialog_"+id).dialog({
			appendTo: "#dialogarea"
		}).parent().draggable({
			containment: "#dialogarea",
			grid: [20,-1],
			snap: "#dialogarea, .ui-dialog",
			opacity: 0.70
		});
		window.dialogs[id]={};
		$("#dialogmin_"+id).remove();
		$("#dialog_"+id).parent().find(".ui-dialog-titlebar").append('\
		<button type="button" id="dialogmin_'+id+'" class="ui-button ui-corner-all ui-widget"\
		title="Minimize" style="position:absolute;right:25px;margin:-3px 2px 0 0;padding-bottom:2px;height:1.8em;width:1.8em;">_</button>');
		$('.ui-button').blur();
		$("#dialog_"+id).parent().find(".ui-dialog-titlebar-close").attr('id',id);
		$("#dialog_"+id).parent().find(".ui-dialog-titlebar-close").bind("click", window.funcsys.dialogCE);
		$('#dialogmin_'+id).click(function(){
			$('#dialog_'+id).toggle({
				duration: 0,
				complete: function(){
					if($('#dialog_'+id).is(':visible')){
						$(this).parent().animate({
							left: $(this).parent().attr('lastX'),
							top: $(this).parent().attr('lastY'),
							width: $(this).parent().attr('lastW'),
							height: $(this).parent().attr('lastH')
						},200);
						$(this).dialog("option", "resizable", true);
						$('#dialogmin_'+id).html('_');
					} else {
						window.dialogs[id].pos=(Object.keys(window.dialogs).length-1);
						var ho = 32*window.dialogs[id].pos;
						$(this).parent().attr('lastY',$(this).parent().position().top);
						$(this).parent().attr('lastX',$(this).parent().position().left);
						$(this).parent().attr('lastW',$(this).parent().width());
						$(this).parent().attr('lastH',$(this).height());
						$(this).parent().animate({
							left: 0,
							top: ho,
							width: "15%",
							height: "25px"
						},200).css("transform","translate(0)");
						$(this).dialog("option", "resizable", false);
						$('#dialogmin_'+id).html('&#9633;');
					}
				}
			});
		});
	}
};
window.console.log('[GuiSys] Loaded.');