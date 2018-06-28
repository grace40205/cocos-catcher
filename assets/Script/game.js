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
        ballPrefabs: {
            default: [],
            type: cc.Prefab,
        },
        spawnRate: 0,
        areaX:0,
        areaY:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;

        this.spawnNewBalls();
    },

    spawnNewBalls() {
        for (let i = 0; i <this.spawnRate; i++) {
            //let index = Math.floor(cc.random0To1() * this.ballPrefabs.length);
            var newBall = cc.instantiate(this.ballPrefabs[i]);

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
