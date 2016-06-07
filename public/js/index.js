/*
 * index.js
 * time @ 2016.5.30
 * author@Mr.He
*/

require(["angular" , "angularCookies" , "./common/angular_config"] , function( angular , angularCookies , angular_config){

	var app = angular.module("myApp" , ["ngCookies" , "angular_config"]);


	/* 登陆模块 */
	app.controller("Login" , [ "$scope" , "$rootScope" , "$http" , "$cookies" , function($scope , $rootScope , $http , $cookies){
		$rootScope.Logined = false;
		// console.log($cookies.get("session_id"))
		if($cookies.get("session_id")){
			$cookies.get("session_id").length == 32 ? $rootScope.Logined = true : $rootScope.Logined = false;
		}

		$scope.loginFn = function(){
			if($scope.password == ""){
				alert("password need.");
				return false;
			}

			if($scope.phoneNumber.length != 11){
				alert("Need a real phone number");
				return false;
			}

			$http.post("/user/api/login" , {
				"phone" : $scope.phoneNumber ,
				"password" : $scope.password
			}).success(function(result){
				if(result.state == 1){
					$rootScope.Logined = true;
					localStorage.setItem("phone" , result.data.phone);
					localStorage.setItem("password" , result.data.password);
				}else{
					alert(result.msg);
				}
				console.log(result);
			})
		}

		if(localStorage.getItem("phone")){
			$scope.phoneNumber = localStorage.getItem("phone");
		}
		if(localStorage.getItem("password")){
			$scope.password = localStorage.getItem("password");
		}
	}]);


	app.controller("Manage" , ["$scope" , function($scope){

	}]);

	angular.bootstrap(document , ["myApp"]);
});