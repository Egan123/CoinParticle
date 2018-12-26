var __reflect=this&&this.__reflect||function(t,i,s){t.__class__=i,s?s.push(i):s=[i],t.__types__=t.__types__?s.concat(t.__types__):s},__extends=this&&this.__extends||function(t,i){function s(){this.constructor=t}for(var e in i)i.hasOwnProperty(e)&&(t[e]=i[e]);s.prototype=i.prototype,t.prototype=new s},custom;!function(t){function i(t,i,s){var e=Math.random()*(i-t)+t;return s&&(e=Math.floor(e)),e}var s=function(t){function s(){var i=t.call(this)||this;return i.particlesActive=0,i._timeOut=-1,i._interval=-1,i._cache=[],i._params=null,i._movName=null,i.milliseconds=0,i.timeDelta=0,i.timeStamp=0,i.timeMul=1,i._objects={},i._timeableId=1,i.visible=!1,i}return __extends(s,t),s.prototype.init=function(t,i){void 0===i&&(i=""),this._params=t,this._movName=i,this.createCache()},s.prototype.start=function(t,i,s,e){this.stop(),this.visible=!0,this.timeStamp=egret.getTimer(),egret.startTick(this.update,this);var a=this,h=this.timeMul;t=t||this._params.emission_duration*h||1,this._onComplete=s,this._path=e||this._params.path,this._pathCycle=!0,this._params.path&&null!=this._params.path.cycle&&(this._pathCycle=1==this._params.path.cycle),this._path&&this.preProcessPath(),i=i||this._params.emission_rate,this._timeOut=egret.setTimeout(function(){a._timeOut=-1,a.stop()},this,t),this._startTime=0,this._interval=egret.setInterval(function(){var t=Math.floor(i/10);0==t&&(t=1);for(var s=0;t-->0;){var e=a.getParticle();null==e&&egret.log("Has no able p!"),e&&(a.particlesActive++,a._path?(e.mStart(a.getNextPathPosition(s)),s+=1e3/i):e.mStart(a.getStartPostition()))}},this,1e3/i)},s.prototype.getStartPostition=function(){var t=null!=this._params.startoffset.initX?this._params.startoffset.initX:0,s=null!=this._params.startoffset.initY?this._params.startoffset.initY:0,e=null!=this._params.startoffset.offsetX?this._params.startoffset.offsetX:0,a=null!=this._params.startoffset.offsetY?this._params.startoffset.offsetY:0,h={x:t+i(-e,e),y:s+i(-a,a)};return h},s.prototype.stop=function(){-1!=this._interval&&(egret.clearInterval(this._interval),this._interval=-1),-1!=this._timeOut&&(egret.clearTimeout(this._timeOut),this._timeOut=-1)},s.prototype.update=function(t){this.timeDelta=t-this.timeStamp,this.milliseconds+=this.timeDelta,this.timeStamp=t;for(var i in this._objects)this._objects[i].update(this.timeDelta*this.timeMul);return!0},s.prototype.addObject=function(t){var i=this.getNextTimeableID();t.timeableId=i,this._objects[i]=t},s.prototype.deleteObject=function(t){delete this._objects[t.timeableId]},s.prototype.getNextTimeableID=function(){return this._timeableId++},s.prototype.getNextPathPosition=function(t){var i=this.milliseconds-this._startTime+t,s=i*this._path.speed*30;this._pathCycle||s>this._path.waypoints[this._path.waypoints.length-1].totalDistance-10&&this.stop(),s=this.normalize(s,this._pathDistance);var e=0;for(e=this._path.waypoints.length-1;e>=1&&!(s>this._path.waypoints[e].totalDistance);e--);var a=this._path.waypoints[e];++e>=this._path.waypoints.length&&(e=0);var h=this._path.waypoints[e],r=1-(h.totalDistance-s)/h.spanDistance,n={x:a.x+(h.x-a.x)*r,y:a.y+(h.y-a.y)*r};return n},s.prototype.normalize=function(t,i){if(0>t)for(;0>t;)t+=i;else if(t>i)for(;t>i;)t-=i;return t},s.prototype.preProcessPath=function(){for(var t=this._path.waypoints[0],i=0,s=1;s<this._path.waypoints.length;s++){var e=this._path.waypoints[s];e.index=s,e.spanDistance=this.calcDistance(t,e),i+=e.spanDistance,e.totalDistance=i,t=e}var a=this.calcDistance(this._path.waypoints[0],this._path.waypoints[this._path.waypoints.length-1]);i+=a,this._pathDistance=i,this._path.waypoints[0].index=0,this._path.waypoints[0].totalDistance=i,this._path.waypoints[0].spanDistance=a},s.prototype.calcDistance=function(t,i){var s=t.x-i.x,e=t.y-i.y;return Math.sqrt(s*s+e*e)},s.prototype.getParticle=function(){for(var t=null,i=0;i<this._cache.length;i++){var s=this._cache[i];if(!s.inUse){t=s;break}}return t},s.prototype.createCache=function(){for(var t=this,i=1;i<=t._params.max_count;i++){var s=t._params.atlas_data,a=t._params.atlas_texture,h=RES.getRes(s+"_json"),r=RES.getRes(a+"_png"),n=new egret.MovieClipDataFactory(h,r),o=new e(n.generateMovieClipData(this._movName));o.init(t,t._params,t,this.onParticleStopped),t._cache.push(o)}},s.prototype.onParticleStopped=function(t){0==--this.particlesActive&&(this.visible=!1,egret.stopTick(this.update,this),this.milliseconds=0,this._onComplete&&this._onComplete())},s}(eui.Component);t.ParticleSystem=s,__reflect(s.prototype,"custom.ParticleSystem");var e=function(t){function s(s){var e=t.call(this,s)||this;return e._randRange=i,e.inUse=!1,e}return __extends(s,t),s.prototype.init=function(t,i,s,e){this._onStopped=e,this._params=i,this._container=t,this._particleSystem=s},s.prototype.mStart=function(t){this.inUse=!0;var i=this._params.sprites;null!=i&&i.length>0?this.gotoAndPlay(i[Math.floor(this._randRange(0,i.length))],-1):this.play(-1),this.x=t.x,this.y=t.y,this._gx=0,this._gy=0,this._life=this._randRange(this._params.lifetime.min,this._params.lifetime.max);var s=this._randRange(this._params.scale.min,this._params.scale.max);this.scaleX=s,this.scaleY=s,this._v=this._randRange(this._params.speed.min,this._params.speed.max);var e=this._randRange(this._params.direction.min,this._params.direction.max);this._vx=Math.sin(Math.PI/180*e),this._vy=-Math.cos(Math.PI/180*e),this.rotation=this._randRange(this._params.rotation.min,this._params.rotation.max),this._container.addChild(this),this._particleSystem.addObject(this)},s.prototype.mStop=function(){this&&this.parent&&this.parent.removeChild(this),this._particleSystem.deleteObject(this),this.inUse=!1,this._onStopped.call(this._container,this)},s.prototype.update=function(t){return this.x+=this._vx*this._v*t,this.y+=this._vy*this._v*t,this._gx+=this._params.gravity.x*t,this._gy+=this._params.gravity.y*t,this.x+=this._gx*t,this.y+=this._gy*t,this.scaleX*=this._params.scale.adjust,this.scaleY*=this._params.scale.adjust,this.scaleX<.05?void this.mStop():(this._v>0&&(this._v-=this._params.speed.drag*t),this.rotation+=this._params.rotation.speed*t,this._life-=t,void(this._life<=0&&this.mStop()))},s}(egret.MovieClip);__reflect(e.prototype,"Particle",["custom.ITimeable"]),t.getRandomRange=i}(custom||(custom={}));