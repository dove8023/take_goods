/*
 * 首页路径设置
 * time @ 2016.5.21
*/

var express = require("express"),
	logger  = require("morgan");

var router = express.Router();



/* all request of index will be here. */
router.use(function(req , res , next){
	console.log('%s %s %s' , req.method , req.url , req.path);
	next();
});

router.get("/" , function(req , res , next){

	/*if(req.session.logged_in){
		res.send("<h1>Welcome "+req.session.name+"</h1>");
	}else{
		res.render("index" , );
	}*/


	// console.log(req.session.user);

	/*if(req.session.user.session_id){
		res.send("<h1>Welcome "+req.session.user.name+"</h1>");
	}else{
		res.render("index" , { "number" : 12 });
	}*/

	res.render("index");

	
	
});

module.exports = router;