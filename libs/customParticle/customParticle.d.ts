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
declare module custom {
    class ParticleSystem extends eui.Component {
        private particlesActive;
        private _timeOut;
        private _interval;
        private _cache;
        private _onComplete;
        private _path;
        private _pathCycle;
        private _pathDistance;
        private _startTime;
        private _params;
        private _movName;
        private _hasLoopTime;
        private milliseconds;
        private timeDelta;
        private timeStamp;
        private timeMul;
        private _objects;
        private _timeableId;
        constructor();
        /**
         * params 粒子初始化参数
         * movName 动画名称
         */
        init(params: any, movName?: string): void;
        start(duration?: number, emissionRate?: number, onComplete?: any, pathData?: any): void;
        private getStartPostition();
        /**
         * 停止粒子
         */
        stop(): void;
        private update(dt);
        /**
         * 添加一个particle子项
         * particle子项必须实现ITimeable接口
         * @param object
         */
        addObject(object: ITimeable): void;
        /**
         * 移除一个particle子项
         * @param object
         */
        deleteObject(object: ITimeable): void;
        private getNextTimeableID();
        /**
         * 根据路径获取下一个点
         */
        private getNextPathPosition(msOffset?);
        /**
         * 适配，将value适配到fit之内
         */
        private normalize(value, fit);
        /**
         * 初始化路径
         */
        private preProcessPath();
        private calcDistance(p1, p2);
        /**
         * 在创建的初始粒子缓存中取一个粒子
         */
        private getParticle();
        /**
         * 创建粒子
         */
        private createCache();
        /**
         * 粒子移除时回调
         * @param p
         */
        private onParticleStopped(p);
    }
    interface ITimeable {
        update(delta: Number): void;
    }
    /**
     * 返回区间值
     *
     * @param min
     * @param max
     * @returns {any}
     */
    function getRandomRange(min: any, max: any, isInteger?: any): number;
}
