
/*
	游戏3，滑雪游戏
*/

var Global = {
	"win_width" : window["innerWidth"] / 1,
	"win_height": window["innerHeight"] / 1,
	"hz"        : 60,
	"usingTimeE": document.getElementById('usingTime'),
	"isMobile"   : !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/),
	"realTimeScroe" : document.getElementById('realTimeScroe'),
}	
window.scroe = 0;
window.usingTime = 0;

var Distance2 = 17;
if(Global.win_width < 370){
	Distance2 = 8;
}

var Value = {
	"snow1" : Distance2,
	"snow2" : parseInt(Global.win_width / 4) * 1 + Distance2,
	"snow3" : parseInt(Global.win_width / 4) * 2 + Distance2,
	"snow4" : parseInt(Global.win_width / 4) * 3 + Distance2
}


//产生min到max之间的随机数
function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
}

/* 修改得分和速度 */
function changeScroe (){
	var scroe = window.scroe / 1;
	window.scroe = ++scroe;
	Global.realTimeScroe.innerHTML = scroe;
	if(scroe >= 30 && scroe < 45){
		sudu = 3;
		Global.hz = 50;
	}else if(scroe >= 45 && scroe < 60){
		sudu = 4;
		Global.hz = 40;
	}else if(scroe >= 60){
		sudu = 5;
		Global.hz = 30;
	}
}



//所有元素盒子
var GameBox = document.getElementById('gameBox');
//运动速度,根据得分来改变
var sudu = 1;

/* 创建雪饼 */
/*
	type : 1 , 2 , 3 饼1,  山2 , human3
*/
function CreateElement ( x , y , sizeX , type , imagesrc , id ){
	this.left = x;
	this.top  = y;
	this.width = sizeX;
	this.src = imagesrc;
	this.type = type;

	//move action , 设置一个基础速度
	this.move = function(){
		this.imagenode.style.top = this.imagenode.offsetTop + 4 + sudu + 'px';
	}

	this.init = function(){
		this.imagenode = document.createElement("img");
		this.imagenode.style.left = this.left + "px";
		this.imagenode.style.top  = this.top  + "px";
		this.imagenode.style.width = this.width + "px";
		this.imagenode.src = this.src;
		if(id){
			this.imagenode.setAttribute("id" , id);	
			this.moving = false; 
			this.moveData = null;
			this.moveRecord = 0;  //人物移动循环周期记录 , 20为一周期		
		}
		GameBox.appendChild(this.imagenode);
	}
	this.init();
}

/* 生成新的元素 */
// var mountLeft = { "place":"",  };
function productNewOneLeft (){
	var isShan = random(0,10) >= 6 ? true : false,
		isLeft = random(0,10) >= 5 ? Value.snow1 : Value.snow2;

	if(isShan){
		leftArr.push(new CreateElement( isLeft , -50 , 65 , 2 , "gimages/game03/shanlv.png" ));
	}else{
		leftArr.push(new CreateElement( isLeft , -50 , 65 , 1 , "gimages/game03/binglv.png" ));
	}
}

function productNewOneRight (){
	var isShan = random(0,10) >= 6 ? true : false,
		isLeft = random(0,10) >= 5 ? Value.snow3 : Value.snow4;

	if(isShan){
		rightArr.push(new CreateElement( isLeft , -50 , 65 , 2 , "gimages/game03/shan.png" ));
	}else{
		rightArr.push(new CreateElement( isLeft , -50 , 65 , 1 , "gimages/game03/bing.png" ));
	}
}

