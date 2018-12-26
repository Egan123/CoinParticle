
module skins{
	export class MainViewPanel extends eui.Component {
		
	public winIn:egret.tween.TweenGroup;
	public winout:egret.tween.TweenGroup;
	public btn_effect1:eui.Button;
	public btn_effect2:eui.Button;
	public imgwin:eui.Image;

		public constructor() {
			super();
			this.skinName = 'MainViewPanelSkin';
		}
		public addOnClick( callback, thisObj ):void {
		this.btn_effect1.addEventListener( egret.TouchEvent.TOUCH_TAP, callback, thisObj );
		this.btn_effect2.addEventListener( egret.TouchEvent.TOUCH_TAP, callback, thisObj );

		}
		public removeOnClick( callback, thisObj ):void {
		this.btn_effect1.removeEventListener( egret.TouchEvent.TOUCH_TAP, callback, thisObj );
		this.btn_effect2.removeEventListener( egret.TouchEvent.TOUCH_TAP, callback, thisObj );

		}
		public addOnChange( callback, thisObj ):void {

		}
		public removeOnChange( callback, thisObj ):void {

		}
	}
}