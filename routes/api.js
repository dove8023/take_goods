/*
 * content @ all /api request.
 * time @ 2016.6.14
 * author@ Mr.He
*/

var express = require("express"),
	logger  = require("morgan"),
	db  = require("../mysql/doDB");

var router = express.Router();


/* 退出接口 */
router.get("/loginout" , function( req , res , next ){
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/");
		}
	})
});

/* 登陆请求 */
router.post("/login" , function(req , res , next){
	if(!req.body.phone || !req.body.password){
		res.send({"state":0 , "msg":"手机号，密码不正确"});
		return next && next();
	}
	db.User.findOne({"phone":req.body.phone} , function(result){
		if(!result){
			res.json({"state":0 , "msg":"该手机号没有注册"});
			return next && next();
		}
		if(result.password != req.body.password){
			res.json({"state":0 , "msg":"密码不正确"});
			return next && next();
		}
		req.session.user = {
			"name" : result.name,
			"phone": result.phone,
			"id": result.id
		};

		res.json({"state":1, "msg" : "login Success" , "data":result});
	});
});

/* =================== 类型相关请求 ============== */


let JsonP = (req , res , obj) => {
	if(req.query.callback){
		res.jsonp(obj);
	}else{
		res.json(obj);
	}
}


/* 获取类型列表 */
router.get("/type/list" , function(req , res , next){
	/* 暂时取消分页查询 */
	db.Type.findAll({
		"u_id" : req.session.user.id
	} , function(result){
		JsonP(req , res , {
			"state" : 1,
			"msg"   : "查询成功",
			"data"  : result
		});
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

/* 添加类型 */
router.get("/type/add" , function(req , res , next){
	if(!req.query.name || !req.query.price){
		JsonP(req , res , {
			"state" : 0,
			"msg"   : "参数不正确"
		});
		return;
	}
	db.Type.insert({
		"name" :req.query.name,
		"price":req.query.price,
		"u_id" : req.session.user.id
	} , function(result){
		JsonP(req , res , {
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

/* 修改类型 */
router.get("/type/update" , function(req , res , next){
	if(!req.query.name || !req.query.price || !req.query.id){
		JsonP(req , res , {
			"state" : 0,
			"msg"   : "参数不正确"
		});
		return;
	}

	db.Type.update({
		"name":req.query.name,
		"price":req.query.price,
		"id"   : req.query.id
	} , function(result){
		if(result[0] === 1){
			JsonP(req , res , {
				"state" : 1,
				"data"  : result
			});
		}else{
			JsonP(req , res , {
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

router.get("/type/delete" , function(req , res , next){
	if(!req.query.id){
		JsonP(req , res , {
			"state" : 0,
			"msg"   : "参数不正确"
		});
		return;
	}
	db.Type.delete({
		"id"   : req.query.id
	} , function(result){
		if(result[0] === 1){
			JsonP(req , res , {
				"state" : 1,
				"data"  : result
			});
		}else{
			JsonP(req , res , {
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
	}catch(e){
		res.json({"state": 0 , "msg":"参数不对"});
		return next && next();
	}
	if(!req.body.total || !req.body.seller){
		res.json({"state": 0 , "msg":"参数不对"});
		return;
	}
	if(!req.body.rows.length){
		res.json({"state": 0 , "msg":"没有货物"});
		return;
	}

	if(req.body.id){
		//update
		db.Order.update({
			"total" : req.body.total,
			"seller": req.body.seller,
			"comment" : req.body.comment,
			"id"    : req.body.id
		} , function(result){
			if(!result[0]){
				res.json({
					"state" : 0,
					"msg"   : "订单修改失败",
				});
				return;
			}
			var order_id = req.body.id;

			for(var i=0,len=req.body.rows.length;i<len;i++){
				var data = req.body.rows[i];
				data.u_id = req.session.user.id;
				data.o_id = order_id;
				data.operator = req.session.user.name;
				data.seller = req.body.seller;
				db.Goods.upsert(data);
			}
			
			res.json({
				"state" : 1,
				"msg"   : "修改成功",
				"data"  : {
					"order_id" : order_id,
				}
			});
		});
	}else{
		//add new one.
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
			insertGoods(req , res , req.body.rows , order_id);
			res.json({
				"state" : 1,
				"msg"   : "add success",
				"data"  : {
					"order_id" : order_id,
				}
			});
		});
	}
});

function insertGoods (req , res , arr , order_id){
	//整理货物数据
	for(var i=0,len=req.body.rows.length;i<len;i++){
		//以后添加数据格式检查
		var data = req.body.rows[i];
		data.u_id = req.session.user.id;
		data.o_id = order_id;
		data.operator = req.session.user.name;
		data.seller = req.body.seller;
	}

	//保存货物数据
	db.Goods.add(arr);
}

/* 查询单个订单信息，返回订单数据和对应的货物数据 */
router.get("/receive/select/:id" , function(req , res , next){
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

	/* 多个异步事件的统一处理 */
	db.Order.select({
		"id" : ID,
		"u_id": req.session.user.id
	} , function(result){
		if(!result){
			res.json({
				"state" : 0,
				"msg"   : "没有这条记录",
				"data"  : result
			});
			return;
		}
		db.Goods.select({
			"o_id" : ID,
			"limit": 1000
		} , function(result2){
			res.json({
				"state" : 1,
				"msg"   : "单条记录查询成功",
				"data"  : result,
				"goodsData" : result2
			});
		});
	});
});

/* 写入默认的页码和页数 */
function DefaultPageLimit(req){
	req.body.limit /= 1;
	req.body.page  /= 1;
	if(!req.body.limit){
		req.body.limit = 20;
	}
	if(!req.body.page){
		req.body.page = 1;
	}
}

router.post("/receive/list" , function(req , res , next){
	if(!req.body.begin || !req.body.end){
		res.json({
			"state" : 0,
			"msg"   : "没有时间参数"
		});
		return next && next();
	}

	DefaultPageLimit(req);

	db.Order.selectByTime({
		"u_id" : req.session.user.id,
		"begin": req.body.begin,
		"end"  : req.body.end,
		"limit": req.body.limit,
		"page" : req.body.page
	} , function(result){
		res.json({
			"state" : 1,
			"msg"   : "查询成功",
			"data"  : result
		})
	});
});

/* ========= goods表相关请求 ========= */
router.post("/goods/delete/:id" , function(req , res , next){
	if(!req.params.id){
		res.json({
			"state" : 0,
			"msg"   : "删除失败，没有ID"
		});
		return next && next();
	}
	db.Goods.delete({
		"id" : req.params.id
	} , function(result){
		if(result[0] == 1){
			res.json({
				"state" : 1,
				"msg"   : "删除成功"
			});
		}else{
			res.json({
				"state" : 0,
				"msg"   : "没有找到这条记录"
			});
		}
		
	});
});

/* 返回某一个时间段的所有货物数据 */
router.post("/stats" , function(req , res , next){
	if(!req.body.begin || !req.body.end){
		res.json({
			"state" : 0,
			"msg"   : "时间参数不正确"
		});
	}
	//get the type list.
	/* 暂时取消分页查询 */
	db.Goods.selectByTime({
		"u_id" : req.session.user.id,
		"begin": req.body.begin,
		"end"  : req.body.end
	} , function(result){
		/*var index = {},  //记录类型数据对应的位置
			Data  = [];
		for(var i=0,len=result.rows.length;i<len;i++){
			var obj = {};
			obj.type_id = result.rows[i].id;
			obj.type_name=result.rows[i].name;
			obj.goodsData = [];
			Data.push(obj);
			index['tid_'+obj.type_id] = i;
		}*/


		res.json({
			"state" : 1,
			"msg"   : "查询成功",
			"data"  : result,
		})
	});

});


/* 返回某一年中某一类型的所有数据 */
router.post("/stats/type" , function(req , res , next){
	if(!req.body.year || !req.body.typeid){
		res.json({
			"state" : 0,
			"msg"   : "时间参数不正确"
		});
	}

	db.Goods.selectByTime({
		"u_id" : req.session.user.id,
		"begin": req.body.year.toString(),
		"end"  : (req.body.year/1 + 1).toString(),
		"typeid": req.body.typeid
	} , function(result){
		res.json({
			"state" : 1,
			"msg"   : "查询成功",
			"data"  : result,
		})
	});
});



module.exports = router;







