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
        timeLbl: {
            default: null,
            type: cc.Label,
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
        this.time = 0; // 显示的时间
        this.timer = 0; // 一秒钟计时器
        this.score = 0;
        // 已找到数
        this.hited = 0;
        // 大关干扰数
        this.ballNum = 1;
        // 大关目标数
        this.goalNum = 1;
        this.curPrefabs = this.ballPrefabs;

        // 数组保存ball引用
        this.indexSet = new Set();
        this.balls = new Array();
        this.goals = new Array();


        // 加载关卡数据
        cc.dm = {};
        cc.dm.levelData = require('LevelData');

        //this.levelId = cc.dm.currLevel;
        this.levelId = 1001;
        this.loadLevelData(this.levelId);

        // 清空数组
        this.indexSet.clear();
        this.balls.length = 0;
        this.goals.length = 0;
        // node:'goal'清空
        this.clearGoalNodeChildren();
        this.clearBallMgrNodeChildren();
        this.spawnNewGoals(this.goalNumCounter);
        this.spawnNewBalls(this.ballNumCounter);
    },

    loadLevelData(id) {
        var level = cc.dm.levelData.getLevelById(id);

        // 干扰、目标数计数器，
        // 逐渐接近ballNum,goalNum,
        // 直至通关->->changeLevel
        this.ballNumCounter = this.ballNum;
        this.goalNumCounter = this.goalNum;
        this.repeatCounter = 0;

        this.levelScore = level.levelScore;
        this.ballNum = level.ballNum;
        this.goalNum = level.goalNum;
        this.repeat = level.repeat;
        this.ballSpeed = level.ballSpeed;
    },

    changeLevel() {
        console.log('加载新关卡');        

        this.levelId += 1;
        this.loadLevelData(this.levelId);

        this.newGame();
    },

    newGame() {

        // 改变图片组
        if (this.curPrefabs === this.ballPrefabs)
            this.curPrefabs = this.catPrefabs;
        else {
            this.curPrefabs = this.ballPrefabs;
        }

        this.hited = 0;
        // 清空数组
        this.indexSet.clear();
        this.balls.length = 0;
        this.goals.length = 0;
        // node:'goal'清空
        this.clearGoalNodeChildren();
        this.clearBallMgrNodeChildren();
        this.spawnNewGoals(this.goalNumCounter);
        this.spawnNewBalls(this.ballNumCounter);
    },

    updateCounters() {
        if (this.ballNumCounter == this.ballNum &&
            this.goalNumCounter == this.goalNum &&
            this.repeatCounter == this.repeat) {
            // 干扰、目标、重复次数都达到最大时，开始下一关
            this.changeLevel();

            console.log('通关');
            console.log('##############');
        } else if (this.goalNumCounter == this.goalNum) {
            // 目标数目达到最大时，重复repeat次后过关
            this.repeatCounter++;
            if (this.repeatCounter >= this.repeat) {
                this.repeatCounter = this.repeat;
            }
            this.newGame();

            console.log('ballNumCounter:(' + this.ballNumCounter + '/' + this.ballNum + ')');
            console.log('goalNumCounter:(' + this.goalNumCounter + '/' + this.goalNum + ')');
            console.log('repeatCounter:(' + this.repeatCounter + '/' + this.ballNum + ')');
            console.log('##############');
        } else if (this.ballNumCounter == this.ballNum) {
            // 干扰数目达到最大时，重复repeat次后增加目标数目
            this.repeatCounter++;
            if (this.repeatCounter >= this.repeat) {
                this.repeatCounter = 0;
                this.goalNumCounter++;
                if (this.goalNumCounter >= this.goalNum) {
                    this.goalNumCounter = this.goalNum;
                }
            }
            this.newGame();

            console.log('ballNumCounter:(' + this.ballNumCounter + '/' + this.ballNum + ')');
            console.log('goalNumCounter:(' + this.goalNumCounter + '/' + this.goalNum + ')');
            console.log('repeatCounter:(' + this.repeatCounter + '/' + this.ballNum + ')');
            console.log('##############');
        } else {
            // 干扰数增加
            this.ballNumCounter++;
            if (this.ballNumCounter >= this.ballNum) {
                this.ballNumCounter = this.ballNum;
                this.repeatCounter = 0;
            }
            this.newGame();

            console.log('ballNumCounter:(' + this.ballNumCounter + '/' + this.ballNum + ')');
            console.log('##############');
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
        //400,220
        var randX = cc.random0To1() * this.areaW + this.areaX;
        var randY = cc.random0To1() * this.areaH + this.areaY;
        return cc.p(randX, randY);
    },
    update(dt) {
        this.timer += dt;
        if (this.timer >= 1) {
            this.timer = 0;
            this.time++; // second

            let minute = Math.floor(this.time / 60);
            let second = this.time - minute * 60;
            if (minute < 10)
                minute = '0' + minute;
            if (second < 10)
                second = '0' + second;
            this.timeLbl.string = 'Time:' + minute + ':' + second;
        }
    },
});
module.export = gameJs;