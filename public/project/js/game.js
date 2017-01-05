


var Global = {
    "win_width"     : window["innerWidth"] / 1,
    "win_height"    : window["innerHeight"] / 1,
    "hz"            : 60,       //创建新元素的频率判断
    "usingTimeE"    : document.getElementById('usingTime'),
    "isMobile"      : !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/),
    "realTimeScroe" : document.getElementById('realTimeScroe'),
    "score"         : 0,           //得分
    "usingTime"     : 0,          //游戏时间
    "sudu"          : 1,            //速度控制
    "GameBox"       : document.getElementById('gameBox'),      //大盒子

}



/* 计算雪道离左侧距离 */
var Distance = Global.win_width < 370 ? 8 : 17;
var Value = {
    "snow1" : Distance,
    "snow2" : parseInt(Global.win_width / 4) * 1 + Distance,
    "snow3" : parseInt(Global.win_width / 4) * 2 + Distance,
    "snow4" : parseInt(Global.win_width / 4) * 3 + Distance
};

var util = {
    //产生随机数
    random : function(){
        return Math.floor(min+Math.random()*10);
    },
    // 增加得分 ，根据得分变量，修改产生元素的频率和移动速度
    addScore : function(){
        var score = Global.score / 1;
        Global.score = ++score;
        Global.realTimeScroe.innerHTML = score;
        if(score >= 30 && score < 45){
            Global.sudu = 3;
            Global.hz = 50;
        }else if(score >= 45 && score < 60){
            Global.sudu = 4;
            Global.hz = 40;
        }else if(score >= 60){
            Global.sudu = 5;
            Global.hz = 30;
        }
    },
    //撞击判断 
    judgeImpact : function( obj , target , callback){
        var objP = {
            "left"  : obj.imagenode.offsetLeft / 1,
            "top"   : obj.imagenode.offsetTop / 1,
            "width" : obj.imagenode.width / 1,
            "height": obj.imagenode.height /1
        },
        targetP = {
            "left"  : target.imagenode.offsetLeft / 1,
            "top"   : target.imagenode.offsetTop / 1,
            "width" : target.imagenode.width / 1,
            "height": target.imagenode.height / 1   
        };

        if( objP.top + objP.height >= targetP.top && objP.top <= targetP.top + targetP.height ){
            //x 轴碰撞发生
            if(objP.left + objP.width >= targetP.left && objP.left <= targetP.left + targetP.width){
                //撞击发生
                return callback && callback();
            }
        }

        return false;
    },

    //出界判断
    moveOut : function(obj){
        return obj.imagenode.offsetTop > Global.win_height ? true : false;

    },

    //遍历
    mapFn : function(Arr , human){
        //移动所有元素
        Arr.map(function(item , index){
            item.move();
            if(util.moveOut(item)){
                Global.GameBox.removeChild(item.imagenode);
                Arr.splice(index, 1);
            }

            util.judgeImpact( item , human , function(){
                if(item.type == 1){
                    //增加得分
                    util.addScore();
                    //清除这个雪饼元素
                    Global.GameBox.removeChild(item.imagenode);
                    Arr.splice(index, 1);
                }else if(item.type == 2){
                    //die
                    Game.gameOver();
                }
            });
        });
    }
}

