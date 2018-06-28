let levelDatas={
    data:[
        {
            id:1001,
            levelScore:10,
            ballNum:2,
            ballSpeed:0,//小球的球速
        },
        {
            id:1002,
            levelScore:20,
            ballNum:4,
            ballSpeed:0,//小球的球速
        },
        {
            id:1003,
            levelScore:30,
            ballNum:4,
            ballSpeed:0,//小球的球速
        },
        {
            id:1004,
            levelScore:40,
            ballNum:6,
            ballSpeed:0,//小球的球速

        },
        {
            id:1005,
            levelScore:50,
            ballNum:7,
            ballSpeed:0,//小球的球速

        },
    ],
    getLevelById(id){
        for(var i=0;i<this.data.length;i++){
            if(this.data[i].id===id){
                return this.data[i];
            }
            return null;

        }

    },
    getLevelSize(){
        return this.data.length;
    }
    


};
module.exports=levelDatas;