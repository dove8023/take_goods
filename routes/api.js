/*
 * content @ all /api request.
 * time @ 2016.6.14
 * author@ Mr.He
*/

var express = require("express"),
	logger  = require("morgan"),
	db  = require("../doDB");

var router = express.Router();


/* 退出接口 */
router.get("/loginout" , function( req , res , next ){
	res.cookie("session_id" , null , 0);
	req.session.user = {};
	res.redirect("/");
});

/* 登陆检查 */
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

/* 登陆请求 */
router.post("/login" , function(req , res , next){
	if(!req.body.phone || !req.body.password){
		res.send({"state":0 , "msg":"手机号，密码不正确"});
		next();
	}
	db.User.findOne({"phone":req.body.phone} , function(result){
		if(!result){
			res.json({"state":0 , "msg":"该手机号没有注册"});
			next();
		}
		if(result.password != req.body.password){
			res.json({"state":0 , "msg":"密码不正确"});
			next();
		}
		//设置session中的数据
		req.session.user.name = result.name;
		req.session.user.phone= result.phone;
		req.session.user.id   = result.id;
		req.session.user.session_id = req.sessionID;
		res.cookie("session_id" , req.sessionID , { maxAge : 7200000 });
		res.json({"state":1, "msg" : "login Success" , "data":result});
	});
});

/* =================== 类型相关请求 ============== */

/* 获取类型列表 */
router.get("/type/list" , function(req , res , next){
	/* 暂时取消分页查询 */
	db.Type.findAll({
		"u_id" : req.session.user.id
	} , function(result){
		res.json({
			"state" : 1,
			"msg"   : "查询成功",
			"data"  : result
		})
	});
});

/* 添加类型 */
router.post("/type/add" , function(req , res , next){
	if(!req.body.name || !req.body.price){
		res.json({
			"state" : 0,
			"msg"   : "参数不正确"
		});
		return;
	}
	db.Type.insert({
		"name" :req.body.name,
		"price":req.body.price,
		"u_id" : req.session.user.id
	} , function(result){
		res.json({
			"state" : 1,
			"msg"   : "类型添加成功",
			"data"  : result
		});
	});
});

/* 修改类型 */
router.post("/type/update" , function(req , res , next){
	if(!req.body.name || !req.body.price || !req.body.id){
		res.json({
			"state" : 0,
			"msg"   : "参数不正确"
		});
		return;
	}

	db.Type.update({
		"name":req.body.name,
		"price":req.body.price,
		"id"   : req.body.id
	} , function(result){
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

/* 删除一个类型 */
// set this note's state to 0.
router.post("/type/delete" , function(req , res , next){
	if(!req.body.id){
		res.json({
			"state" : 0,
			"msg"   : "参数不正确"
		});
		return;
	}
	db.Type.delete({
		"id"   : req.body.id
	} , function(result){
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


/* =================== 收货相关请求 ============== */
/* 保存订单 */
router.post("/receive/addorder" , function(req , res , next){
	try{
		req.body = JSON.parse(req.body.data);
		// console.log()
	}catch(e){
		res.json({"state": 0 , "msg":"参数不对"});
		next();
	}
	if(!req.body.total || !req.body.seller){
		res.json({"state": 0 , "msg":"参数不对"});
		return;
	}

	db.Order.add({
		"total" : req.body.total,
		"seller": req.body.seller,
		"operator": req.session.user.name,
		"comment" : req.body.comment,
		"u_id"  : req.session.user.id
	} , function(result){
		if(!result.id){
			res.json({
				"state" : 0,
				"msg"   : "订单添加失败",
			});
			return;
		}
		var order_id = result.id;
		//订单添加成功，保存货物数据
		if(!req.body.rows.length){
			res.json({
				"state" : 1,
				"msg"   : "add success but not goods",
				"data"	: result
			});
			return;
		}

		//整理货物数据
		for(var i=0,len=req.body.rows.length;i<len;i++){
			//以后添加数据格式检查
			var data = req.body.rows[i];
			data.u_id = req.session.user.id;
			data.o_id = result.id;
			data.operator = req.session.user.name;
			data.seller = req.body.seller;
		}
		db.Goods.add(req.body.rows , function(result){
			res.json({
				"state" : 1,
				"msg"   : "add success",
				"data"  : {
					"order_id" : order_id,
					"goods_data": result
				}
			});
		});
	});

});




module.exports = router;







