window.LevelState=cc.Enum({
    LevelNone:-1,
    LevelOne:-1,
    LevelTwo:-1,
    LevelThree:-1,

});
let DemonJs=cc.Class({
    extends: cc.Component,

    properties: {
        animStartTipN:cc.Node,
        ballPrefabs: {
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
        manager.enabledDebugDraw = true;
        // 数组保存ball引用
        this.balls = new Array();
        this.goals = new Array();

       this.animStart=this.animStartTipN.getComponent(cc.Animation);
       this.animState=this.animStart.play('AnimStart');
       window.isPlaying=this.animState.isPlaying;
      // this.clip=this.animState.clip;
      // this.time = this.animState.time;
      // this.isPlaying=this.animState.isPlaying;
     
      window.currLevel=window.LevelState.LevelNone;
      

    },

    start () {

    },
    changeCurrLevel(state){
        if(this.currLevel===state){
            return;
        }
        this.currLevel=state;
        if(this.currLevel===window.LevelState.LevelOne){
         console.log(window.isPlaying);
         if(!window.isPlaying){
             this.animStartTipN.destroy();
             this.spawnNewGoal(1);
             this.spawnNewBalls();
         }
        }

        if(this.currLevel===window.LevelState.LevelTwo){
           
                this.spawnNewGoal(1);
                this.spawnNewBalls();
                this.spawnRate=3;
        
   
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
        var newBall = cc.instantiate(this.ballPrefabs[index]);
        newBall.parent = this.node.getChildByName('ballMgr');
        this.balls.push(newBall);
        newBall.setPosition(this.getNewBallPosition());
    },

    spawnNewBalls() {       

        for (let i = 0; i <this.spawnRate-1; i++) {
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
    getNewBallPosition() {
        //400,220
        var randX = cc.random0To1() * this.areaX + 100;
        var randY = cc.random0To1() * this.areaY + 20;           
        return cc.p(randX, randY);
    },
});
module.export=DemonJs;
