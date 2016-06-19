/*
 * content @ deal check Page function.
 * time    @ 2016.6.16
 * author  @ Mr.He
*/

require(["angular" , "angularCookies" , "./common/angular_config" , "./common/filter" , "./common/directive"] , function( angular , angularCookies , angular_config , Filter , directive){

	var app = angular.module("myApp" , ["ngCookies" , "angular_config" , "Filter" , "angular_directive"]);


	app.controller("Orders" , ["$scope" , "$rootScope" , "$http" , "$timeout" , function($scope , $rootScope , $http , $timeout){
		/* 其它时间选择弹出框 */
		$scope.TimeDialog = {
			"show" : false,
			"Ecover": document.getElementById("Cover"),
			"begin" : null,
			"end"   : null,
			open   : function(){
				this.show = true;
				this.Ecover.style.display = "block";
			},
			close  : function(){
				this.show = false;
				this.Ecover.style.display = "none";
			},
			sure  : function(){
				var _this = this;
				$timeout(function(){
					var obj = {
						"begin" : _this.begin,
						"end"   : _this.end
					}

					if(!obj.begin || !obj.end){
						alert("请选择完整的日期");
						return false;
					} 
					var begins = obj.begin.split("-"),
						ends   = obj.end.split("-");
					if(begins[2] == "undefined" || ends[2] == "undefined"){
						alert("请选择完整的日期");
						return false;
					}
					
					if(obj.begin > obj.end){
						alert("开始时间应小于结束时间");
						return;
					}

					console.log(obj);
					$scope.afterTimeChoice(obj);
					_this.close();
				} , 200);
			}
		};
		/* 时间段选择 */
		$scope.timechoice = function(time){
			var date = new Date(),
				day  = date.getDate(),
				year = date.getFullYear(),
				month= date.getMonth() + 1,
				week = date.getDay(),
				unix = 1000*3600*24;
			if(week == 0){
				week = 7;
			}

			var obj;
			switch(time){
				case "today":
					obj =  {
						"begin" : year + "-" + month + "-" + date.getDate(),
						"end"   : year + "-" + month + "-" + date.getDate()
					}
					break;
				case "week":
					//今天零点
					var todayZero = +new Date(date.toDateString()),
						beginWeek = todayZero - unix*(week-1),
						Tomorrow   = todayZero;
					beginWeek = new Date(beginWeek);
					Tomorrow  = new Date(Tomorrow);
					obj = {
						"begin" : beginWeek.getFullYear() + "-" + (beginWeek.getMonth()+1) + "-" +beginWeek.getDate(),
						"end"   : Tomorrow.getFullYear() + "-" + (Tomorrow.getMonth()+1) + "-" +Tomorrow.getDate(),
					}
					break;
				case "month":
					obj = {
						"begin" : year + "-" + month + "-" + "1",
						"end"   : year + "-" + month + "-" + date.getDate()
					}
					break;
				case "other":
					$scope.TimeDialog.open();
					return;
			}

			$scope.afterTimeChoice(obj);
		}

		/* 展示查询时间段 */
		$scope.showchecktime = "";
		$scope.afterTimeChoice = function(obj){
			$scope.showchecktime = obj.begin + " ~ " + obj.end;
			$scope.getData(obj);
		}
		
		/* 获取数据 */
		$scope.DataList = [];
		$scope.getData = function(options){
			options.limit = 50;
			$http.post("/api/receive/list" , {
				"begin" : options.begin,
				"end"   : options.end + " 23:59:59",
				"limit" : options.limit,
				"page"  : options.page
			}).success(function(result){
				$scope.DataList = result.data.rows;
			});
		}

		$scope.showDetail = function(item){
			alert(item.id);
		}

		
	}]);


	/*describe("button directive" , function(){
		var $complie , $rootScope;
		beforeEach(module("myApp"));
		beforeEach(inject(function(_$compile_ , _$rootScope_){
			$comlie = _$comlie_;
			$rootScope = _$rootScope_;
		}));

		it('adds a "btn" class to the button element' , function(){
			var element = $comlie('<button></button>')($rootScope);
			expect(element.hasClass("btn").toBe(true));
		})
	});*/

	angular.bootstrap(document , ["myApp"]);
});