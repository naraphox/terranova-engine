var BABYLON,__extends=this&&this.__extends||(function(){var n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,t){i.__proto__=t}||function(i,t){for(var e in t)t.hasOwnProperty(e)&&(i[e]=t[e])};return function(i,t){function e(){this.constructor=i}n(i,t),i.prototype=null===t?Object.create(t):(e.prototype=t.prototype,new e)}})(),__decorate=this&&this.__decorate||function(i,t,e,n){var o,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,e):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(i,t,e,n);else for(var l=i.length-1;0<=l;l--)(o=i[l])&&(a=(r<3?o(a):3<r?o(t,e,a):o(t,e))||a);return 3<r&&a&&Object.defineProperty(t,e,a),a};!(function(l){var s=(function(t){function i(){var i=t.call(this)||this;return i.TRANSPARENT=!1,i.FOG=!1,i.PREMULTIPLYALPHA=!1,i.rebuild(),i}return __extends(i,t),i})(l.MaterialDefines),i=(function(n){function o(i,t){var e=n.call(this,i,t)||this;return e.mainColor=l.Color3.Black(),e.lineColor=l.Color3.Teal(),e.gridRatio=1,e.gridOffset=l.Vector3.Zero(),e.majorUnitFrequency=10,e.minorUnitVisibility=.33,e.opacity=1,e.preMultiplyAlpha=!1,e._gridControl=new l.Vector4(e.gridRatio,e.majorUnitFrequency,e.minorUnitVisibility,e.opacity),e}return __extends(o,n),o.prototype.needAlphaBlending=function(){return this.opacity<1},o.prototype.needAlphaBlendingForMesh=function(i){return this.needAlphaBlending()},o.prototype.isReadyForSubMesh=function(i,t,e){if(this.isFrozen&&this._wasPreviouslyReady&&t.effect)return!0;t._materialDefines||(t._materialDefines=new s);var n=t._materialDefines,o=this.getScene();if(!this.checkReadyOnEveryCall&&t.effect&&this._renderId===o.getRenderId())return!0;if(n.TRANSPARENT!==this.opacity<1&&(n.TRANSPARENT=!n.TRANSPARENT,n.markAsUnprocessed()),n.PREMULTIPLYALPHA!=this.preMultiplyAlpha&&(n.PREMULTIPLYALPHA=!n.PREMULTIPLYALPHA,n.markAsUnprocessed()),l.MaterialHelper.PrepareDefinesForMisc(i,o,!1,!1,this.fogEnabled,!1,n),n.isDirty){n.markAsProcessed(),o.resetCachedMaterial();var r=[l.VertexBuffer.PositionKind,l.VertexBuffer.NormalKind],a=n.toString();t.setEffect(o.getEngine().createEffect("grid",r,["projection","worldView","mainColor","lineColor","gridControl","gridOffset","vFogInfos","vFogColor","world","view"],[],a,void 0,this.onCompiled,this.onError),n)}return!(!t.effect||!t.effect.isReady())&&(this._renderId=o.getRenderId(),this._wasPreviouslyReady=!0)},o.prototype.bindForSubMesh=function(i,t,e){var n=this.getScene();if(e._materialDefines){var o=e.effect;o&&(this._activeEffect=o,this.bindOnlyWorldMatrix(i),this._activeEffect.setMatrix("worldView",i.multiply(n.getViewMatrix())),this._activeEffect.setMatrix("view",n.getViewMatrix()),this._activeEffect.setMatrix("projection",n.getProjectionMatrix()),this._mustRebind(n,o)&&(this._activeEffect.setColor3("mainColor",this.mainColor),this._activeEffect.setColor3("lineColor",this.lineColor),this._activeEffect.setVector3("gridOffset",this.gridOffset),this._gridControl.x=this.gridRatio,this._gridControl.y=Math.round(this.majorUnitFrequency),this._gridControl.z=this.minorUnitVisibility,this._gridControl.w=this.opacity,this._activeEffect.setVector4("gridControl",this._gridControl)),l.MaterialHelper.BindFogParameters(n,t,this._activeEffect),this._afterBind(t,this._activeEffect))}},o.prototype.dispose=function(i){n.prototype.dispose.call(this,i)},o.prototype.clone=function(i){var t=this;return l.SerializationHelper.Clone((function(){return new o(i,t.getScene())}),this)},o.prototype.serialize=function(){var i=l.SerializationHelper.Serialize(this);return i.customType="BABYLON.GridMaterial",i},o.prototype.getClassName=function(){return"GridMaterial"},o.Parse=function(i,t,e){return l.SerializationHelper.Parse((function(){return new o(i.name,t)}),i,t,e)},__decorate([l.serializeAsColor3()],o.prototype,"mainColor",void 0),__decorate([l.serializeAsColor3()],o.prototype,"lineColor",void 0),__decorate([l.serialize()],o.prototype,"gridRatio",void 0),__decorate([l.serializeAsColor3()],o.prototype,"gridOffset",void 0),__decorate([l.serialize()],o.prototype,"majorUnitFrequency",void 0),__decorate([l.serialize()],o.prototype,"minorUnitVisibility",void 0),__decorate([l.serialize()],o.prototype,"opacity",void 0),__decorate([l.serialize()],o.prototype,"preMultiplyAlpha",void 0),o})(l.PushMaterial);l.GridMaterial=i})(BABYLON||(BABYLON={})),BABYLON.Effect.ShadersStore.gridVertexShader="precision highp float;\n\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 projection;\nuniform mat4 world;\nuniform mat4 view;\nuniform mat4 worldView;\n\n#ifdef TRANSPARENT\nvarying vec4 vCameraSpacePosition;\n#endif\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n#include<fogVertexDeclaration>\nvoid main(void) {\n#ifdef FOG\nvec4 worldPos=world*vec4(position,1.0);\n#endif\n#include<fogVertex>\nvec4 cameraSpacePosition=worldView*vec4(position,1.0);\ngl_Position=projection*cameraSpacePosition;\n#ifdef TRANSPARENT\nvCameraSpacePosition=cameraSpacePosition;\n#endif\nvPosition=position;\nvNormal=normal;\n}",BABYLON.Effect.ShadersStore.gridPixelShader="#extension GL_OES_standard_derivatives : enable\n#define SQRT2 1.41421356\n#define PI 3.14159\nprecision highp float;\nuniform vec3 mainColor;\nuniform vec3 lineColor;\nuniform vec4 gridControl;\nuniform vec3 gridOffset;\n\n#ifdef TRANSPARENT\nvarying vec4 vCameraSpacePosition;\n#endif\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n#include<fogFragmentDeclaration>\nfloat getVisibility(float position) {\n\nfloat majorGridFrequency=gridControl.y;\nif (floor(position+0.5) == floor(position/majorGridFrequency+0.5)*majorGridFrequency)\n{\nreturn 1.0;\n} \nreturn gridControl.z;\n}\nfloat getAnisotropicAttenuation(float differentialLength) {\nconst float maxNumberOfLines=10.0;\nreturn clamp(1.0/(differentialLength+1.0)-1.0/maxNumberOfLines,0.0,1.0);\n}\nfloat isPointOnLine(float position,float differentialLength) {\nfloat fractionPartOfPosition=position-floor(position+0.5); \nfractionPartOfPosition/=differentialLength; \nfractionPartOfPosition=clamp(fractionPartOfPosition,-1.,1.);\nfloat result=0.5+0.5*cos(fractionPartOfPosition*PI); \nreturn result; \n}\nfloat contributionOnAxis(float position) {\nfloat differentialLength=length(vec2(dFdx(position),dFdy(position)));\ndifferentialLength*=SQRT2; \n\nfloat result=isPointOnLine(position,differentialLength);\n\nfloat visibility=getVisibility(position);\nresult*=visibility;\n\nfloat anisotropicAttenuation=getAnisotropicAttenuation(differentialLength);\nresult*=anisotropicAttenuation;\nreturn result;\n}\nfloat normalImpactOnAxis(float x) {\nfloat normalImpact=clamp(1.0-3.0*abs(x*x*x),0.0,1.0);\nreturn normalImpact;\n}\nvoid main(void) {\n\nfloat gridRatio=gridControl.x;\nvec3 gridPos=(vPosition+gridOffset)/gridRatio;\n\nfloat x=contributionOnAxis(gridPos.x);\nfloat y=contributionOnAxis(gridPos.y);\nfloat z=contributionOnAxis(gridPos.z);\n\nvec3 normal=normalize(vNormal);\nx*=normalImpactOnAxis(normal.x);\ny*=normalImpactOnAxis(normal.y);\nz*=normalImpactOnAxis(normal.z);\n\nfloat grid=clamp(x+y+z,0.,1.);\n\nvec3 color=mix(mainColor,lineColor,grid);\n#ifdef FOG\n#include<fogFragment>\n#endif\n#ifdef TRANSPARENT\nfloat distanceToFragment=length(vCameraSpacePosition.xyz);\nfloat cameraPassThrough=clamp(distanceToFragment-0.25,0.0,1.0);\nfloat opacity=clamp(grid,0.08,cameraPassThrough*gridControl.w*grid);\ngl_FragColor=vec4(color.rgb,opacity);\n#ifdef PREMULTIPLYALPHA\ngl_FragColor.rgb*=opacity;\n#endif\n#else\n\ngl_FragColor=vec4(color.rgb,1.0);\n#endif\n}";