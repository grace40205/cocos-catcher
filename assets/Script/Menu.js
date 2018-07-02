
cc.Class({
    extends: cc.Component,

    properties: {
        DemonN:cc.Node,
        ExercisN:cc.Node,
        ExamN:cc.Node,
       
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.DemonN.on(cc.Node.EventType.MOUSE_MOVE, function(event){
             console.log('演示模式');
             let tipDemon=this.getChildByName('MenuTipD');
             tipDemon.active=true;

         },this.DemonN);
         this.ExercisN.on(cc.Node.EventType.MOUSE_MOVE, function(event){
            cc.log('-------ExercisN-------'); 
         }, this.ExercisN);
         this.ExamN.on(cc.Node.EventType.MOUSE_MOVE, function(event){
            cc.log('-------ExamN-------'); 
        }, this.ExamN);
        
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
