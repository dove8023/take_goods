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
	
	res.render("type/index");
	
});

/* 
 *	/type/api/list 
 *  分页，每页10条，传1为第一页 ----->分页暂时不做。
 */

router.get("/api/list" , function(req , res , next){

	if(!req.query.page){
		req.query.page = 1;
	}
	if(!req.query.limit){
		req.query.limit = 100;
	}

	db.Type.findAndCountAll({
		"where" : {
			"u_id" : req.session.user.id,
			"state": 1
		},
		"offset" : (req.query.page-1)*req.query.limit,
		"limit" : req.query.limit,
		"order" : [
			["id" , "DESC"]
		]
	}).then(function(result){
		res.json({
			"state" : 1,
			"msg"   : "ok",
			"data"  : result
		});
	});

});


/* add the one. */
router.post("/api/add" , function(req , res , next){

	if(!req.body.name || !req.body.price){
		res.json({
			"state" : 0,
			"msg"   : "参数不正确"
		});

		return;
	}

	//暂时不做重名检查
	db.Type.build({
		"name" : req.body.name , 
		"price": req.body.price ,
		"u_id" : req.session.user.id
	}).save().then(function(result){

		res.json({
			"state" : 1,
			"msg"   : "add success",
			"data"  : result
		});
		next();
	});
});


/* 
  delete one.
  set the note's state to 0.
 */
router.post("/api/delete" , function(req , res , next){
	if(!req.body.id){
		res.json({
			"state" : 0,
			"msg"   : "请输入ID"
		});
		return;
	}

	db.Type.update(
		{"state" : 0},
		{
			"where" : {
				"id" : req.body.id
			}
		}
	).then(function(result){
		console.log(result);
		if(result[0] === 1){
			res.json({
				"state" : 1,
				"data"  : result
			});
		}else{
			res.json({
				"state" : 0,
				"msg"  : "删除失败，请稍后重试"
			});
		}
	});
});

/* update one. */
router.post("/api/update" , function(req , res , next){
	if(!(req.body.name && req.body.price && req.body.id)){
		res.json({
			"state" : 0,
			"msg"   : "参数不正确"
		});
		return;
	}

	db.Type.update(
		{
			"name" : req.body.name,
			"price": req.body.price
		},
		{
			"where" : {
				"id" : req.body.id
			}
		}
	).then(function(result){
		// console.log(result);
		if(result[0] === 1){
			res.json({
				"state" : 1,
				"data"  : result
			});
		}else{
			res.json({
				"state" : 0,
				"msg"  : "修改失败，请稍后重试"
			});
		}
	});
});




module.exports = router;


