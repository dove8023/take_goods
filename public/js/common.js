/*
 * requirejs config 
 * time @ 2016.5.30
 * autor@ Mr.He
*/


require.config({
	baseUrl:'/js/',
	paths: {
		angular : "./libs/bower_components/angular/angular.min",
		angularCookies : "./libs/bower_components/angular-cookies/angular-cookies",
		angularChart : "./libs/bower_components/angular-chart.js/dist/angular-chart",
		chart   : "./libs/bower_components/Chart.js/Chart",
		jquery  : "./libs/bower_components/jquery/dist/jquery.min"

		/*APP : 'app',		
		Zepto: 'lib/zepto-1.1.4',
		jQuery : 'lib/jquery-1.8.0.min',
		Lib    : './lib',
		Swiper : 'lib/swiper.min',
		MD5    : 'lib/md5'*/
	},

	shim : {
		angular : {
			"exports" : "angular",
			"deps"    : ["jquery"]
		},
		angularCookies : {
			"exports" : "angularCookies",
			"deps"	  : ['angular']
		},
		angularChart : {
			"exports" : "angularChart",
			"deps"    : ['angular' , 'chart']
		}
	}
});