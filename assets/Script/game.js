let gameJs = cc.Class({
    extends: cc.Component,

    properties: {
        ballPrefabs: {
            default: [],
            type: cc.Prefab,
        },
        catPrefabs: {
            default: [],
            type: cc.Prefab,
        },
        dialogPrefab:{
            default:null,
            type:cc.Prefab,
        },
        timeLbl: {
            default: null,
            type: cc.Label,
        },
        limitTimeLbl: {
            default: null,
            type: cc.Label,
        },
        scoreLbl: {
            default: null,
            type: cc.Label,
        },
        progressBar:{
            default:null,
            type:cc.ProgressBar,
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
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;

        // 初始化属性
        this.time = 0; // 显示总时间
        this.limitTime = 0; // 显示当前关卡倒计时
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
        this.dialog = null;

        // 数组保存ball引用
        this.indexSet = new Set();
        this.balls = new Array();
        this.goals = new Array();
        // ball初始位置（格子）
        this.pos = new Array();


        // 加载关卡数据
        cc.dm = {};
        cc.dm.levelData = require('LevelData');
        
        this.levelLength = cc.dm.levelData.getLevelSize();
        this.levelProgress = 0;

        //this.levelId = cc.dm.currLevel;
        this.levelId = 1001;
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

        this.limitTime = level.limitTime;
        this.levelScore = level.levelScore;
        this.ballNum = level.ballNum;
        this.goalNum = level.goalNum;
        this.repeat = level.repeat;
        this.ballSpeed = level.ballSpeed;
    },

    changeLevel() {
        console.log('加载关卡:' + this.levelId);
        this.levelProgress ++;

        this.updateProgressBar();
        this.updateScore(this.levelScore);

        this.loadLevelData(this.levelId);
        this.levelId += 1;

        // 改变图片组
        if (this.curPrefabs === this.ballPrefabs)
            this.curPrefabs = this.catPrefabs;
        else {
            this.curPrefabs = this.ballPrefabs;
        }

        this.newGame();
    },

    showDialog(){
        if(this.dialog == null){
            var dialog = cc.instantiate(this.dialogPrefab);
            dialog.getComponent('dialog').gameJs = this;

            this.node.addChild(dialog);
            this.dialog = dialog;
            this.dialog.active = false;
        }

        this.dialog.active = true;
    },

    hideDialog(){
        if(this.dialog == null)
            return;
        this.dialog.active = false;
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

    updateProgressBar(){
        this.progressBar.progress = this.levelProgress / this.levelLength;
        console.log('progress:' + this.progressBar.progress);
    },

    updateCounters() {
        if (this.ballNumCounter == this.ballNum &&
            this.goalNumCounter == this.goalNum &&
            this.repeatCounter == this.repeat) {
            console.log('通关');
            console.log('##############');

            // 干扰、目标、重复次数都达到最大时，开始下一关
            // this.changeLevel();
            this.showDialog();

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

    start() {

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

            if (this.limitTime <= 0) {
                this.gameOver();
            } else {
                this.limitTimeLbl.string = 'Limit Time:' + this.limitTime;
            }
        }
    },
    gameOver() {
        this.node.getChildByName('gameOver').active = true;
    },
});
module.export = gameJs;