/*
* content@angular config.
* time   @ 2016.6.2
* author @ Mr.He
*/

define(["angular"] , function(angular){
	var app = angular.module("angular_config" , []);


	app.config(function($httpProvider , $locationProvider){
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

		// Override $http service's default transformRequest
	    $httpProvider.defaults.transformRequest = [function(data) {

	        /**
	         * The workhorse; converts an object to x-www-form-urlencoded serialization.
	         * @param {Object} obj
	         * @return {String}
	         */
	        var param = function(obj) {
	        	
	            var query = '';
	            var name, value, fullSubName, subName, subValue, innerObj, i;

	            for (name in obj) {
	                value = obj[name];

	                if (value instanceof Array) {
	                    for (i = 0; i < value.length; ++i) {
	                        subValue = value[i];
	                        fullSubName = name;
	                        innerObj = {};
	                        innerObj[fullSubName] = subValue;
	                        query += param(innerObj) + '&';
	                    }
	                } else if (value instanceof Object) {
	                    for (subName in value) {
	                        subValue = value[subName];
	                        fullSubName = name + '[' + subName + ']';
	                        innerObj = {};
	                        innerObj[fullSubName] = subValue;
	                        query += param(innerObj) + '&';
	                    }
	                } else if (value !== undefined && value !== null) {
	                    query += encodeURIComponent(name) + '='
	                            + encodeURIComponent(value) + '&';
	                }
	            }

	            return query.length ? query.substr(0, query.length - 1) : query;
	        };

	        return angular.isObject(data) && String(data) !== '[object File]'
	                ? param(data)
	                : data;
	    }];





	    $locationProvider.html5Mode(true);



	});
});