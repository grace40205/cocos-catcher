
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

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
