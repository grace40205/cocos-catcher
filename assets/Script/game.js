window.levelDatas=require('LevelData');
window.level
let gameJs=cc.Class({
    extends: cc.Component,

    properties: {
        ballPrefabs: {
            default: [],
            type: cc.Prefab,
        },
        spawnRate: 0,
        areaX:0,
        areaY:0,
        //levelId:0,//记录关卡
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;
         window.currLevel=this.levelId;
         window.Score=0;
         this.balls=new Array();

        this.spawnNewBalls();
    },
    changeLevel(){
            let level=1000+this.levelId;
            let levelData=window.levelDatas.getLevelById(level);
            this.spawnRate=levelData.ballNum;

        
    },

    spawnNewBalls() {
        for (let i = 0; i <this.spawnRate; i++) {
            //let index = Math.floor(cc.random0To1() * this.ballPrefabs.length);
            var newBall = cc.instantiate(this.ballPrefabs[i]);
            this.balls.push(newBall);

            newBall.parent = this.node.getChildByName('ballMgr');
            newBall.setPosition(this.getNewBallPosition());
        }
    },

    start() {

    },

    getNewBallPosition() {
        //400,220
        var randX = cc.random0To1() * this.areaX;
        var randY = cc.random0To1() * this.areaY;           
        return cc.p(randX, randY);
    },
    // update (dt) {},
});
module.export=gameJs;