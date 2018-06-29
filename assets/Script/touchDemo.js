let DemonJs=require('gameDemon');
cc.Class({
    extends: cc.Component,

    properties: {
       DemonJs: DemonJs,
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            // mouse down
            // 获取鼠标位置的ball
            var point = new cc.Vec2(event.getLocationX(), event.getLocationY());
            // console.log('touch point:'+ point);

            for (let i = 0; i < this.DemonJs.balls.length; i++) {
                // get ball node
                var ball = this.DemonJs.balls[i];
                // console.log('ball posX:' + ball.x + ' posY:' + ball.y +
                //     ' width:' + ball.width + ' height:' + ball.height);

                var rect = new cc.Rect(ball.x, ball.y, ball.width, ball.height);
                // console.log('rect:'+ rect.origin);

                if (true == rect.contains(point)) {
                    console.log('hit ball:' + i);
                    if( window.currLevel===window.LevelState.LevelOne){
                        console.log('改变关数');
                        this.DemonJs.changeState(window.LevelState.LevelTwo);
                    }
                }
            }
           


        }, this);
    },

    start () {

    },

    // update (dt) {},
});
