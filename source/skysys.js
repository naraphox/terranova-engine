var skysys = {
	"ver": "013119.1453",
	"update_summary": {
		"021019.1825": ""
	},
	"init": function(){
		window.BABYLON.Effect.ShadersStore["customVertexShader"]=`
		precision highp float;

		// Attributes
		attribute vec3 position;
		attribute vec3 normal;
		attribute vec2 uv;

		// Uniforms
		uniform mat4 worldViewProjection;
		uniform mat4 view;
		uniform mat4 world;
		uniform mat4 worldView;
		uniform mat4 projection;

		// Varying
		varying vec4 vPosition;
		varying vec2 vUv;
		varying vec3 vNormal;
		varying float fFogDistance;

		void main() {
			vec4 worldPosition = world * vec4(position, 1.0);
			vec4 p = vec4( position, 1. );
			fFogDistance = (view * worldPosition).z;
			vPosition = p;
			vNormal = normal;
			vUv = uv;

			gl_Position = worldViewProjection * p;
		}`;
		window.BABYLON.Effect.ShadersStore["customFragmentShader"]=`
		precision highp float;

		uniform mat4 worldView;
		uniform vec3 cameraPosition;

		uniform float time;
		uniform float cr;
		uniform float cg;
		uniform float cb;
		uniform vec2 resolution;
		varying vec4 vPosition;
		varying vec3 vNormal;
		varying vec2 vUv;

		vec3 random3(vec3 c) {   float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));   vec3 r;   r.z = fract(512.0*j); j *= .125;  r.x = fract(512.0*j); j *= .125; r.y = fract(512.0*j);  return r-0.5;  } 
		float rand(vec2 co){   return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); } 
		const float F3 =  0.3333333;
		const float G3 =  0.1666667;
		float simplex3d(vec3 p) {   vec3 s = floor(p + dot(p, vec3(F3)));   vec3 x = p - s + dot(s, vec3(G3));  vec3 e = step(vec3(0.0), x - x.yzx);  vec3 i1 = e*(1.0 - e.zxy);  vec3 i2 = 1.0 - e.zxy*(1.0 - e);   vec3 x1 = x - i1 + G3;   vec3 x2 = x - i2 + 2.0*G3;   vec3 x3 = x - 1.0 + 3.0*G3;   vec4 w, d;    w.x = dot(x, x);   w.y = dot(x1, x1);  w.z = dot(x2, x2);  w.w = dot(x3, x3);   w = max(0.6 - w, 0.0);   d.x = dot(random3(s), x);   d.y = dot(random3(s + i1), x1);   d.z = dot(random3(s + i2), x2);  d.w = dot(random3(s + 1.0), x3);  w *= w;   w *= w;  d *= w;   return dot(d, vec4(52.0));     }  
		float noise(vec3 m) {return 0.5333333*simplex3d(m)+0.2666667*simplex3d(2.0*m)+0.1333333*simplex3d(4.0*m)+0.0666667*simplex3d(8.0*m);}

		void main(void)
		{
			float ns1 = noise(vPosition.xyz*0.00005+vec3(vUv.x,vUv.y,0.) + vec3(time*0.013) );
			float ns2 = noise(vPosition.xyz*1.0+vec3(vUv.x,vUv.y,0.) + vec3(time*0.2) )*0.5+0.5;
			float ns3 = min(1.,max(0.,pow( ns1*ns2 ,1.)*3.));

			vec2 newUV = vUv;
			newUV *=  1.0 - newUV.yx;
			float vig = newUV.x * newUV.y * 30.0;
			vig = pow(vig, 0.75);

			ns3 *= vig;

			gl_FragColor = vec4(vec3(0,0,0)*(1.-ns3) + vec3(cr,cg,cb)*ns3, 1.0);
		}`;
	},
	//Cloud Shader Callback
	"cloudcallback": function(){
		window.shaderMaterial.setFloat("time", window.time);
		window.skyShaderMaterial.setFloat("cr", window.cr);
		window.skyShaderMaterial.setFloat("cg", window.cg);
		window.skyShaderMaterial.setFloat("cb", window.cb);
		window.time += 0.01;
		window.shaderMaterial.setVector3("cameraPosition", scene.activeCamera.position);
	},
	//Sun Move Callback
	"sunmovecallback": function(){
		window.light.position=window.sun.position=new window.BABYLON.Vector3(window.sunorbdis * Math.sin(window.sunorbdelta), window.sunorbdis * Math.cos(window.sunorbdelta), 0);
		if(typeof terrapresent === "number"){
			window.light.setDirectionToTarget(window.actor.phys.position);
			window.night.setDirectionToTarget(window.actor.phys.position);
		}
		if(window.light.position.y < -35){
			window.lensFlareSystem.isEnabled=false;
			if(window.light.intensity > 0) window.light.intensity-=0.01; //fade as it sets
			if(window.skybox.material.reflectionTexture.level < 2.2) window.skybox.material.reflectionTexture.level+=0.01;
			if(window.skybox.material.emissiveColor.r > 0.1) window.skybox.material.emissiveColor.r-=0.01;
			if(window.skybox.material.emissiveColor.g > 0.1) window.skybox.material.emissiveColor.g-=0.01;
			if(window.skybox.material.emissiveColor.b > 0.1) window.skybox.material.emissiveColor.b-=0.01;
			if(scene.fogColor.r > 0.03) scene.fogColor.r-=0.01;
			if(scene.fogColor.g > 0.03) scene.fogColor.g-=0.01;
			if(scene.fogColor.b > 0.03) scene.fogColor.b-=0.01;
			if(window.cr > 0.3) window.cr=window.cg=window.cb-=0.0125; //fade cloud shader
		} else {
			window.lensFlareSystem.isEnabled=true;
			if(window.light.intensity < 1) window.light.intensity+=0.01; //brightens as it rises
			if(window.skybox.material.reflectionTexture.level > 0) window.skybox.material.reflectionTexture.level-=0.04;
			if(window.skybox.material.emissiveColor.r < window.fogR) window.skybox.material.emissiveColor.r+=0.04;
			if(window.skybox.material.emissiveColor.g < window.fogG) window.skybox.material.emissiveColor.g+=0.04;
			if(window.skybox.material.emissiveColor.b < window.fogB) window.skybox.material.emissiveColor.b+=0.04;
			if(scene.fogColor.r < window.fogR) scene.fogColor.r+=0.02;
			if(scene.fogColor.g < window.fogG) scene.fogColor.g+=0.02;
			if(scene.fogColor.b < window.fogB) scene.fogColor.b+=0.02;
			if(window.cr < 1) window.cr=window.cg=window.cb+=0.02; //fade cloud shader
		}
	}
};
window.console.log('[SkySys] Loaded.');