let gameJs = cc.Class({
    extends: cc.Component,

    properties: {
        examBg:{
            default:null,
            type:cc.SpriteFrame,
        },
        ballPrefabs: {
            default: [],
            type: cc.Prefab,
        },
        catPrefabs: {
            default: [],
            type: cc.Prefab,
        },
        rectPrefabs: {
            default: [],
            type: cc.Prefab,
        },
        dialogPrefabs: {
            default: [],
            type: cc.Prefab,
        },
        timeLbl: {
            default: null,
            type: cc.Label,
        },
        // limitTimeLbl: {
        //     default: null,
        //     type: cc.Label,
        // },
        scoreLbl: {
            default: null,
            type: cc.Label,
        },
        progressBar: {
            default: null,
            type: cc.ProgressBar,
        },
        // ball活动范围
        areaX: 0, // 原点x坐标
        areaY: 0, // 原点y坐标
        areaW: 0, // 宽
        areaH: 0, // 高
        // 目标位置
        goalX: 0,
        goalY: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // var manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;

        // 初始化属性
        this.lastTime = 0; // 测试模式：上次通关总时间
        this.time = 0; // 显示总时间
        // this.limitTime = 0; // 显示当前关卡倒计时
        this.timer = 0; // 一秒钟计时器
        this.score = 0;
        this.levelScore = 0;
        // 已找到数
        this.hited = 0;
        // 大关干扰数
        this.ballNum = 1;
        // 大关目标数
        this.goalNum = 1;
        this.repeat = 1;
        this.curPrefabs = this.catPrefabs;

        // 涉及的对话框
        this.successDialog = null;
        this.gameOverDialog = null;
        this.unlockDialog = null;
        this.doneDialog = null;


        // 数组保存ball引用
        this.indexSet = new Set();
        this.balls = new Array();
        this.goals = new Array();
        // ball初始位置（格子）
        this.pos = new Array();

        this.levelLength = cc.dm.levelData.getLevelSize();
        this.levelProgress = 0;

        //this.levelId = cc.dm.currLevel;
        this.levelId = 1001;
        this.lastTime = cc.dm.lastTime;

        this.changeLevel();
    },

    loadLevelData(id) {
        var level = cc.dm.levelData.getLevelById(id);

        // 干扰、目标数计数器，
        // 逐渐接近ballNum,goalNum,
        // 直至通关->->changeLevel
        this.ballNumCounter = this.ballNum;
        this.goalNumCounter = this.goalNum;
        this.repeatCounter = 0;

        // if (cc.dm.curMode == cc.dm.Mode.exam) {
        //     this.limitTime = level.limitTime;
        // }

        this.levelScore = level.levelScore;
        this.ballNum = level.ballNum;
        this.goalNum = level.goalNum;
        this.repeat = level.repeat;
        this.ballSpeed = level.ballSpeed;
    },
    start() {
        if (cc.dm.curMode == cc.dm.Mode.exercise) {
            console.log('timeLbl.enabled = false');
            this.timeLbl.enabled = false;            
        }

        if (cc.dm.curMode == cc.dm.Mode.exam) {
            console.log('scoreLbl.enbaled = false');
            this.scoreLbl.enabled = false;

            this.node.getChildByName('background').getComponent(cc.Sprite).spriteFrame = this.examBg;
        }
    },

    changeLevel() {
        console.log('加载关卡:' + this.levelId);

        // 更新进度条
        this.levelProgress++;

        // 通关
        // 测试模式：显示通关统计
        // 练习模式：
        if (this.levelProgress > 1){//this.levelLength) {
            console.log('通关！！！');
            this.showDialog(cc.dm.Dialog.done);
            return;
        }


        this.updateProgressBar();

        this.loadLevelData(this.levelId);
        this.levelId += 1;


        // 改变图片组
        if(cc.dm.curMode == cc.dm.Mode.exercise){
            if (this.curPrefabs === this.ballPrefabs)
                this.curPrefabs = this.catPrefabs;
            else {
                this.curPrefabs = this.ballPrefabs;
            }
        } else if(cc.dm.curMode == cc.dm.Mode.exam){
            this.curPrefabs = this.rectPrefabs;
        }

        this.newGame();
    },

    showDialog(type) {

        // 方便停止计时器的update
        cc.dm.curMode = cc.dm.Mode.menu;

        this.clearBallMgrNodeChildren();
        this.clearGoalNodeChildren();

        switch (type) {
            case cc.dm.Dialog.gameOver: {
                if (this.gameOverDialog == null) {
                    var dialog = cc.instantiate(this.dialogPrefabs[type]);
                    dialog.getComponent('dialog').gameJs = this;
                    dialog.getComponent('dialog').type = type;

                    this.node.getChildByName('UI').addChild(dialog);
                    this.gameOverDialog = dialog;
                    this.gameOverDialog.active = false;
                }
                this.gameOverDialog.active = true;
                break;
            }
            case cc.dm.Dialog.success: {
                if (this.successDialog == null) {
                    var dialog = cc.instantiate(this.dialogPrefabs[type]);
                    dialog.getComponent('dialog').gameJs = this;
                    dialog.getComponent('dialog').type = type;

                    this.node.getChildByName('UI').addChild(dialog);
                    this.successDialog = dialog;
                    this.successDialog.active = false;
                }
                this.successDialog.active = true;
                break;
            }
            case cc.dm.Dialog.done: {
                if (this.doneDialog == null) {
                    var dialog = cc.instantiate(this.dialogPrefabs[type]);
                    dialog.getComponent('dialog').gameJs = this;
                    dialog.getComponent('dialog').type = type;

                    let minute = Math.floor(this.time / 60);
                    let second = this.time - minute * 60;
                    if (minute < 10)
                        minute = '0' + minute;
                    if (second < 10)
                        second = '0' + second;

                    dialog.getChildByName('time').getComponent(cc.Label).string
                        = 'Time:' + minute + ':' + second;
                   
                    let upgrade = '';
                    if(this.time > this.lastTime){
                        dialog.color = cc.Color.RED;
                        upgrade += '+';
                    } else {
                        dialog.color = cc.Color.GREEN;
                        upgrade += '-';
                    }
                    upgrade += this.time - this.lastTime;
                    dialog.getChildByName('upgrade').getComponent(cc.Label).string = upgrade + 's';
                    cc.dm.lastTime = this.time;

                    this.node.getChildByName('UI').addChild(dialog);
                    this.doneDialog = dialog;
                    this.doneDialog.active = false;
                }
                this.doneDialog.active = true;
                break;
            }
            case cc.dm.Dialog.unlock: {
                if (this.unlockDialog == null) {
                    var dialog = cc.instantiate(this.dialogPrefabs[type]);
                    dialog.getComponent('dialog').gameJs = this;
                    dialog.getComponent('dialog').type = type;

                    this.node.getChildByName('UI').addChild(dialog);
                    this.unlockDialog = dialog;
                    this.unlockDialog.active = false;
                }
                this.unlockDialog.active = true;
                break;
            }
            default:
        }
    },

    hideDialog(type) {
        console.log('hide Dialog:' + type);

        switch (type) {
            case cc.dm.Dialog.gameOver: {
                if (this.gameOverDialog == null) {
                    return;
                }
                this.gameOverDialog.active = false;
                break;
            }
            case cc.dm.Dialog.success: {
                if (this.successDialog == null) {
                    return;
                }
                this.successDialog.active = false;
                break;
            }
            case cc.dm.Dialog.done: {
                if (this.doneDialog == null) {
                    return;
                }
                this.doneDialog.active = false;
                break;
            }
            case cc.dm.Dialog.unlock: {
                if (this.unlockDialog == null) {
                    return;
                }
                this.unlockDialog.active = false;
                break;
            }
            default:
        }
    },

    initPosArray(w, h) {
        this.pos.length = 0;
        this.pos = new Array(w);
        for (let i = 0; i < this.pos.length; i++) {
            this.pos[i] = new Array(h);
            for (let j = 0; j < this.pos[i].length; j++) {
                this.pos[i][j] = false;
            }
        }
    },
    updateScore(score) {
        this.score += score;
        this.scoreLbl.string = 'Score:' + this.score;
    },

    newGame() {

        console.log('new game starts...');
        let w = Math.ceil(this.areaW / (this.curPrefabs[0].data.width + 5));
        let h = Math.ceil(this.areaH / (this.curPrefabs[0].data.height + 5));

        this.hited = 0;
        // 清空数组
        this.initPosArray(w, h);
        this.indexSet.clear();
        this.balls.length = 0;
        this.goals.length = 0;
        // node:'goal'清空
        this.clearGoalNodeChildren();
        this.clearBallMgrNodeChildren();
        this.spawnNewGoals(this.goalNumCounter);
        this.spawnNewBalls(this.ballNumCounter);
    },

    updateProgressBar() {
        this.progressBar.progress = this.levelProgress / this.levelLength;
        console.log('progress:' + this.progressBar.progress);
    },

    updateCounters() {
        if (this.ballNumCounter == this.ballNum &&
            this.goalNumCounter == this.goalNum &&
            this.repeatCounter == this.repeat) {
            console.log('过关');
            console.log('##############');

            if (cc.dm.curMode == cc.dm.Mode.exercise) {
                // 练习模式积累分数，达到一定分数后解锁测试模式        
                this.updateScore(this.levelScore);
                if (cc.dm.levelData.getExamLocked() && this.score >= cc.dm.levelData.examMinScore) {
                    cc.dm.levelData.setExamLocked(false);

                    // 跳出“解锁测试模式”提示框(继续游戏/进入测试模式)
                    this.showDialog(cc.dm.Dialog.unlock);
                    // console.log('score:' + this.score +' examLocked:' + cc.dm.levelData.getExamLocked());
                    return;
                }

                // 干扰、目标、重复次数都达到最大时，弹出选择框(继续游戏/返回主菜单)
                this.showDialog(cc.dm.Dialog.success);
            } else if (cc.dm.curMode == cc.dm.Mode.exam) {
                // 测试模式直接进入下一关
                this.changeLevel();
            }
        } else if (this.ballNumCounter == this.ballNum &&
            this.goalNumCounter == this.goalNum) {
            console.log('ballNumCounter:(' + this.ballNumCounter + '/' + this.ballNum + ')');
            console.log('goalNumCounter:(' + this.goalNumCounter + '/' + this.goalNum + ')');
            console.log('repeatCounter:(' + this.repeatCounter + '/' + this.repeat + ')');
            console.log('##############');

            // 目标数目达到最大时，重复repeat次后过关
            this.repeatCounter++;
            if (this.repeatCounter == this.repeat) {
                this.updateCounters();
                return;
            }
            this.newGame();

        } else if (this.ballNumCounter == this.ballNum) {
            console.log('ballNumCounter:(' + this.ballNumCounter + '/' + this.ballNum + ')');
            console.log('goalNumCounter:(' + this.goalNumCounter + '/' + this.goalNum + ')');
            console.log('repeatCounter:(' + this.repeatCounter + '/' + this.repeat + ')');
            console.log('##############');

            // 干扰数目达到最大时，重复repeat次后增加目标数目
            this.repeatCounter++;
            if (this.repeatCounter == this.repeat) {
                this.repeatCounter = 0;
                this.goalNumCounter++;
            }
            this.newGame();

        } else {
            console.log('ballNumCounter:(' + this.ballNumCounter + '/' + this.ballNum + ')');
            console.log('##############');

            // 干扰数增加
            this.ballNumCounter++;
            if (this.ballNumCounter == this.ballNum) {
                this.repeatCounter = 0;
                this.updateCounters();
                return;
            }
            this.newGame();
        }
    },
    clearGoalNodeChildren() {
        this.node.getChildByName('goal').destroyAllChildren();
    },
    clearBallMgrNodeChildren() {
        this.node.getChildByName('ballMgr').destroyAllChildren();
    },

    spawnNewGoals(num) {
        var goalNode = this.node.getChildByName('goal');
        // var position = new cc.p(goalNode.x, goalNode.y);
        var position = new cc.p(this.goalX, this.goalY);
        // console.log('goal pos:' + position.x + " " + position.y);

        for (let i = 0; i < num; i++) {
            let index = Math.floor(cc.random0To1() * this.curPrefabs.length);
            var ball = cc.instantiate(this.curPrefabs[index]);

            var goal = {
                id: index,
                ball: ball,
                hited: false,
            };
            this.goals.push(goal);
            // 保存goal的index，便于后面获取可用的干扰项index
            if (!this.indexSet.has(index)) {
                this.indexSet.add(index);
            }

            goalNode.addChild(ball);
            //禁用关联的ball.js脚本
            ball.getComponent('ball').enabled = false;
            ball.setPosition(position.x + (ball.width + 5) * i, position.y);

            this.spawnNewBallByIndex(index);
        }
    },
    spawnNewBall() {
        let index = this.getAvailablePrefabIndex();
        var newBall = cc.instantiate(this.curPrefabs[index]);
        newBall.parent = this.node.getChildByName('ballMgr');
        this.balls.push(newBall);
        newBall.setPosition(this.getNewBallPosition());
    },
    spawnNewBallByIndex(index) {
        var newBall = cc.instantiate(this.curPrefabs[index]);
        newBall.parent = this.node.getChildByName('ballMgr');
        this.balls.push(newBall);
        newBall.setPosition(this.getNewBallPosition());
    },

    spawnNewBalls(num) {
        for (let i = 0; i < num; i++) {
            this.spawnNewBall();
        }
    },

    getAvailablePrefabIndex() {
        let index = -1;
        // 获取可用的干扰项index
        if (this.curPrefabs.length <= this.goals.length) {
            console.log('可选干扰项太少了');
            return 0;
        }
        while (true) {
            index = Math.floor(cc.random0To1() * this.curPrefabs.length);
            if (!this.indexSet.has(index)) {
                return index;
            }
        }

        // while (true) {
        //     let finding = true;
        //     index = Math.floor(cc.random0To1() * this.curPrefabs.length);
        //     find: for (let j = 0; j < this.goals.length; j++) {
        //         if (index == this.goals[j].id) {
        //             finding = false;
        //             break find;
        //         }
        //     }
        //     if (finding) {
        //         return index;
        //     }
        // }
    },
    getNewBallPosition() {
        // 格子
        let cellWidth = this.curPrefabs[0].data.width + 5;
        let cellHeight = this.curPrefabs[0].data.height + 5;

        let w = this.pos.length;
        let h = this.pos[0].length;

        var randW = -1;
        var randH = -1;
        while (true) {
            randW = Math.floor(cc.random0To1() * w);
            randH = Math.floor(cc.random0To1() * h);

            if (this.pos[randW][randH] != true) {
                this.pos[randW][randH] = true;
                break;
            }
        }

        var randX = cellWidth * randW + this.areaX;
        var randY = cellHeight * randH + this.areaY;
        return cc.p(randX, randY);
    },
    update(dt) {
        if (cc.dm.curMode == cc.dm.Mode.exam) {
            this.timer += dt;
            if (this.timer >= 1) {
                this.timer = 0;
                this.time++; // second
                this.limitTime--;

                let minute = Math.floor(this.time / 60);
                let second = this.time - minute * 60;
                if (minute < 10)
                    minute = '0' + minute;
                if (second < 10)
                    second = '0' + second;
                this.timeLbl.string = 'Time:' + minute + ':' + second;

                // if (this.limitTime <= 0) {
                //     this.gameOver();
                // } else {
                //     this.limitTimeLbl.string = 'Limit Time:' + this.limitTime;
                // }
            }
        }
    },
    gameOver() {
        this.showDialog(cc.dm.Dialog.gameOver);
    },
});
module.export = gameJs;