/*
 * content @ type.js show the type list.
 * time    @ 2016.6.3
 * author  @ Mr.He
*/


require(["angular" , "angularCookies" , "./common/angular_config"] , function( angular , angularCookies , angular_config){

	var app = angular.module("myApp" , ["ngCookies" , "angular_config"]);


	/* 登陆模块 */
	app.controller("TypeManage" , [ "$scope" , "$rootScope" , "$http" , "$cookies" , function($scope , $rootScope , $http , $cookies){

		$scope.List = [];

		/* 添加，修改，删除弹出框逻辑 */
		$scope.Dialog = {
			"show":false ,
		 	"msg":"修改" ,
		 	"state" : "change" ,  //default change , add
		 	showFn : function(){
		 		document.getElementById('Cover').style.display = "block";
		 		this.show = true;
		 	},
		 	closeFn : function(){
		 		document.getElementById('Cover').style.display = "none";
		 		this.show = false;
		 		this.data = {};
		 	},
		 	changeFn : function(obj , index){
		 		$scope.Dialog.showFn();
				$scope.Dialog.data = angular.copy(obj);
				$scope.Dialog.msg = "修改这个类型";
				$scope.Dialog.state = "change";
				$scope.Dialog.data.index = index;
		 	},
		 	addFn    : function(){
		 		$scope.Dialog.showFn();
				$scope.Dialog.msg = "添加一个类型";
				$scope.Dialog.state = "add";
		 	},
		 	//dialog数据模型，包括index
		 	"data" : {}
		};
		
		/* 暂时不考虑分页的情况 */
		$http.get("/type/api/list").success(function(result){
			console.log(result);
			$scope.List = result.data.rows;
		});

		$scope.save = function(){
			if(!$scope.Dialog.data.name || !$scope.Dialog.data.price){
				alert("名称和价格是必须的");
				return;
			}

			if($scope.Dialog.state == "add"){
				//add new one.
				$http.post("/type/api/add" , {
					"name" : $scope.Dialog.data.name,
					"price": $scope.Dialog.data.price,
				}).success(function(result){
					console.log(result);
					if(result.state == 1){
						$scope.List.unshift(result.data);
					}else{
						alert("添加错误，请稍后重试");
					}
					$scope.Dialog.closeFn();
				});
			}else{
				//update 
				$http.post("/type/api/update" , {
					"name" : $scope.Dialog.data.name,
					"price": $scope.Dialog.data.price,
					"id"   : $scope.Dialog.data.id
				}).success(function(result){
					console.log(result);
					if(result.state == 1){
						$scope.List[$scope.Dialog.data.index/1].name = $scope.Dialog.data.name;
						$scope.List[$scope.Dialog.data.index/1].price = $scope.Dialog.data.price;
					}else{
						alert("修改失败，请稍后重试");
					}
					$scope.Dialog.closeFn();
				});
			}
			
		}

		$scope.deletItem = function(id){
			if(!confirm("确定删除这个类型？")){
				return;
			}
			$http.post("/type/api/delete" , {
				"id" : id
			}).success(function(result){
				console.log(result);
				if(result.state == 1){
					$scope.List.splice($scope.Dialog.index , 1);
					alert("删除成功");
				}else{
					alert(result.msg);
				}

				$scope.Dialog.closeFn();
			})
		}
		
	}]);


	app.controller("Manage" , ["$scope" , function($scope){

	}]);

	angular.bootstrap(document , ["myApp"]);
});