// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let gameJs = require('game');

cc.Class({
    extends: cc.Component,

    properties: {
        gameJs: gameJs,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            // mouse down
            // 获取鼠标位置的ball
            var point = new cc.Vec2(event.getLocationX(), event.getLocationY());
            // console.log('touch point:'+ point);

            for (let i = 0; i < this.gameJs.balls.length; i++) {
                // get ball node
                var ball = this.gameJs.balls[i];
                // console.log('ball posX:' + ball.x + ' posY:' + ball.y +
                //     ' width:' + ball.width + ' height:' + ball.height);

                var rect = new cc.Rect(ball.x, ball.y, ball.width, ball.height);
                // console.log('rect:'+ rect.origin);

                if (true == rect.contains(point)) {
                    console.log('hit ball:' + i);
                }
            }

        }, this);
    },

    start() {

    },

    // update (dt) {},
});
