/*
 * index.js
 * time @ 2016.5.30
 * author@Mr.He
*/

require(["angular" , "angularCookies"] , function( angular , angularCookies){
	var app = angular.module("myApp" , ["ngCookies"]);

	app.controller("Test" , function($scope , $cookies){
		$scope.what = "12345678";

		// console.log($cookies);
	});

	angular.bootstrap(document , ["myApp"]);
});