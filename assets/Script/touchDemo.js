let DemonJs=require('gameDemon');
cc.Class({
    extends: cc.Component,

    properties: {
       DemonJs: DemonJs,
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {

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
                    //console.log('hit ball:' + i);

                    // 禁用ball关联的ball.js脚本
                    //ball.getComponent('ball').enabled = false;

                    var goals = this.DemonJs.goals;
                    for(let j = 0; j < goals.length; j++){
                        if(ball.getComponent(cc.Sprite).spriteFrame != 
                            goals[j].ball.getComponent(cc.Sprite).spriteFrame)
                        {
                            console.log('图片不一样');
                           

                            break;
                        }
                        else {

                        }
                    }
                    if(window.currLevel===window.LevelState.LevelOne){
                        this.DemonJs.goals.length=0;
                        this.DemonJs.balls.length=0; 
                        this.DemonJs.clearGoalNodeChildren();
                        this.DemonJs.clearBallMgrNodeChildren()

                        this.DemonJs.changeCurrLevel(window.LevelState.LevelTwo);
                        console.log(this.DemonJs.goals.length);
                        console.log(this.DemonJs.balls.length);
                    }
                }
            }
           


        }, this);
    },

    start () {

    },

    // update (dt) {},
});
