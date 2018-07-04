let DemonJs=require('gameDemon');
window.touchNum=0;
cc.Class({
    extends: cc.Component,

    properties: {
       DemonJs: DemonJs,
       ballFalse:cc.SpriteFrame,
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var tipNews=this.DemonJs.tipNews;
        
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            var point = new cc.Vec2(event.getLocationX(), event.getLocationY());
            var goals = this.DemonJs.goals;
            
            // console.log('touch point:'+ point);
            var trueBall=false;

            for (let i = 0; i < this.DemonJs.balls.length; i++) {
                // get ball node
                var ball = this.DemonJs.balls[i];
                // console.log('ball posX:' + ball.x + ' posY:' + ball.y +
                //     ' width:' + ball.width + ' height:' + ball.height);

                var rect = new cc.Rect(ball.x - ball.width / 2, ball.y - ball.height / 2, 
                    ball.width, ball.height);
                // console.log('rect:'+ rect.origin);

                if (true == rect.contains(point)) {
                    //console.log('hit ball:' + i);

                    // 禁用ball关联的ball.js脚本
                    //ball.getComponent('ball').enabled = false;

                    //var goals = this.DemonJs.goals;

                    //window.touchNum+=1;
                    //console.log('点击次数='+window.touchNum);
                    for(let j = 0; j < goals.length; j++){
                        
                        if(ball.getComponent(cc.Sprite).spriteFrame ===
                             goals[j].ball.getComponent(cc.Sprite).spriteFrame)
                         { 
                            window.touchNum+=1;
                            this.DemonJs.balls[i].getComponent(cc.Sprite).spriteFrame=null;
                            trueBall=true;
                            this.DemonJs.goals[j].ball.getComponent(cc.Sprite).spriteFrame=null;
                            console.log('点击次数='+window.touchNum);
                            tipNews.string='点击正确';
             
                            console.log('图片一样'+j);
                            break;
                         }
                        
                    }
                   if(!trueBall){
                         this.DemonJs.balls[i].getComponent(cc.Sprite).spriteFrame=this.ballFalse;
                         console.log('图片不一样');
                         tipNews.string='点击错误';

                         window.touchNum+=1;
                        
                         console.log('点击次数='+window.touchNum);
        
                    }
                    if(window.touchNum===goals.length){
                        window.touchNum=0;


                        
                        this.DemonJs.scheduleOnce(function() {
                            console.log("延时");
                            if(window.currLevel===window.LevelState.LevelOne){
                               
                                this.changeCurrLevel(window.LevelState.LevelTwo);
                                console.log(this.goals.length);
                                console.log(this.balls.length);
                            }
                            else if(window.currLevel===window.LevelState.LevelTwo){
                               
                                this.changeCurrLevel(window.LevelState.LevelThree);
                                console.log(this.goals.length);
                                console.log(this.balls.length);
                                
                            }
                            else if(window.currLevel===window.LevelState.LevelThree){
                                this.changeCurrLevel(window.LevelState.LevelFour);
                                console.log(this.goals.length);
                                console.log(this.balls.length);
                                
                            }
                            else if(window.currLevel===window.LevelState.LevelFour){
                                
                                this.changeCurrLevel(window.LevelState.LevelFive);
                                console.log(this.goals.length);
                                console.log(this.balls.length);
                                
                            }
                            
                         }, 1);

                       
                        
        
                    }
                    
                }
                
                
                
            }
        }, this);
    },

    start () {

    },

    // update (dt) {},
});
