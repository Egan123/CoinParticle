var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
Custom Particle System
example params :
"parameters": {
    "atlas_data" : "conAni_mc",//资源数据
    "atlas_texture": "conAni_tex",//资源texture
    "max_count" : 20,//缓存数量
    "emission_rate" : 10,//出现速率1000/emission_rate 创建 emission_rate/10个
    "emission_duration": 1000,//出现总时间
    "startoffset":{
        "x":100,
        "y":0
    },
    "lifetime" :
    {
        "min" : 1000,
        "max" : 2000
    },
    "gravity": {
        "x" : 0,
        "y" : 0.0007
    },
    "direction": {
        "min": -30,
        "max": 30
    },
    "rotation" :
    {
        "min" : 0,
        "max" : 360,
        "speed" : 0.1
    },
    "scale": {
        "min": 0.2,
        "max": 0.5
    },
    "speed": {
        "min": 0.3,
        "max": 0.5,
        "drag" : 0.0002
    },
    //path非必须，粒子如果没有路径跟随，可以不使用
    "path": {
        "speed": 0.09,
        "cycle":0,//路径是否闭包
        "waypoints": [
            {
                "x": 0,
                "y": 0
            },
            {
                "x": 137,
                "y": 0
            },
            {
                "x": 137,
                "y": 385
            },
            {
                "x": 0,
                "y": 385
            }
        ]
    }
}
 */
