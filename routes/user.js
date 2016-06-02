/*
 * content @ 用户相关操作，登陆，注册
 * time @ 2016.5.23
*/

var express = require("express"),
	logger  = require("morgan"),
	db  = require("../setup");

var router = express.Router();


/* all /user  request  will be here.  */

router.use(function(req , res , next){
	console.log("%s %s %s" , req.method , req.url , req.path);
	next();
});



/* 退出接口 */
router.get("/loginout" , function( req , res , next ){
	res.cookie("session_id" , null , 0);
	req.session.user = {};
	res.redirect("/");
});







/* ========== /user/api/  接口部分 ========== */




/* request user/api/login */
router.post("/api/login" , function(req , res , next){
	console.log("post enter");
	if(req.body.phone && req.body.password){
		
		//逻辑应该是，先查找phone，是否已经注册了，然后看密码是否正确。
		db.User.findOne({
			"where" : {
				"phone" : req.body.phone,
			}
		}).then(function(result){

			if(result == null){
				//not the person.
				res.json({"state":0 , "msg":"该手机号没有注册"});
			}else{
				var data = result.dataValues;

				//the password shuold be encrypted.
				if(data.password == req.body.password){
					
					//设置session中的数据
					req.session.user.name = data.name;
					req.session.user.phone= data.phone;
					req.session.user.id   = data.id;
					req.session.user.session_id = req.sessionID;
					res.cookie("session_id" , req.sessionID);

					res.json({"state":1, "msg" : "login Success" , "data":data});
				}else{
					res.json({"state":0, "msg":"密码不正确"});
				}
			}

			next();
		});
	}else{
		res.send({"state":0 , "msg":"手机号，密码不正确"});
		next();
	}
});







// router.get("/login" , function(req , res , next){
// 	console.log(req.session.user);
// 	if(req.session.user.session_id){
// 		res.send("<h1>Welcome "+req.session.user.name+"</h1>");
// 	}else{
// 		res.redirect("/");
// 	}
// });


// /* 手机号码，密码登录 */
// router.post("/login" , function(req , res , next){
// 	/*res.cookie('phoneNumber', req.body.phone, { maxAge: 100000 });*/

// 	if(req.session.user.session_id){
// 		console.log('have -----');
// 		res.send("<h1>Welcome "+req.session.user.name+"</h1>");
// 	}else{
// 		console.log('not have ------');
// 		db.User.findOne({
// 			"where" : {
// 				"phone" : req.body.phone,
// 				"password": req.body.password
// 			}
// 		}).then(function(project){
// 			if(project !== null){
// 				// console.log(project);
// 				// console.log(project.dataValues);
// 				var data = project.dataValues;

// 				req.session.user.name = data.name;
// 				req.session.user.phone= data.phone;
// 				req.session.user.id   = data.id;
// 				req.session.user.session_id = req.sessionID;
// 				res.cookie("session_id" , req.sessionID);

// 				// res.send("<h1>Welcome "+req.session.user.name+"</h1>");
// 				res.send({"name":req.session.user.name});

// 				// res.send(project.dataValues);
// 				//记录登录状态，保存session
// 			}else{
// 				res.send("not the person");
// 				console.log("not the person");
// 				next();
// 			}
			
// 		});
// 	}

// });


module.exports = router;

