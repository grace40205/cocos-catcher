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
        xSpeed:0,
        ySpeed:0,
        areaX:0,
        areaY:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    update (dt) {
        this.node.x += this.xSpeed * dt;
        this.node.y += this.ySpeed * dt;

        if(this.node.x >= this.areaX || this.node.x <= 0 ){
            this.xSpeed *= -1;            
        }

        if(this.node.y >= this.areaY || this.node.y <= 0 ){
            this.ySpeed *= -1;            
        }
    },

    onCollisionEnter(other,self){
        console.log('on collision enter');
        
        if(0 === other.tag){
            //  ball-ball            
            this.xSpeed *= -1;
            this.ySpeed *= -1;            
        } else if(1 === other.tag){
            // wall
            
        }
    },
});
