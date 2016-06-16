var db  = require("./setup");

/* 参数检查 */



/* 用户表操作 */
function User(){

}

/* options 为查询参数, callback 查询回调 */
User.prototype.findOne = function(options , callback) {
	db.User.findOne({
		"where" : {
			"phone" : options.phone
		}
	}).then(function(result){
		return callback && callback(result);
	})
};

var UserObj = new User();

/* 类型表操作 */
function Type(){

}

Type.prototype.findAll = function(options , callback){
	if(!options.page){
		options.page = 1; //默认第一页
	}
	if(!options.limit){
		options.limit = 1000; //默认每页1000条
	}
	db.Type.findAndCountAll({
		"where" : {
			"u_id" : options.u_id,
			"state": 1
		},
		"offset" : (options.page - 1)*options.limit,
		"limit"  : options.limit,
		"order" : [
			["id" , "DESC"]
		]
	}).then(function(result){
		return callback && callback(result);
	});
}

Type.prototype.insert = function(options , callback){
	db.Type.build({
		"name" : options.name,
		"price": options.price,
		"u_id" : options.u_id
	}).save().then(function(result){
		return callback && callback(result);
	})
}

Type.prototype.update = function(options , callback){
	db.Type.update({
		"name" :options.name,
		"price":options.price
	},{
		"where" : {
			"id" : options.id
		}
	}).then(function(result){
		return callback && callback(result);
	})
}

Type.prototype.delete = function(options , callback){
	db.Type.update(
		{"state" : 0},
		{
			"where" : {
				"id" : options.id
			}
		}
	).then(function(result){
		return callback && callback(result);
	});
}

var TypeObj = new Type();

/* order表操作 */
function Order (){

}

Order.prototype.add = function(options , callback){
	db.Order.build(options).save().then(function(result){
		return callback && callback(result);
	});
}

Order.prototype.update = function(options , callback){
	db.Order.update(options,{
		"where" : {
			"id" : options.id
		}
	}).then(function(result){
		return callback && callback(result);
	});
}

//传入id，查询一条数据，否则查询所有数据
Order.prototype.select = function(options , callback){
	if(options.id){
		db.Order.findOne({
			"where" : {
				"u_id" : options.u_id,
				"id"   : options.id,
				"state": 1
			}
		}).then(function(result){
			return callback && callback(result);
		});
	}else{
		if(!options.page){
			options.page = 1; //默认第一页
		}
		if(!options.limit){
			options.limit = 1000; //默认每页1000条
		}
		db.Order.findAndCountAll({
			"where" : {
				"u_id" : options.u_id,
				"state": 1
			},
			"offset" : (options.page - 1)*options.limit,
			"limit"  : options.limit,
			"order" : [
				["id" , "DESC"]
			]
		}).then(function(result){
			return callback && callback(result);
		});
	}
}

var OrderObj = new Order();

/* goods表操作 */
function Goods (){

}

Goods.prototype.add = function(data , callback){
	if(data instanceof Array){
		//add an array.
		db.Goods.bulkCreate(data).then(function(result){
			return callback && callback(result);
		});
	}else if(data instanceof Object){
		db.Goods.build(data).save().then(function(result){
			return callback && callback(result);
		});
	}else{
		return callback(null);
	}
}

/* data only object. */
Goods.prototype.upsert = function(options , callback){
	db.Goods.upsert(options,{
		"where" : {
			"id" : options.id
		}
	}).then(function(result){
		return callback && callback(result);
	})
}

Goods.prototype.select = function(options , callback){
	if(options.id){
		db.Goods.findOne({
			"where" : {
				"o_id" : options.o_id,
				"id"   : options.id,
				"state": 1
			}
		}).then(function(result){
			return callback && callback(result);
		});
	}else{
		if(!options.page){
			options.page = 1; //默认第一页
		}
		if(!options.limit){
			options.limit = 1000; //默认每页1000条
		}
		db.Goods.findAndCountAll({
			"where" : {
				"o_id" : options.o_id,
				"state": 1
			},
			"offset" : (options.page - 1)*options.limit,
			"limit"  : options.limit,
			"order" : [
				["id" , "ASC"]
			]
		}).then(function(result){
			return callback && callback(result);
		});
	}
}


Goods.prototype.delete = function(options , callback){
	db.Goods.update({
		"state" : 0
	} , {
		"where" : {
			"id" : options.id
		}
	}).then(function(result){
		return callback && callback(result);
	});
}

var GoodsObj = new Goods();



module.exports = {
	"User" : UserObj,
	"Type" : TypeObj,
	"Order": OrderObj,
	"Goods": GoodsObj
}




