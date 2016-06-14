/*
 * content @ all view request.
 * time @ 2016.6.8
 * author@ Mr.He
*/

var express = require("express"),
	logger  = require("morgan");

var router = express.Router();

router.get("/" , function(req , res , next){
	res.render("index");
});

/* need login page. */

router.use(function(req , res , next){
	/*if(!req.session.user.session_id){
		res.send('<h1>Login First.</h1><a href="/">去登录</a>');
	}else{
		next();
	}*/

	// test 去掉登陆检测
	if(!req.session.user.id){
		req.session.user.id = 1;
		req.session.user.name = "master";
	}
	next();
});

/* type page. */
router.get("/type/" , function(req , res , next){
	res.render("type/index");
});

/* receive page. */
router.get("/receive" , function(req , res , next){
	res.render("receiving");
});







module.exports = router;






