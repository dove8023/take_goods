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
		req.session.user.name = "master";
	}
	next();
	
});

router.get("/" , function(req , res , next){
	
	res.render("receiving");
	
});




/* api */

/**
 * 订单表orders 操作
 * time @ 2016.6.12
*/

//添加
router.post("/addorder" , function(req , res , next){

	try{
		req.body.data = JSON.parse(req.body.data);
	}catch(e){
	}
	req.body = req.body.data;

	if(!req.body.total || !req.body.seller){
		res.json({
			"state" : 0,
			"msg"   : "参数不对"
		});
		return;
	}

	db.Order.build({
		"total" : req.body.total,
		"seller": req.body.seller,
		"operator": req.session.user.name,
		"comment" : req.body.comment,
		"u_id"  : req.session.user.id
	}).save().then(function(result){
		// console.log(result.id);
		if(!result.id){
			res.json({
				"state" : 0,
				"msg"   : "add fail",
			});
			return;
		}

		if(!req.body.rows.length){
			res.json({
				"state" : 1,
				"msg"   : "add success but not goods",
				"data"	: result
			});
			return;
		}

		for(var i=0,len=req.body.rows.length;i<len;i++){
			//以后添加数据格式检查

			var data = req.body.rows[i];
			data.u_id = req.session.user.id;
			data.o_id = result.id;
			data.operator = req.session.user.name;
			data.seller = req.body.seller;
		}

		// console.log(req.body.rows);
		//add in goods table.
		db.Goods.bulkCreate(req.body.rows).then(function(result){
			res.json({
				"state" : 1,
				"msg"   : "add success",
				"data"  : result
			});
			next();
		});
	});
});

//依据订单id查询数据
router.get("/select/:id" , function(req , res , next){
	var ID = req.params.id;
	if(ID && ID.toString().replace(/\D/g,"")){
		ID = ID.toString().replace(/\D/g,"");
	}else{
		res.json({
			"state" : 0,
			"msg"   : "参数不对",
		});
		return;
	}

	db.Order.findOne({
		"where" : {
			"id" : req.params.id,
			"u_id": req.session.user.id
		}
	}).then(function(result){
		res.json({
			"state" : 1,
			"msg"   : "查询成功",
			"data"  : result
		});
		next();
	});
});



module.exports = router;

