
cc.Class({
    extends: cc.Component,

    properties: {
        //audioSource:cc.AudioSource,
        DemonN:cc.Node,
        ExercisN:cc.Node,
        ExamN:cc.Node,
        music:cc.Node,
        musicPlay:cc.SpriteFrame,
        musicPause:cc.SpriteFrame,
       
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.menuB=this.node.getChildByName('MenuBackground');
         this.audioSource=this.menuB.getComponent(cc.AudioSource);

         this.audioSource.play();
         this.isPlayingMusic=true;
         this.btnMusic=this.node.getChildByName('BtnMusic');
         this.btnAudio=this.btnMusic.getComponent(cc.AudioSource);
         

        //当鼠标在按钮上时显示提示框
         this.DemonN.on(cc.Node.EventType.MOUSE_MOVE, function(event){
             console.log('演示模式');
             let tipDemon=this.getChildByName('MenuTipD');
             tipDemon.active=true;

         },this.DemonN);
         //当鼠标离开时
         this.DemonN.on(cc.Node.EventType.MOUSE_LEAVE, function(event){
            console.log('演示模式');
            let tipDemon=this.getChildByName('MenuTipD');
            tipDemon.active=false;

        },this.DemonN);

         this.ExercisN.on(cc.Node.EventType.MOUSE_MOVE, function(event){
            cc.log('-------ExercisN-------'); 
            let tip=this.getChildByName('MenuTipExce');
            tip.active=true;
         }, this.ExercisN);
         this.ExercisN.on(cc.Node.EventType.MOUSE_LEAVE, function(event){
            cc.log('-------ExercisN-------'); 
            let tip=this.getChildByName('MenuTipExce');
            tip.active=false;
         }, this.ExercisN);

         this.ExamN.on(cc.Node.EventType.MOUSE_MOVE, function(event){
            cc.log('-------ExamN-------'); 
            let tip=this.getChildByName('MenuTipChall');
            tip.active=true;
        }, this.ExamN);
        this.ExamN.on(cc.Node.EventType.MOUSE_LEAVE, function(event){
            cc.log('-------ExamN-------'); 
            let tip=this.getChildByName('MenuTipChall');
            tip.active=false;
        }, this.ExamN);
        
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //smanager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;
   
        
        // 加载关卡数据
        cc.dm = {};
        cc.dm.levelData = require('LevelData');
        cc.dm.Mode = require('modeEnum');
        cc.dm.Dialog = require('dialogEnum');
        cc.dm.lastTime = 0;
        this.examMinScore = cc.dm.levelData.examMinScore;
        // console.log('minScore:' + this.examMinScore);
        this.examLocked = cc.dm.levelData.getExamLocked();            
        console.log('examLocked:' + this.examLocked);
        
        cc.dm.curMode = cc.dm.Mode.menu;
     },
   

    start() {

    },
    onBtnDemon() {
        this.btnAudio.play();
        
        cc.dm.curMode = cc.dm.Mode.demon;
        cc.director.loadScene('Demon');
    },
    onBtnExciseBtn() {
        this.btnAudio.play();
        cc.dm.curMode = cc.dm.Mode.exercise;
        cc.director.loadScene('Exercise');
    },
    onBtnExam() {

    
        if(this.examLocked){
            console.log('exam locked.');
            return;
        }
        this.btnAudio.play();
        cc.dm.curMode = cc.dm.Mode.exam;
        cc.director.loadScene('Exercise');
    },
    onBtnMusic(){
        this.btnAudio.play();
        if(this.isPlayingMusic){
            this.music.getComponent(cc.Sprite).spriteFrame=this.musicPause;
            this.audioSource.pause();
            this.isPlayingMusic=false;
        }
        else{
        this.music.getComponent(cc.Sprite).spriteFrame=this.musicPlay;
        this.audioSource.play();
        this.isPlayingMusic=true;
        }
    },



    // update (dt) {},
});
