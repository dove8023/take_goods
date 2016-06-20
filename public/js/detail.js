/*
 * content @ inspect one order.
 * time    @ 2016.6.20
 * author  @ Mr.He
*/

require(["angular" , "angularCookies" , "./common/angular_config" , "./common/filter" , "./common/directive"] , function( angular , angularCookies , angular_config , Filter , directive){

	var app = angular.module("myApp" , ["ngCookies" , "angular_config" , "Filter" , "angular_directive"]);


	app.controller("Detail" , ["$scope" , "$rootScope" , "$http" , "$timeout" , function($scope , $rootScope , $http , $timeout){
		/* id值检查 */
		var orderId = document.getElementById('orderID').value;
		var RegNum = /\D/g;
		if(!orderId || RegNum.test(orderId)){
			alert("ID值不合法");
			/*window.close();
			location.href = "/";*/
		}

		$scope.goReceive = function(){
			location.href
		}



	}]);


	angular.bootstrap(document , ["myApp"]);
});