class MainView extends skins.MainViewPanel {
	private effect1Particle: custom.ParticleSystem;
	private effect2Particle: custom.ParticleSystem;

	public constructor() {
		super();

		this.addOnClick(this.onClick, this);
		this.initParticles();
		this.imgwin.visible=false;
	}

	private initParticles() {
		this.effect1Particle = new custom.ParticleSystem();
		let param1 = {
			"atlas_data": "conAni_mc",
			"atlas_texture": "conAni_tex",
			"max_count": 150,
			"emission_rate": 30,
			"emission_duration": 2000,
			"startoffset": {
				"initX": 0,
				"initY": -100,
				"offsetX": 700,
				"offsetY": 0
			},
			"lifetime": {
				"min": 1500,
				"max": 2000
			},
			"gravity": {
				"x": 0,
				"y": 0.0045
			},
			"direction": {
				"min": -35,
				"max": 35
			},
			"rotation": {
				"min": 0,
				"max": 360,
				"speed": 0.12
			},
			"scale": {
				"min": 1,
				"max": 1.2,
				"adjust": 1
			},
			"speed": {
				"min": 0,
				"max": 0,
				"drag": 0.000002
			}
		}
		this.effect1Particle.init(param1);
		this.effect1Particle.x = 640;
		this.effect1Particle.y = -100;
		this.addChild(this.effect1Particle);

		this.effect2Particle = new custom.ParticleSystem();
		let param2 = {
			"atlas_data": "conAni_mc",
			"atlas_texture": "conAni_tex",
			"max_count": 150,
			"emission_rate": 30,
			"emission_duration": 1000,
			"startoffset": {
				"offsetX": 50,
				"offsetY": 0
			},
			"lifetime": {
				"min": 2000,
				"max": 3000
			},
			"gravity": {
				"x": 0,
				"y": 0.002
			},
			"direction": {
				"min": -35,
				"max": 35
			},
			"rotation": {
				"min": 0,
				"max": 360,
				"speed": 0.12
			},
			"scale": {
				"min": 0.8,
				"max": 1.0,
				"adjust": 1.004
			},
			"speed": {
				"min": 1.2,
				"max": 1.4,
				"drag": 0.000002
			}
		}
		this.effect2Particle.init(param2);
		this.effect2Particle.x = 640;
		this.effect2Particle.y = 380;
		let index=this.getChildIndex(this.imgwin);
		this.addChildAt(this.effect2Particle,index-1);
	}

	private onClick(e: egret.Event): void {
		switch (e.currentTarget) {
			case this.btn_effect1:
				this.effect1Particle.start();
				this.playWin();
				break;
			case this.btn_effect2:
				this.effect2Particle.start();
				this.playWin();
				break;
		}
	}

	private playWin(): void {
		this.cleaWin();
		this.imgwin.visible = true;
		this.winIn.play(0);
		let self = this;
		egret.Tween.get(this.imgwin)
			.wait(1500)
			.call(function () {
				self.winout.play(0);
				self.winout.addEventListener('complete', self.onWinOutComplete, self);
			});
	}

	private onWinOutComplete(e: egret.Event) {
		this.cleaWin();
	}

	private cleaWin() {
		this.imgwin.visible = false;
		egret.Tween.removeTweens(this.imgwin)
	}
}