/*
 * content @ Receiving Page function.
 * time    @ 2016.6.12
 * author  @ Mr.He
*/

require(["angular" , "angularCookies" , "./common/angular_config" , "./common/filter"] , function( angular , angularCookies , angular_config , Filter){

	var app = angular.module("myApp" , ["ngCookies" , "angular_config" , "Filter"]);


	app.controller("Orders" , ["$scope" , "$rootScope" , "$http" , "$location" , function($scope , $rootScope , $http , $location){

		//尝试获取页面是否有ID，如果有则为编辑页面，没有则为添加页面
		var ID = $location.search()["id"],
			pageType = "add";
		if(ID && ID.toString().replace(/\D/g,"")){
			ID = ID.toString().replace(/\D/g,"");
			pageType = "editor";

			//获取这个订单的数据，并渲染页面
			GetData(ID);
		}
		
		

		/* ==== 页面数据模型准备 ==== */
		$scope.Data = {"total":0.0};  //页面整体数据
		$rootScope.TypeList = [];    //品种选择数组
		$scope.TypeChoice = {};		 //品种select选择保存

		/* 获取类型列表 */
		$http.get("/api/type/list").success(function(data){
			if(data.state != 1){
				alert("类型列表获取失败");
				return false;
			}
			$rootScope.TypeList = data.data.rows;
		});

		/* 类型选择 */
		$scope.typechange = function(obj , index){
			var arr = $scope.List[index/1];
			arr.price = obj.price;
			arr.type_id = obj.id;
			arr.type_name = obj.name;
		}

		/* ==== 如有ID获取ID的数据 ==== */
		function GetData(id){
			$http.get("/receive/select/"+id).success(function(result){
				if(!result.data){
					alert("没有查到这条记录");
					return;
				}

				//请求查询goods表
				console.log(result.data);
				$scope.Data = result.data;

			}).error(function(result){
				console.log("worry");
				console.log(result);
			})
		}

		//delete one .
		$scope.deletItem = function(index){
			if(!$scope.List[index].weight){
				$scope.List.splice(index , 1);
				return;
			}
			if(confirm("确定删除这条记录？")){
				$scope.List.splice(index , 1);
			}
		}

		//add one.
		$scope.addItem = function(){
			var obj = {};
			$scope.List.push(obj);
		}

		//all the goods data. default two.
		$scope.List = [{} , {}];
		
		$scope.$watch("List" , function(newValue){
			computeAll();
		} , true);

		//compute the total money.
		function computeAll(){
			var sum = 0;
			for(var i=0,len=$scope.List.length;i<len;i++){
				var one = $scope.List[i];
				if(one.weight && one.price){
					sum += one.weight*one.price;
					//保存单条数据的总价
					one.one_total = one.weight*one.price;

				}
			}
			sum = parseInt(sum*100) / 100;
			$scope.Data.total = sum;
		}


		//Save and send the data.
		$scope.Save = function(){
			if(!$scope.Data.seller){
				alert("请输入卖货人");
				return;
			}
			if(!$scope.Data.total){
				alert("请添加记录");
				return;
			}

			//去除数据列表中的空项
			var arr = [];
			for(var i=0,len=$scope.List.length;i<len;i++){
				var one = $scope.List[i];
				if(one.weight && one.price){
					arr.push($scope.List[i]);
				}
			}
			$scope.Data.rows = arr;
			
			var sendData = { "data" : JSON.stringify($scope.Data) };
			$http.post("/api/receive/addorder" , sendData).success(function(result){
				// console.log(result);
				if(result.state == 1){
					// location.href = location.href;
					alert("保存成功");
					return;
				}
				alert(result.msg);
			});
		}
	}]);



	angular.bootstrap(document , ["myApp"]);
});