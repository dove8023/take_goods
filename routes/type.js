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
	if(!req.session.user.session_id){
		res.send('<h1>Login First.</h1><a href="/">去登录</a>');
	}
	next();
});

router.get("/" , function(req , res , next){
	
	res.render("type/index");
	
});

/* /type/api/list */
router.get("/api/list" , function(req , res , next){
	db.Type.findAll({
		"where" : {
			"u_id" : req.session.user.id
		}
	}).then(function(result){
		res.json({
			"state" : 0,
			"msg"   : "ok",
			"data"  : result
		});
	});
});

router.get("/api/add" , function(req , res , next){
	db.Type.build({ "u_id" : 1 , "name":"一级铁" , "price":1.2 }).save();
});




module.exports = router;


