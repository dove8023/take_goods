/*
* content@angular directive.
* time   @ 2016.6.17
* author @ Mr.He
*/

define(["angular"] , function(angular){
	var app = angular.module("angular_directive" , []);

	app.directive("timeChoice" , function($timeout){
		return {
			restrict : "AE",
			scope    : {
				"time" : "=ngTime"
			},
			templateUrl :  "/view/timechoice.html",
			link : function(scope , element , attrs ){
				var date = new Date(),
					year = date.getFullYear(),
					month= date.getMonth();

				scope.Year = [];
				scope.Month= [];
				scope.Days = [];
				for(var i=0;i<10;i++){
					scope.Year.push(year-i);
				}
				for(var j=1;j<13;j++){
					var s = j;
					if(s<10){
						s = "0" + s;
					}
					scope.Month.push(s);
				}

				//default this year and this month.
				scope.year = year;
				// scope.month = month+1;

				var bigMonth = [01,03,05,07,08,10,12],
					littleMonth = [04,06,09,11];

				var bigMonth = {
						"01" : true,
						"03" : true,
						"05" : true,
						"07" : true,
						"08" : true,
						"10": true,
						"12": true
					},
					littleMonth = {
						"04" : true,
						"06" : true,
						"09" : true,
						"11" : true
					};

				function computeDay(){
					if(scope.month in bigMonth){
						len = 31;
					}else if(scope.month in littleMonth){
						len = 30;
					}else{
						if(scope.year % 4 == 0 || scope.year % 400 == 0){
							len = 29;
						}else{
							len = 28;
						}
					}
					len += 1;
					scope.Days = [];
					for(var i=1;i<len;i++){
						scope.Days.push(i);
					}
				}

				scope.$watch("month" , function(newValue){
					computeDay();
				});

				scope.$watch("year" , function(newValue){
					computeDay();
				});

				element.find("select").on("change" , function(){
					scope.time = scope.year + "-" + scope.month + "-" + scope.day;
				});
			}
		}
	});


	app.directive("ngTab" , function(){
		return {
			restrict : "A",
			scope : {
				"class" : "@tabClass",
				"callback" : "&"
			},
			link : function(scope , element , attrs){
				var btns = element.find("button");
				btns.on("click" , function(){
					btns.removeClass(scope.class);
					var that = angular.element(this);
					that.addClass(scope.class);
					return scope.callback && scope.callback(that.index());
				});
			}
		}
	});






});