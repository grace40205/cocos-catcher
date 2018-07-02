
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;


        // 加载关卡数据
        cc.dm = {};
        cc.dm.levelData = require('LevelData');
        cc.dm.Mode = require('modeEnum');
        cc.dm.Dialog = require('dialogEnum');
        this.examMinScore = cc.dm.levelData.examMinScore;
        // console.log('minScore:' + this.examMinScore);
        this.examLocked = cc.dm.levelData.getExamLocked();    
        console.log('examLocked:' + this.examLocked);
    },

    start() {

    },
    onBtnDemon() {
        cc.dm.curMode = cc.dm.Mode.demon;
        cc.director.loadScene('Demon');
    },
    onBtnExciseBtn() {
        cc.dm.curMode = cc.dm.Mode.exercise;
        cc.director.loadScene('Exercise');
    },
    onBtnExam() {
        if(this.examLocked){
            console.log('exam locked.');
            return;
        }
        cc.dm.curMode = cc.dm.Mode.exam;
        cc.director.loadScene('Exercise');
    },



    // update (dt) {},
});
