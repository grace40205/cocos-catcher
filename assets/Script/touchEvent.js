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
        rtPrefab: {
            default: null,
            type: cc.Prefab,
        },
        wngPrefab: {
            default: null,
            type: cc.Prefab,
        },
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

                var rect = new cc.Rect(ball.x - ball.width / 2, ball.y - ball.height / 2,
                    ball.width, ball.height);
                // console.log('rect:'+ rect.origin);

                if (true == rect.contains(point)) {
                    //console.log('hit ball:' + i);                    

                    var correctHit = false;
                    var goals = this.gameJs.goals;
                    for (let j = 0; j < goals.length; j++) {
                        if (ball.getComponent(cc.Sprite).spriteFrame ===
                            goals[j].ball.getComponent(cc.Sprite).spriteFrame
                            && !goals[j].hited) {
                            console.log('hit the goal!' + ' in goals[' + j + ']');

                            // 顶部：找到的goal显示特效（小圈圈）
                            // ...
                            // goals[j].ball.height = 20;
                            // goals[j].ball.width = 20;
                            let hited = cc.instantiate(this.rtPrefab);
                            goals[j].ball.addChild(hited);

                            goals[j].hited = true;
                            correctHit = true;
                            // 触摸的ball显示特效（小圈圈）
                            // ...
                            // ball.height = 20;
                            // ball.width = 20;

                            this.gameJs.hited++;
                            break;
                        }
                    }
                    // 点击错误
                    if(!correctHit){
                        console.log('hit the wrong ball');

                        let wng = cc.instantiate(this.wngPrefab);
                        ball.addChild(wng);

                        this.gameJs.scheduleOnce(function(){
                            console.log('test schedule...');
                            this.newGame();
                        },2);

                        break;
                    }
                    // 目标ball全部找到,过小关
                    if (this.gameJs.hited == goals.length) {
                        this.gameJs.updateCounters();
                    }
                    break;
                }
            }


        }, this);
    },

    start() {

    },

    // update (dt) {},
});
