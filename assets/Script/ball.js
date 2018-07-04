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
        speedX: 0,
        speedY: 0,

        areaH:0,
        areaW:0,
        areaX:0,
        areaY:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 以下方式获取的只是game函数？其中的属性都是undifined。？？？
        // this.gameJs = require('game');
        // this.areaH = this.gameJs.areaH;
        // this.areaW = this.gameJs.areaW;
        // this.areaX = this.gameJs.areaX;
        // this.areaY = this.gameJs.areaY;

        if(cc.dm.curMode == cc.dm.Mode.exercise || 
            cc.dm.curMode == cc.dm.Mode.exam ||
            cc.dm.curMode == cc.dm.Mode.demon ){                
            this.areaH = 400;
            this.areaW = 800;
            this.areaX = 80;
            this.areaY = 20;
            // 每个ball的速度随机
            this.xSpeed = cc.randomMinus1To1() * this.speedX;
            this.ySpeed = cc.randomMinus1To1() * this.speedY;
        } else{
            this.xSpeed = this.speedX;
            this.ySpeed = this.speedY;
        }

    },

    start() {

    },

    update(dt) {
        this.node.x += this.xSpeed * dt;
        this.node.y += this.ySpeed * dt;

        if (this.node.x >= this.areaW + this.areaX) {
            this.node.x = this.areaW + this.areaX;
            this.xSpeed *= -1;
        } else if (this.node.x <= this.areaX) {
            this.node.x = this.areaX;
            this.xSpeed *= -1;
        }

        if (this.node.y >= this.areaH + this.areaY) {
            this.node.y = this.areaH + this.areaY;
            this.ySpeed *= -1;
        } else if (this.node.y <= this.areaY) {
            this.node.y = this.areaY;
            this.ySpeed *= -1;
        }
    },

    onCollisionEnter(other, self) {

        if (0 === other.tag) {
            //console.log('on collision ball enter');
            //  ball-ball            
            this.xSpeed *= -1;
            this.ySpeed *= -1;
        } else if (1 === other.tag) {
            // wall
            // console.log('on collision wall enter');
            // this.xSpeed *= -1;
            // this.ySpeed *= -1;
        }
    },
});
