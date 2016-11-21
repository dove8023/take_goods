/*
 *  author  : Mr. He
 *	time    : 2016.6.12
 *	content : 滤数据处理
 */

define(['angular'] , function(angular){
	var app = angular.module("Filter" , []);

	/* 避免在计算中出现NaN的情况 */
	app.filter("Money" , function(){
		var dealMoney = function(input){

			if(!input || typeof (input/1) != "number"){
				return "0.00";
			}

			input *= 100;
			input = parseInt(input);
			input = input / 100.0;

			return input;
		};
		return dealMoney;
	});
	
	/* 时间戳 , (时间戳为秒) 转化为标准时间 */
	String.prototype.datechange = function(){
		var str = this;
		if(this.length !== 13){
			str = +new Date(this);
			str = str.toString();
			if(str.length != 13){
				return "";
			}
		}
		var d = new Date(str/1);
		var hour , min , sec , month;
		hour = d.getHours();
		min  = d.getMinutes();
		sec  = d.getSeconds();
		month= d.getMonth() + 1;
		if(hour < 10) hour = '0' + hour;
		if(min < 10) min = '0' + min;
		if(sec < 10) sec = '0' + sec;
		if(month<10) month = '0' + month;
		return d.getFullYear()+"-"+month+"-"+d.getDate()+" "+hour+":"+min+":"+sec;
	}

	/* 时间戳转换为标准时间 */
	app.filter("toTime" , function(){
		var toTimeFn = function(input){
			if(input == undefined){
				input = +new Date();
			}
			return input && input.toString().datechange();
		};
		return toTimeFn;
	});

	app.filter("Dnull" , function(){
		var fn = function(input){
			if(!input || input == ""){
				return "暂无";
			}else{
				return input;
			}
		}
		return fn;
	});

	/* 转换M , F为男女 */
	app.filter("sex" , function(){
		var sex_deal = function(input){
			if(input == "F"){
				return "女";
			}else if(input == "M"){
				return "男";
			}else{
				return "";
			}
		}

		return sex_deal;
	});

	/* 无数据时给出提示 */
	app.filter("nothing" , function(){
		var nothing = function(input){
			if(input == "" || !input){
				return "暂无";
			}else{
				return input;
			}
		}
		return nothing;
	});
	app.filter("is_editer_deal" , function(){
		var fn = function(input){
			if(input == "0"){
				return "普通";
			}else if(input == "1"){
				return "编辑";
			}else if(input == "2"){
				return "官方";
			}
		}
		return fn;
	});
});