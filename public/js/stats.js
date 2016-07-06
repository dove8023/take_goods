/*
 * content @ inspect one order.
 * time    @ 2016.6.23
 * author  @ Mr.He
*/

require(["angular" , "angularCookies" , "angularChart" , "./common/angular_config" , "./common/filter" , "./common/directive"] , function( angular , angularCookies , angularChart , angular_config , Filter , directive){

	var app = angular.module("myApp" , ["ngCookies" , "angular_config" , "Filter" , "angular_directive" , "chart.js"]);


	app.controller("Stats" , ["$scope" , "$rootScope" , "$http" , "$timeout" , function($scope , $rootScope , $http , $timeout){
		
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

					// console.log(obj);
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
				lastDay = new Date(year,month,0).getDate();
			var obj;
			switch(time){
				case "month":
					obj =  {
						"begin" : year + "-" + month + "-" + 1,
						"end"   : year + "-" + month + "-" + lastDay
					}
					break;
				case "month3":
					var month_three = month - 2,
						year_three  = year;
					if(month_three <= 0){
						year_three = year - 1;
						month_three = month_three + 12;
					}
					obj =  {
						"begin" : year_three + "-" + month_three + "-" + 1,
						"end"   : year + "-" + month + "-" + lastDay
					}
					break;
				case "other":
					$scope.TimeDialog.open();
					return;
			}

			// console.log(obj);
			$scope.afterTimeChoice(obj);
		}

		$scope.afterTimeChoice = function(obj){
			$scope.showchecktime = obj.begin + " ~ " + obj.end;
			$scope.getData(obj);
		}

		$scope.List = [];  //列表数据模型
		$scope.TypeList = []; //类型列表
		$scope.Count = 0;  //总计多少钱
		var indexObj = {}; //保存索引

		/* 获取类型类型列表 */
		$http.get("/api/type/list").success(function(result){
			// console.log(result);
			if(!result.state){
				alert("类型列表获取失败");
				return false;
			}
			$scope.TypeList = result.data.rows;
			InitList( result.data.rows , function(){
				//默认选中本月
				$scope.timechoice("month");
			});
		});

		/* 依据type list的数据初始化$scope.List */
		function InitList (typeArr , callback){
			$scope.List = [];  //清空数据模型
			$scope.Count = 0;  //总计为0.
			indexObj = {};     //索引重置
			for(var i=0,len=typeArr.length;i<len;i++){
				var obj = {
					"type_id" : typeArr[i].id,
					"type_name":typeArr[i].name,
					"goodsData":[]
				}
				indexObj["tid_"+typeArr[i].id] = i;
				$scope.List.push(obj);
			}
			indexObj.total = typeArr.length;
			// console.log($scope.List);
			return callback && callback();
		}


		$scope.getData = function(options){
			$http.post("/api/Stats" , {
				"begin" : options.begin,
				"end"   : options.end + " 23:59:59"
			}).success(function(result){
				//数据模型清零
				InitList( $scope.TypeList , function(){
					//所有的货物数据
					combineData(result.data.rows);
				});
			});
		}

		/* 将货物数据和类型数据结合输出 */
		function combineData (arr){
			//按不同的类型，分组数据
			for(var i=0,len=arr.length;i<len;i++){
				var data = arr[i];
				var s = indexObj["tid_"+data.type_id];
				if(s == undefined){
					//这个类型在类型列表中被删除了，创建它在$scope.List中的索引
					indexObj["tid_"+data.type_id] = indexObj.total;
					++indexObj.total;
					//创建它在$scope.List中的项
					var obj = {
						"type_id" : data.type_id,
						"type_name":data.type_name,
						"goodsData":[data]
					}
					$scope.List.push(obj);
				}else{
					$scope.List[s].goodsData.push(data);
				}
			}

			//统计数据
			for(var j=0,len2=$scope.List.length;j<len2;j++){
				StatsData ($scope.List[j]);
				$scope.Count += $scope.List[j].money;
			}
			// console.log($scope.List);
		}

		//统计数据
		function StatsData (obj){
			var weight=0,money=0;
			for(var i=0,len=obj.goodsData.length;i<len;i++){
				weight += obj.goodsData[i].weight;
				money  += obj.goodsData[i].one_total;
			}
			obj.weight = weight;
			obj.money  = money;
			obj.count  = len;
		}

		/* 查看，展示对应类型的收货数据 */
		$scope.checkDetail = function(item){
			if(item.show){
				item.show = false;
				return;
			}
			for(var i=0,len=$scope.List.length;i<len;i++){
				$scope.List[i].show = false;
			}
			item.show = true;
		}

		//单条数据修改操作，跳转至receive?id=**
		$scope.goReceive = function(obj){
			window.open("/receive?id="+obj.o_id);
		}

		//全年统计数据对话框
		$scope.YearDialog = {
			"show" : false,
			"Ecover": document.getElementById("Cover"),
			"loading": true,
			"typename": null,
			"typeid"  : null,
			"year"    : new Date().getFullYear(),
			"yearArr" : (function(){
				var thisYear = new Date().getFullYear(),
					arr = [];
				for(var i=0;i<5;i++){
					arr.push(thisYear-i);
				}
				return arr;
			})(),
			open   : function(obj){
				this.show = true;
				this.Ecover.style.display = "block";
				// console.log(obj);
				//show the type name.
				this.typename = obj.type_name;
				this.typeid   = obj.type_id;
				//get the data.
				this.getData();
			},
			close  : function(){
				this.show = false;
				this.Ecover.style.display = "none";
			},
			//获取数据
			getData : function(){
				var _this = this;
				//显示等待
				_this.loading = true;
				$http.post("/api/stats/type" , { "typeid" : _this.typeid , "year" : _this.year }).success(function(result){
					// console.log(result);
					//loading close.
					_this.loading = false;
					//整理数据并显示
					_this.drawCanvas(_this.dealData(result.data));
				});
			},
			//整理数据
			dealData : function(data){
				var allArr = [];
				for(var i=0;i<=12;i++){
					var obj = {"weight" : 0, "money": 0 , "month" : i+1 };
					allArr.push(obj);
				}
				for(var j=0;j<data.count;j++){
					var thisData = data.rows[j];
					if(thisData.weight/1 && thisData.one_total/1){
						var	month    = thisData.createdAt.split("-")[1] / 1;
						allArr[month].weight += thisData.weight/1;
						allArr[month].money += thisData.one_total/1;
					}
				}
				return allArr;
			},
			drawData : [[] , []],
			//绘制图表
			drawCanvas : function(obj){
				// this.drawData[0] = obj.
				this.drawData[0] = [];
				this.drawData[1] = [];
				for(var i=0,len=obj.length;i<len;i++){
					this.drawData[0].push(obj[i].weight);
					this.drawData[1].push(obj[i].money);
				}
			}
		};

		$scope.labels = ["0", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
		$scope.series = ['重量', '花费'];
		$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
		$scope.options = {
			scales: {
			  yAxes: [
			    {
			      id: 'y-axis-1',
			      type: 'linear',
			      display: true,
			      position: 'left'
			    },
			    {
			      id: 'y-axis-2',
			      type: 'linear',
			      display: true,
			      position: 'right'
			    }
			  ]
			}
		};
	}]);


	angular.bootstrap(document , ["myApp"]);
});