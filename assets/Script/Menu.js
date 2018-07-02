
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
     },

    start () {

    },
    onBtnDemon(){
       
        cc.director.loadScene('Demon');

    },
    onBtnExciseBtn(){
       
        cc.director.loadScene('Exercise');

    },
    onBtnExam(){
       
        cc.director.loadScene('Exam');

    },



    // update (dt) {},
});
