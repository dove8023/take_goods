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
		 	changeFn : function(obj){
		 		$scope.Dialog.showFn();
				$scope.Dialog.data = obj;
				$scope.Dialog.msg = "修改这个类型";
				$scope.Dialog.state = "change";
		 	},
		 	addFn    : function(){
		 		$scope.Dialog.showFn();
				$scope.Dialog.msg = "添加一个类型";
				$scope.Dialog.state = "add";
		 	},
		 	"data" : {}
		};
		
		/* 暂时不考虑分页的情况 */
		$http.get("/type/api/list").success(function(result){
			console.log(result);
			$scope.List = result.data;
		});

		$scope.save = function(){
			if($scope.Dialog.state == "add"){
				//add new one.
				
			}else{
				//update 
			}
		}

		$scope.itemAdd = function(){
			
		}
		
	}]);


	app.controller("Manage" , ["$scope" , function($scope){

	}]);

	angular.bootstrap(document , ["myApp"]);
});