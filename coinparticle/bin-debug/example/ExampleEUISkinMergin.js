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
var skins;
(function (skins) {
    var MainViewPanel = (function (_super) {
        __extends(MainViewPanel, _super);
        function MainViewPanel() {
            var _this = _super.call(this) || this;
            _this.skinName = 'MainViewPanelSkin';
            return _this;
        }
        MainViewPanel.prototype.addOnClick = function (callback, thisObj) {
            this.btn_effect1.addEventListener(egret.TouchEvent.TOUCH_TAP, callback, thisObj);
            this.btn_effect2.addEventListener(egret.TouchEvent.TOUCH_TAP, callback, thisObj);
        };
        MainViewPanel.prototype.removeOnClick = function (callback, thisObj) {
            this.btn_effect1.removeEventListener(egret.TouchEvent.TOUCH_TAP, callback, thisObj);
            this.btn_effect2.removeEventListener(egret.TouchEvent.TOUCH_TAP, callback, thisObj);
        };
        MainViewPanel.prototype.addOnChange = function (callback, thisObj) {
        };
        MainViewPanel.prototype.removeOnChange = function (callback, thisObj) {
        };
        return MainViewPanel;
    }(eui.Component));
    skins.MainViewPanel = MainViewPanel;
    __reflect(MainViewPanel.prototype, "skins.MainViewPanel");
})(skins || (skins = {}));
//# sourceMappingURL=ExampleEUISkinMergin.js.map