/* ------------------------------------ human move ---------------------------------------- */
function getArrive (left){
	var target;
	switch(left){
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
}

/* --- 20 步移动完毕 , 旋转45deg---- */
function computeStep (target , origin){
	var step = Math.abs(target - origin) / 20,
		direct,
		rotate;
	if(target > origin){
		direct = step;
		rotate = 4.5;
	}else if(target < origin){
		direct = 0 - step;
		rotate = -4.5;
	}
	return { "direct" : direct , "rotate" : rotate , "target" : target };
}

/* human move function ,  move obj : obj    */
var Reg = /[a-zA-Z\(\)]/g;
function HumanMove (obj){

	if(obj.moveRecord >= 20){
		//移动结束
		obj.imagenode.style.left = obj.moveData.target + 'px';
		obj.imagenode.style['-webkit-transform'] = "rotate(0deg)";

		if(!Global.isMobile){
			obj.imagenode.style['-moz-transform'] = "rotate(0deg)";
			obj.imagenode.style['-ms-transform'] = "rotate(0deg)";
			obj.imagenode.style['transform'] = "rotate(0deg)";
		}
	

		obj.moving = false;
		obj.moveRecord = 0;
		obj.moveData = null;
		return false;
	}

	obj.imagenode.style.left = obj.imagenode.offsetLeft / 1 + obj.moveData.direct / 1 + 'px';
	if(obj.moveRecord == 9){
		obj.moveData.rotate = 0 - obj.moveData.rotate;
	}

	if(!Global.isMobile){
		if(obj.imagenode.style['-webkit-transform']){
			var r = obj.imagenode.style['-webkit-transform'].replace(Reg , "");
		}else if(obj.imagenode.style['-moz-transform']){
			var r = obj.imagenode.style['-moz-transform'].replace(Reg , "");
		}else if(obj.imagenode.style['-ms-transform']){
			var r = obj.imagenode.style['-ms-transform'].replace(Reg , "");
		}else if(obj.imagenode.style['transform']){
			var r = obj.imagenode.style['transform'].replace(Reg , "");
		}else{
			var r = 0;
		}
	}else{
		var r = obj.imagenode.style['-webkit-transform'].replace(Reg , "");
	}

	

		
	
	
	r = r / 1 + obj.moveData.rotate;
	obj.imagenode.style['-webkit-transform'] = "rotate(" + r + "deg)";
	if(!Global.isMobile){
		obj.imagenode.style['-moz-transform'] = "rotate(" + r + "deg)";
		obj.imagenode.style['-ms-transform'] = "rotate(" + r + "deg)";
		obj.imagenode.style['transform'] = "rotate(" + r + "deg)";
	}
	

	obj.moveRecord = obj.moveRecord / 1 + 1;
}

var leftHumanE = document.getElementById('leftHuman'),
	rightHumanE= document.getElementById('rightHuman');
var leftTouch = false,rightTouch = false;
if(Global.isMobile){

	document.addEventListener("touchmove" , function(event){
		event.preventDefault();
	} , false);	

	leftHumanE.addEventListener("touchstart" , function(){
		if(human1.moving || leftTouch){
			return false;
		}
		human1.moving = true;
		leftTouch = true;
		var left =  human1.imagenode.offsetLeft;
		human1.moveData = computeStep( getArrive( left ) , left );
	} , false);

	leftHumanE.addEventListener("touchend" , function(){
		leftTouch = false;
	} , false);

	rightHumanE.addEventListener("touchstart" , function(){
		if(human2.moving || rightTouch){
			return false;
		}
		human2.moving = true;
		rightTouch = true;
		var left =  human2.imagenode.offsetLeft;
		human2.moveData = computeStep( getArrive( left ) , left );
	} , false);

	rightHumanE.addEventListener("touchend" , function(){
		rightTouch = false;
	} , false);
}else{
	leftHumanE.onclick = function(){
		if(human1.moving){
			return false;
		}
		human1.moving = true;
		var left =  human1.imagenode.offsetLeft;
		human1.moveData = computeStep( getArrive( left ) , left );
	}
	rightHumanE.onclick = function(){
		if(human2.moving){
			return false;
		}
		human2.moving = true;
		var left =  human2.imagenode.offsetLeft;
		human2.moveData = computeStep( getArrive( left ) , left );
	}
}

var keyOk = false;
/* ------ PC按键事件 -------- */
document.onkeyup = function(event){
	var e = event || window.event;

	if(!keyOk){
		return false;
	}

	e.preventDefault();

	var keyCodeE = e.keyCode;

	// 左边雪人
	if(keyCodeE == 65){
		var left =  human1.imagenode.offsetLeft;
		if(getArrive( left ) == Value.snow1){
			leftHumanE.click();
		}		
	}

	if(keyCodeE == 68){
		var left =  human1.imagenode.offsetLeft;
		if(getArrive( left ) == Value.snow2){
			leftHumanE.click();
		}
	}


	// 右边雪人

	if(keyCodeE == 37){
		var left =  human2.imagenode.offsetLeft;
		if(getArrive( left ) == Value.snow3){
			rightHumanE.click();
		}
	}

	if(keyCodeE == 39){
		var left =  human2.imagenode.offsetLeft;
		if(getArrive( left ) == Value.snow4){
			rightHumanE.click();
		}
	}
}

	

	

/* ---------------------- human move END ------------------------- */




/* 撞击判断 */
function judgeImpact ( allArr , n , objCan ) {
	var obj = allArr[n];
	var canParam = {
		"left" : objCan.imagenode.offsetLeft / 1,
		"top"  : objCan.imagenode.offsetTop / 1,
		"width": objCan.imagenode.width / 1,
		"height":objCan.imagenode.height / 1
	}
	var objParam = {
		"left" : obj.imagenode.offsetLeft / 1,
		"top"  : obj.imagenode.offsetTop / 1,
		"width": obj.imagenode.width / 1,
		"height":obj.imagenode.height /1
	}	
	if( objParam.top + objParam.height >= canParam.top && objParam.top <= canParam.top + canParam.height ){
		// y 轴
		if( objParam.left + objParam.width >= canParam.left && objParam.left <= canParam.left + canParam.width ){
			//撞击
			if(obj.type == 1){
				//得分加 1 
				changeScroe();
				//清除该元素
				GameBox.removeChild(obj.imagenode);
				allArr[n] = null;
			}else if(obj.type == 2){
				//die , game over
				gameOver(function(){
					Doom.cover.show();
					if(Global.isMobile){
						Doom.shareBtn.show();
					}					
					Doom.showScroe.html(window.scroe);
					computeCalled();
					// Doom.showGameTime.html(window.usingTime);
					Doom.gameResult.show();

					/* 调用分数增加接口 */
					$.post("/api/score-change?v="+Math.random(), {status: 1, score: window.scroe, remark: "知识问答游戏答对一题5分"}, function(result) {
			           /* console.info(result);*/
			        }, "json");
				});
			}
		}
	}
}

/* 游戏结束函数 */
function gameOver( callback ){
    game3InitShare();
	clearInterval(timer);
	clearInterval(useTimer);	
	return callback && callback();
}

function gameReset(){
	human1 = null;
	human2 = null;
	leftArr = [];
	rightArr = [];
	sudu = 2;
	mark = 0;
	GameBox.innerHTML = "";
	window.scroe = 0;
	Global.realTimeScroe.innerHTML = 0;
	window.usingTime = 0;
	Global.usingTimeE.innerHTML = 0;
	human1 = new CreateElement( Value.snow1 , Global.win_height*0.8 , 70 , 3 , "gimages/game03/renlv.png" , "human1" );
	human2 = new CreateElement( Value.snow3 , Global.win_height*0.8 , 70 , 3 , "gimages/game03/ren.png" , "human1" );
}

/* 计算得分者称谓 */
function computeCalled(){
	var current_scroe = window.scroe;
	if(current_scroe <= 30){
		Doom.called.html("你属于滑雪菜鸟,<br>再接再厉哦!");
	}else if(current_scroe >30 && current_scroe <= 60){
		Doom.called.html("你已经升级为滑雪大咖,<br>继续努力，向下一站进发!");
	}else if(current_scroe > 60){
		Doom.called.html("你已经升级为顶级达人,<br>尽享极速畅滑!");
	}
}




var leftArr = [],
	rightArr= [];

var human1 , human2;

var mark = 0;  //运动循环标记， ==20 创建新的元素

/* 游戏开始 */
function start () {
	mark++;
//移动所有元素
	for(var i=0,len=leftArr.length;i<len;i++){
		if(leftArr[i] == null){
			leftArr.splice(i,1);
			len--;
			continue;
		}
		leftArr[i].move();
		//出界判断
		if(leftArr[i].imagenode.offsetTop > Global.win_height){
			GameBox.removeChild(leftArr[i].imagenode);
			leftArr[i] = null;
		}else{
			//撞击判断
			judgeImpact(leftArr , i , human1);
		}		
	}

	for(var j=0,len2=rightArr.length;j<len2;j++){
		if(rightArr[j] == null){
			rightArr.splice(j,1);
			len2--;
			continue;
		}
		rightArr[j].move();
		
		if(rightArr[j].imagenode.offsetTop > Global.win_height){
			//出界判断
			GameBox.removeChild(rightArr[j].imagenode);
			rightArr[j] = null;
		}else{
			//撞击判断
			judgeImpact(rightArr , j , human2);
		}
	}

//移动元素  END 

//移动人物
	if(human1.moving){
		HumanMove(human1);
	}
	if(human2.moving){
		HumanMove(human2);
	}	
	//创建新的元素
	if(mark >= Global.hz){
		productNewOneLeft();
		productNewOneRight();
		mark = 0;
	}
}


	var timer , useTimer;
	function begin () {

		clearInterval(timer);
		clearInterval(useTimer);
		//重置各项元素
		 gameReset();
		//开启定时器
		timer = setInterval( start , 30 );
		useTimer = setInterval( function(){
			window.usingTime = ++window.usingTime;
			Global.usingTimeE.innerHTML = window.usingTime;

			/*if(window.usingTime > 15){
				clearInterval(timer);
				clearInterval(useTimer);
			}*/
		} , 1000);
	}


var Doom = {
	"cover" : $("#cover"),
	"cover2": $("#cover2"),
	"showScroe":$("#showScroe"),
	// "showGameTime":$("#showGameTime"),
	"called" : $("#called"),
	"gameResult" : $("#gameResult"),
	"playAgain" : $("#playAgain"),
	"goHome"  : $("#goHome"),
	"gameResultclose" : $("#gameResultclose"),
	"rule"    : $("#rule"),
	"pcrule"  : $("#pc_rule"),
	"showTimeScroe":$("#showTimeScroe"),
	"shareE"  : $("#share"),
	"shareBtn": $("#shareBtn"),
}
/* 页面其它逻辑部分 */
$("#go").click(function(){
	$(this).parent().fadeOut(100,function(){

		if(Global.isMobile){
			Doom.cover.show();
			Doom.rule.show();
			Doom.shareBtn.hide();
		}else{
			Doom.pcrule.show();
		}
		
		Doom.showTimeScroe.show();
		$("#PlayGame").fadeIn(100);

		keyOk = true;
	});
});

Doom.pcrule.click(function(){
	$(this).hide();
	begin();	
});

/* 点击开始游戏 */
$("#rule_close,#firstBegin").click(function(){
	Doom.rule.hide();
	Doom.cover.hide();
	begin();
});

Doom.playAgain.click(function(){
	Doom.gameResult.hide();
	Doom.shareBtn.hide();
	Doom.cover.hide();
	begin();
});

// Doom.goHome.click(function(){
// 	if(Global.isMobile){
// 		location.href = "index.html";
// 	}else{
// 		//打开转盘
// 		window.parent.GOZHUANPAN();
// 	}
	
// });

Doom.gameResultclose.click(function(){
	location.href = location.href;
});




var totalScroe = 0;
