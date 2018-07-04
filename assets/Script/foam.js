

cc.Class({
    extends: cc.Component,

    properties: {
        speedX: 0,
        speedY: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.left = 98;
        this.right = 420;
        this.top = 260;
        this.bottom = -260;

        // 每个ball的速度随机
        // this.xSpeed = cc.randomMinus1To1() * this.speedX;
        // this.ySpeed = cc.randomMinus1To1() * this.speedY;
    },

    start() {

    },

    update(dt) {
        this.node.x += this.xSpeed * dt;
        this.node.y += this.ySpeed * dt;

        if (this.node.x <= this.left || this.node.x >= this.right) {
            this.xSpeed *= -this.xSpeed;
        } 
        if (this.node.y <= this.bottom || this.node.y >= this.top) {
            this.ySpeed *= -this.ySpeed;
        } 
    },

    // onCollisionEnter(other, self) {

    //     if (0 === other.tag) {
    //         //console.log('on collision ball enter');
    //         //  ball-ball            
    //         this.xSpeed *= -1;
    //         this.ySpeed *= -1;
    //     } else if (1 === other.tag) {
    //         // wall
    //         // console.log('on collision wall enter');
    //         // this.xSpeed *= -1;
    //         // this.ySpeed *= -1;
    //     }
    // },
});
