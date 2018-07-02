window.LevelState=cc.Enum({
    LevelNone:-1,
    LevelOne:-1,
    LevelTwo:-1,
    LevelThree:-1,
    LevelFour:-1,
    LevelFive:-1,

});
let gameJs=require('game');
let DemonJs=cc.Class({
    extends: cc.Component,

    properties: {
        animStartTipN:cc.Node,
        ballPrefabs: {
            default: [],
            type: cc.Prefab,
        },
        labelTip: {
            default: [],
            type: cc.Prefab,
        },
        spawnRate: 0,
        areaX:0,
        areaY:0,

        goalX:0,
        goalY:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
        // 数组保存ball引用
        this.balls = new Array();
        this.goals = new Array();
        this.ballPostion=0;
        this.goalsNum=1;

       this.animStart=this.animStartTipN.getComponent(cc.Animation);
       this.animState=this.animStart.play('AnimStart');
       window.isPlaying=this.animState.isPlaying;
     
      window.currLevel=window.LevelState.LevelNone;
      

    },

    start () {

    },
    changeCurrLevel(state){
        var position = new cc.p(this.goalX, this.goalY);
        var goalNode = this.node.getChildByName('goal');
        if(window.currLevel===state){
            return;
        }
        else {
            window.currLevel=state;
            this.goals.length=0;
            this.balls.length=0; 
            this.clearGoalNodeChildren();
            this.clearBallMgrNodeChildren();
            

        }
        //window.currLevel=state;
        if(window.currLevel===window.LevelState.LevelOne){
         console.log(window.isPlaying);
         console.log('当前关卡-----'+window.currLevel);
         console.log('当前目标球数-------'+this.goalsNum);
         console.log('当前球数-------'+this.spawnRate);
         if(!window.isPlaying){
             this.animStartTipN.destroy();
             var tip0 = cc.instantiate(this.labelTip[0]);
             goalNode.addChild(tip0);
             tip0.setPosition(position.x , position.y-240);
             this.spawnNewGoal(this.goalsNum);
             this.spawnNewBalls();
         }
        }
        else if(window.currLevel===window.LevelState.LevelTwo){
            this.spawnRate=4;
            console.log('当前关卡-----'+window.currLevel);
            console.log('当前目标球数-------'+this.goalsNum);
            console.log('当前球数-------'+this.spawnRate);
            var tip1 = cc.instantiate(this.labelTip[1]);
            goalNode.addChild(tip1);
            tip1.setPosition(position.x , position.y-100);                  
                this.spawnNewGoal(1);
                this.spawnNewBalls();
               
        }
        else if(window.currLevel===window.LevelState.LevelThree){
            this.goalsNum=2;
            this.spawnRate=4;
            console.log('当前关卡-----'+window.currLevel);
            console.log('当前目标球数-------'+this.goalsNum);
            console.log('当前球数-------'+this.spawnRate);


            var tip2 = cc.instantiate(this.labelTip[2]);
            goalNode.addChild(tip2);
            tip2.setPosition(position.x , position.y-100);
            this.spawnNewGoal(this.goalsNum);
            this.spawnNewBalls();
            
       }
       else  if(window.currLevel===window.LevelState.LevelFour){
         this.goalsNum=3;
         this.spawnRate=5;
         console.log('当前关卡-----'+window.currLevel);
         console.log('当前目标球数-------'+this.goalsNum);
         console.log('当前球数-------'+this.spawnRate);
         var tip3 = cc.instantiate(this.labelTip[3]);
         goalNode.addChild(tip3);
         tip3.setPosition(position.x , position.y-100);
       
         this.spawnNewGoal(this.goalsNum);
         this.spawnNewBalls();
       }
       else if(window.currLevel===window.LevelState.LevelFive){

       }

   

    },

    
  

     update (dt) {
         if(window.currLevel===window.LevelState.LevelNone){
            window.isPlaying=this.animState.isPlaying;
            if(!window.isPlaying){
            this.changeCurrLevel(window.LevelState.LevelOne);
            }

         }
        
        
     },

spawnNewGoal(num){
        var goalNode = this.node.getChildByName('goal');
        // var position = new cc.p(goalNode.x, goalNode.y);
        var position = new cc.p(this.goalX, this.goalY);
        // console.log('goal pos:' + position.x + " " + position.y);

        for(let i = 0; i < num; i++){
            let index = Math.floor(cc.random0To1() * this.ballPrefabs.length);
            var ball = cc.instantiate(this.ballPrefabs[index]);
            
            var goal = {
                id:index,
                ball:ball,
            };
            this.goals.push(goal);
            
            goalNode.addChild(ball);
            //禁用关联的ball.js脚本
            ball.getComponent('ball').enabled = false;
            ball.setPosition(position.x + ball.width * i, position.y);
            
            this.spawnNewBall(index);
        }
    },

 spawnNewBall(index){
        this.ballPostion+=1;

        var newBall = cc.instantiate(this.ballPrefabs[index]);
        newBall.parent = this.node.getChildByName('ballMgr');
        this.balls.push(newBall);
        if(this.ballPostion===1){
            var pos=cc.p(200,300);
        }
        if(this.ballPostion===2){
             pos=cc.p(600,160);
        }
        if(this.ballPostion===3){
            pos=cc.p(300,260);
        }
        if(this.ballPostion===4)
        {
            pos=cc.p(600,300);
        }
        if(this.ballPostion===5)
        {
            pos=cc.p(500,200);
        }
        
        //newBall.setPosition(this.getNewBallPosition());
        newBall.setPosition(pos);
    },

    spawnNewBalls() {       

        for (let i = 0; i <(this.spawnRate-this.goalsNum); i++) {
            let index = this.getAvailablePrefabIndex();
            // let index = Math.floor(cc.random0To1() * this.ballPrefabs.length);

            this.spawnNewBall(index);
        }
    },
    
    
    getAvailablePrefabIndex(){
        while(true){
            let index = Math.floor(cc.random0To1() * this.ballPrefabs.length);
            for(let j = 0; j < this.goals.length; j++){
                if(index != this.goals[j].id)
                {
                    return index;
                }
            }
        }
    },
    // getNewBallPosition() {    
    //      var randX = cc.random0To1() * this.areaX + 100;
    //      var randY = cc.random0To1() * this.areaY + 20;     
    //             return cc.p(randX, randY);      
    // },
    clearGoalNodeChildren() {
        this.node.getChildByName('goal').destroyAllChildren();
    },
    clearBallMgrNodeChildren() {
        this.node.getChildByName('ballMgr').destroyAllChildren();
        this.ballPostion=0;
        //this.ballPostion.length=0;
    },

    //返回菜单按钮
    onBtnReturnMenu(){
       
        cc.director.loadScene('Menu');

    },
});
module.export=DemonJs;