/* 游戏功能控制 */
var Game = {
    leftArr : [] ,     //左侧元素数组
    rightArr: [] ,     //右侧元素数组
    mark    : 0  ,     //运动循环标记
    timer   : null,    //游戏控制定时器
    useTime : null,    //正常时间定时器
    /*
        创建雪饼
        type : 1 , 2 , 3 饼1,  山2 , human3
    */
    createElement : function(x , y , sizeX , type , imagesrc , id){
        this.left = x;
        this.top  = y;
        this.width = sizeX;
        this.src = imagesrc;
        this.type = type;

        //move action , 设置一个基础速度
        this.move = function(){
            this.imagenode.style.top = this.imagenode.offsetTop + 4 + Global.sudu + 'px';
        }

        this.init = function(){
            this.imagenode = document.createElement("img");
            this.imagenode.style.left = this.left + "px";
            this.imagenode.style.top  = this.top  + "px";
            this.imagenode.style.width = this.width + "px";
            this.imagenode.src = this.src;
            if(id){
                this.imagenode.setAttribute("id" , id); 
                //是否处于移动状态
                this.moving = false; 
                //记录移动数据，位置，角度，速度
                this.moveData = null;
                //人物移动循环周期记录 , 20为一周期 
                this.moveRecord = 0;      
            }
            Global.GameBox.appendChild(this.imagenode);
        }
        this.init();
    },

    /* 随机决定在哪里，生成什么样的 新元素 */
    productNewOne : function(){
        var isShan = util.random()  >= 6 ? true : false,
            isShan2 = util.random() >= 6 ? true : false,
            dis  = util.random()  >= 5 ? Value.snow1 : Value.snow2,
            dis2 = util.random() >= 5 ? Value.snow3 : Value.snow4;

        if(isShan){
            Game.leftArr.push(new Game.createElement( dis , -50 , 65 , 2 , "gimages/game03/shanlv.png" ));
        }else{
            Game.leftArr.push(new Game.createElement( dis , -50 , 65 , 1 , "gimages/game03/binglv.png" ));
        }

        if(isShan2){
            Game.rightArr.push(new Game.createElement( dis , -50 , 65 , 2 , "gimages/game03/shan.png" ));
        }else{
            Game.rightArr.push(new Game.createElement( dis , -50 , 65 , 1 , "gimages/game03/bing.png" ));
        }
    },

    /* 游戏运行一次 */
    gameGoOnce : function(){
        ++this.mark;

        //移动所有元素
        util.mapFn( Game.leftArr , Human.humanLeft );
        util.mapFn( Game.rightArr , Human.humanRight );

        if(Human.humanLeft.moving){
            Human.humanMove( Human.humanLeft );
        }

        if(Human.humanRight.moving){
            Human.humanMove( Human.humanRight );
        }

        if(this.mark >= Global.hz){
            this.mark = 0;
            this.productNewOne();
        }
    },
    gameOver : function(){
        clearInterval(Game.timer);
        clearInterval(Game.useTime);
        alert("游戏结束");
        location.href = location.href;
    },
    gameStart : function(){
        clearInterval(Game.timer);
        clearInterval(Game.useTime);

        Game.timer = setInterval(function(){
            Game.gameGoOnce();
        } , 30);

        // Game.
    }

}


var Reg = /[a-zA-Z\(\)]/g;

/*  human controll  */
var Human = {
    humanLeft : new Game.createElement( Value.snow1 , Global.win_height*0.8 , 70 , 3 , "gimages/game03/renlv.png" , "human1" ),
    humanRight : new Game.createElement( Value.snow3 , Global.win_height*0.8 , 70 , 3 , "gimages/game03/ren.png" , "human1" ),
    /* return next move target , 左人在1，2雪道 ， 右人在3，4雪道 */
    nextTarget : function(rightNow){
        var target;
        switch(rightNow){
            case Value.snow1 :
                target = Value.snow2;
                break;
            case Value.snow2 :
                target = Value.snow1;
                break;
            case Value.snow3 :
                target = Value.snow4;
                break;
            case Value.snow4 :
                target = Value.snow3;
                break;          
        }
        return target / 1;
    },

    /* 小人的移动在20步完成 ，旋转45deg */
    computeStep : function( target , origin ){
        var step = Math.abs(target - origin) / 20,
            direct,
            rotate;
        return {
            "direct" : target > origin ? step : -step , 
            "rotate" : target > origin ? 4.5 : -4.5 , 
            "target" : target
        }
    },

    /* human moving controll , 传入人物对象*/
    humanMove : function(obj){
        //规定小人20步移动结束
        if(obj.moveRecord >= 20){
            //移动结束
            obj.imagenode.style.left = obj.moveData.target + 'px';
            obj.imagenode.style['-webkit-transform'] = "rotate(0deg)";
            obj.moving = false;
            obj.moveRecord = 0;
            obj.moveData = null;
            return false;
        }

        obj.imagenode.style.left = obj.imagenode.offsetLeft / 1 + obj.moveData.direct / 1 + 'px';
        //将小人转回来
        if(obj.moveRecord == 9){
            obj.moveData.rotate = - obj.moveData.rotate;
        }

        var r;
        if(!Global.isMobile){
            if(obj.imagenode.style['-webkit-transform']){
                r = obj.imagenode.style['-webkit-transform'].replace(Reg , "");
            }else if(obj.imagenode.style['transform']){
                r = obj.imagenode.style['transform'].replace(Reg , "");
            }else{
                r = 0;
            }
        }else{
            r = obj.imagenode.style['-webkit-transform'].replace(Reg , "");
        }

        r = r / 1 + obj.moveData.rotate;
        obj.imagenode.style['-webkit-transform'] = "rotate(" + r + "deg)";
        obj.imagenode.style['transform'] = "rotate(" + r + "deg)";
        
        obj.moveRecord = obj.moveRecord / 1 + 1;
    }

}


$("#go").click(function(){
    $(this).parent().hide();
    $("#showTimeScroe").show();
    $("#PlayGame").show();

    Game.gameStart();
});
