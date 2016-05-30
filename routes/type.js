/*
* content @ /type/ route will be here.
* time @ 2016.5.25
*/

var express = require("express"),
	logger  = require("morgan"),
	db  = require("../setup");

var router = express.Router();



/* all request of /type will be here. */
router.use(function(req , res , next){
	console.log("type router...");
	console.log('%s %s %s' , req.method , req.url , req.path);
	next();
});

router.get("/" , function(req , res , next){

	if(req.session.user.session_id){
		res.render("type/index");
	}else{
		res.send('<h1>Login First.</h1><a href="/">去登录</a>');
	}
});

module.exports = router;