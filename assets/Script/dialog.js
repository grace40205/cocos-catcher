// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onContinue(){
        // 练习模式解锁测试模式 unlockDialog
        // 练习模式过小关 succuessDialog

        cc.dm.curMode = cc.dm.Mode.exercise;
        this.gameJs.hideDialog(this.type);
        this.gameJs.changeLevel();
    },

    onMenu(){        
        cc.dm.curMode = cc.dm.Mode.menu;
        cc.director.loadScene('Menu');
    },

    onExam(){
        // 练习模式解锁测试模式 unlockDialog
        cc.dm.curMode = cc.dm.Mode.exam;
        cc.director.loadScene('Exercise');
    },

    onRestart(){
        // 重新开始：
        // 测试模式游戏失败 gameOverDialog
        // 测试模式游戏通关 doneDialog
        cc.dm.curMode = cc.dm.Mode.exam;
        cc.director.loadScene('Exercise');
    },

    // update (dt) {},
});
