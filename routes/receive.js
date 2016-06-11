/*
* content @ /receive/ route will be here.
* time @ 2016.6.8
*/

var express = require("express"),
	logger  = require("morgan"),
	db  = require("../setup");

var router = express.Router();

/* all request of /type will be here. */
router.use(function(req , res , next){
	console.log("type router...");
	/*if(!req.session.user.session_id){
		res.send('<h1>Login First.</h1><a href="/">去登录</a>');
	}else{
		next();
	}*/
	// test 去掉登陆检测
	if(!req.session.user.id){
		req.session.user.id = 1;
	}
	next();
	
});

router.get("/" , function(req , res , next){
	
	res.render("receiving");
	
});




/* api */



module.exports = router;