var custom;
(function (custom) {
    var ParticleSystem = (function (_super) {
        __extends(ParticleSystem, _super);
        function ParticleSystem() {
            var _this = _super.call(this) || this;
            _this.particlesActive = 0; // 所有存活的粒子数
            _this._timeOut = -1; //超时停止粒子timeOut
            _this._interval = -1; // 创建粒子的间隔interval
            _this._cache = []; // 缓存粒子数组
            _this._params = null; //参数列表
            _this._movName = null; //动画名字
            _this.milliseconds = 0; // tick时间间隔
            _this.timeDelta = 0; //帧率时间
            _this.timeStamp = 0; //egret时间
            _this.timeMul = 1; //时间倍数，可控制运行速度
            _this._objects = {}; // 需要刷新显示的particle子项
            _this._timeableId = 1; // 数组particle子项对应id
            _this.visible = false;
            return _this;
        }
        /**
         * params 粒子初始化参数
         * movName 动画名称
         */
        ParticleSystem.prototype.init = function (params, movName) {
            if (movName === void 0) { movName = ""; }
            this._params = params;
            this._movName = movName;
            this.createCache();
        };
        ParticleSystem.prototype.start = function (duration, emissionRate, onComplete, pathData) {
            this.stop();
            this.visible = true;
            this.timeStamp = egret.getTimer();
            egret.startTick(this.update, this);
            var self = this;
            var timeMul = this.timeMul;
            duration = duration || this._params["emission_duration"] * timeMul || 1;
            this._onComplete = onComplete;
            this._path = pathData || this._params["path"];
            this._pathCycle = true;
            if (this._params["path"] && this._params["path"]["cycle"] != null)
                this._pathCycle = this._params["path"]["cycle"] == 1;
            if (this._path)
                this.preProcessPath();
            emissionRate = emissionRate || this._params["emission_rate"];
            this._timeOut = egret.setTimeout(function () {
                self._timeOut = -1;
                self.stop();
            }, this, duration);
            this._startTime = 0;
            this._interval = egret.setInterval(function () {
                var ppt = Math.floor(emissionRate / 10);
                if (ppt == 0)
                    ppt = 1;
                var msOffset = 0;
                while (ppt-- > 0) {
                    var p = self.getParticle();
                    if (p == null)
                        egret.log("Has no able p!");
                    if (p) {
                        self.particlesActive++;
                        if (!self._path) {
                            p.mStart(self.getStartPostition());
                        }
                        else {
                            p.mStart(self.getNextPathPosition(msOffset));
                            msOffset += 1000 / emissionRate;
                        }
                    }
                }
            }, this, 1000 / emissionRate);
        };
        ParticleSystem.prototype.getStartPostition = function () {
            var initX = this._params["startoffset"].initX != null ? this._params["startoffset"].initX : 0;
            var initY = this._params["startoffset"].initY != null ? this._params["startoffset"].initY : 0;
            var offsetX = this._params["startoffset"].offsetX != null ? this._params["startoffset"].offsetX : 0;
            var offsetY = this._params["startoffset"].offsetY != null ? this._params["startoffset"].offsetY : 0;
            var p = {
                x: initX + getRandomRange(-offsetX, offsetX),
                y: initY + getRandomRange(-offsetY, offsetY)
            };
            return p;
        };
        /**
         * 停止粒子
         */
        ParticleSystem.prototype.stop = function () {
            if (this._interval != -1) {
                egret.clearInterval(this._interval);
                this._interval = -1;
            }
            if (this._timeOut != -1) {
                egret.clearTimeout(this._timeOut);
                this._timeOut = -1;
            }
        };
        ParticleSystem.prototype.update = function (dt) {
            this.timeDelta = dt - this.timeStamp;
            this.milliseconds += this.timeDelta;
            this.timeStamp = dt;
            for (var key in this._objects) {
                this._objects[key].update(this.timeDelta * this.timeMul);
            }
            return true;
        };
        /**
         * 添加一个particle子项
         * particle子项必须实现ITimeable接口
         * @param object
         */
        ParticleSystem.prototype.addObject = function (object) {
            // assign timeable unique id
            var id = this.getNextTimeableID();
            object["timeableId"] = id;
            this._objects[id] = object;
        };
        /**
         * 移除一个particle子项
         * @param object
         */
        ParticleSystem.prototype.deleteObject = function (object) {
            delete this._objects[object["timeableId"]];
        };
        ParticleSystem.prototype.getNextTimeableID = function () {
            return this._timeableId++;
        };
        /**
         * 根据路径获取下一个点
         */
        ParticleSystem.prototype.getNextPathPosition = function (msOffset) {
            var elapsed = (this.milliseconds - this._startTime) + msOffset;
            var targetDistance = elapsed * this._path.speed * 30;
            if (!this._pathCycle) {
                //没有闭环，在最后一个点结束
                if (targetDistance > this._path.waypoints[this._path.waypoints.length - 1].totalDistance - 10) {
                    this.stop();
                }
            }
            targetDistance = this.normalize(targetDistance, this._pathDistance);
            var i = 0;
            for (i = this._path.waypoints.length - 1; i >= 1; i--) {
                if (targetDistance > this._path.waypoints[i].totalDistance)
                    break;
            }
            var lastWp = this._path.waypoints[i];
            if (++i >= this._path.waypoints.length)
                i = 0;
            var nextWp = this._path.waypoints[i];
            var t = 1 - ((nextWp.totalDistance - targetDistance) / nextWp.spanDistance);
            var p = {
                x: lastWp.x + ((nextWp.x - lastWp.x) * t),
                y: lastWp.y + ((nextWp.y - lastWp.y) * t)
            };
            // egret.log("p.x,p.y ",i,Math.round(p.x),Math.round(p.y));
            return p;
        };
        /**
         * 适配，将value适配到fit之内
         */
        ParticleSystem.prototype.normalize = function (value, fit) {
            if (value < 0) {
                while (value < 0) {
                    value += fit;
                }
            }
            else if (value > fit) {
                while (value > fit) {
                    value -= fit;
                }
            }
            return value;
        };
        /**
         * 初始化路径
         */
        ParticleSystem.prototype.preProcessPath = function () {
            var lastWp = this._path.waypoints[0];
            var totalDistance = 0;
            for (var w = 1; w < this._path.waypoints.length; w++) {
                var nextWp = this._path.waypoints[w];
                nextWp.index = w;
                nextWp.spanDistance = this.calcDistance(lastWp, nextWp);
                totalDistance += nextWp.spanDistance;
                nextWp.totalDistance = totalDistance;
                lastWp = nextWp;
            }
            var lastSpan = this.calcDistance(this._path.waypoints[0], this._path.waypoints[this._path.waypoints.length - 1]);
            totalDistance += lastSpan;
            this._pathDistance = totalDistance;
            this._path.waypoints[0].index = 0;
            this._path.waypoints[0].totalDistance = totalDistance;
            this._path.waypoints[0].spanDistance = lastSpan;
        };
        ParticleSystem.prototype.calcDistance = function (p1, p2) {
            var xd = p1.x - p2.x;
            var yd = p1.y - p2.y;
            return Math.sqrt(xd * xd + yd * yd);
        };
        /**
         * 在创建的初始粒子缓存中取一个粒子
         */
        ParticleSystem.prototype.getParticle = function () {
            var p = null;
            for (var i = 0; i < this._cache.length; i++) {
                var p2 = this._cache[i];
                if (!p2.inUse) {
                    p = p2;
                    break;
                }
            }
            return p;
        };
        /**
         * 创建粒子
         */
        ParticleSystem.prototype.createCache = function () {
            var self = this;
            for (var i = 1; i <= self._params["max_count"]; i++) {
                var configData = self._params["atlas_data"];
                var configTexture = self._params["atlas_texture"];
                var data = RES.getRes(configData + "_json");
                var texture = RES.getRes(configTexture + "_png");
                var mcFactory = new egret.MovieClipDataFactory(data, texture);
                var p = new Particle(mcFactory.generateMovieClipData(this._movName));
                p.init(self, self._params, self, this.onParticleStopped);
                self._cache.push(p);
            }
        };
        /**
         * 粒子移除时回调
         * @param p
         */
        ParticleSystem.prototype.onParticleStopped = function (p) {
            if (--this.particlesActive == 0) {
                //所有的都停止了
                this.visible = false;
                egret.stopTick(this.update, this);
                this.milliseconds = 0;
                if (this._onComplete)
                    this._onComplete();
            }
        };
        return ParticleSystem;
    }(eui.Component));
    custom.ParticleSystem = ParticleSystem;
    __reflect(ParticleSystem.prototype, "custom.ParticleSystem");
    /**
     * Particle
     */
    var Particle = (function (_super) {
        __extends(Particle, _super);
        function Particle(movieClipData) {
            var _this = _super.call(this, movieClipData) || this;
            _this._randRange = getRandomRange;
            _this.inUse = false;
            return _this;
        }
        Particle.prototype.init = function (container, params, customParticle, onStopped) {
            this._onStopped = onStopped;
            this._params = params;
            this._container = container;
            this._particleSystem = customParticle;
        };
        /**
         * 开始
         */
        Particle.prototype.mStart = function (startPosition) {
            this.inUse = true;
            //随机播放传入的动画序列
            var paramSprite = this._params.sprites;
            if (paramSprite != null && paramSprite.length > 0) {
                this.gotoAndPlay(paramSprite[Math.floor(this._randRange(0, paramSprite.length))], -1);
            }
            else {
                this.play(-1);
            }
            //初始位置
            this.x = startPosition.x;
            this.y = startPosition.y;
            //重力
            this._gx = 0;
            this._gy = 0;
            //生命周期
            this._life = this._randRange(this._params.lifetime.min, this._params.lifetime.max);
            //缩放
            var s = this._randRange(this._params.scale.min, this._params.scale.max);
            this.scaleX = s;
            this.scaleY = s;
            //速度
            this._v = this._randRange(this._params.speed.min, this._params.speed.max);
            //根据角度计算出xy方向速度
            var d = this._randRange(this._params.direction.min, this._params.direction.max);
            this._vx = Math.sin(Math.PI / 180 * d);
            this._vy = -Math.cos(Math.PI / 180 * d);
            // 角度
            this.rotation = this._randRange(this._params.rotation.min, this._params.rotation.max);
            this._container.addChild(this);
            this._particleSystem.addObject(this);
        };
        /**
         * 停止
         */
        Particle.prototype.mStop = function () {
            // this._container.removeChild(this);
            if (this && this.parent)
                this.parent.removeChild(this);
            this._particleSystem.deleteObject(this);
            this.inUse = false;
            this._onStopped.call(this._container, this);
        };
        Particle.prototype.update = function (delta) {
            // 速度相关
            this.x += this._vx * this._v * delta;
            this.y += this._vy * this._v * delta;
            // 重力相关
            this._gx += this._params.gravity.x * delta;
            this._gy += this._params.gravity.y * delta;
            this.x += this._gx * delta;
            this.y += this._gy * delta;
            // 缩放相关
            this.scaleX *= this._params.scale.adjust;
            this.scaleY *= this._params.scale.adjust;
            // 缩放太小的话停止并移除舞台
            if (this.scaleX < 0.05) {
                this.mStop();
                return;
            }
            // 回拖
            if (this._v > 0)
                this._v -= this._params.speed.drag * delta;
            // 旋转相关
            this.rotation += this._params.rotation.speed * delta;
            // 生命周期相关
            this._life -= delta;
            if (this._life <= 0) {
                this.mStop();
            }
        };
        return Particle;
    }(egret.MovieClip));
    __reflect(Particle.prototype, "Particle", ["custom.ITimeable"]);
    /**
     * 返回区间值
     *
     * @param min
     * @param max
     * @returns {any}
     */
    function getRandomRange(min, max, isInteger) {
        var r = Math.random() * (max - min) + min;
        if (isInteger)
            r = Math.floor(r);
        return r;
    }
    custom.getRandomRange = getRandomRange;
})(custom || (custom = {}));
