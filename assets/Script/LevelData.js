let levelDatas = {
    data: [
        {
            id: 1001,
            levelScore: 10,
            limitTime: 60,
            repeat: 2,
            ballNum: 1, // 干扰数目
            goalNum: 2, // 目标数目
            ballSpeed: {// 小球球速
                x: 30,
                y: 30,
            }
        },
        {
            id: 1002,
            levelScore: 20, 
            limitTime: 60,
            repeat: 5,
            ballNum: 4, // 干扰数目
            goalNum: 2, // 目标数目
            ballSpeed: {// 小球球速
                x: 50,
                y: 50,
            }
        },
        {
            id: 1003,
            levelScore: 30, 
            limitTime: 60,
            repeat: 5,
            ballNum: 6, // 干扰数目
            goalNum: 2, // 目标数目
            ballSpeed: {// 小球球速
                x: 40,
                y: 40,
            }
        },
        {
            id: 1004,
            levelScore: 40, 
            limitTime: 60,
            repeat: 6,
            ballNum: 3, // 干扰数目
            goalNum: 3, // 目标数目
            ballSpeed: {// 小球球速
                x: 30,
                y: 30,
            }
        },
        {
            id: 1005,
            levelScore: 50, 
            limitTime: 60,
            repeat: 6,
            ballNum: 4, // 干扰数目
            goalNum: 4, // 目标数目
            ballSpeed: {// 小球球速
                x: 25,
                y: 25,
            }
        },
    ],
    getLevelById(id) {
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                return this.data[i];
            }
        }
        return null;
    },

    getLevelSize() {
        return this.data.length;
    },

    examLocked:true,
    setExamLocked(locked){
        this.examLocked = locked;
    },
    getExamLocked(){
        return this.examLocked;
    },

    examMinScore:10,
};
module.exports = levelDatas;