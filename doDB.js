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
		return callback(result);
	})
};

var UserObj = new User();

/* 类型表操作 */
function Type(){

}

Type.prototype.findAll = function(options , callback){
	db.Type.findAndCountAll({
		"where" : {
			"u_id" : options.u_id,
			"state": 1
		},
		"order" : [
			["id" , "DESC"]
		]
	}).then(function(result){
		return callback(result);
	});
}

Type.prototype.insert = function(options , callback){
	db.Type.build({
		"name" : options.name,
		"price": options.price,
		"u_id" : options.u_id
	}).save().then(function(result){
		return callback(result);
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
		return callback(result);
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
		return callback(result);
	});
}

var TypeObj = new Type();

/* order表操作 */
function Order (){

}

Order.prototype.add = function(options , callback){
	db.Order.build(options).save().then(function(result){
		return callback(result);
	});
}

var OrderObj = new Order();

/* goods表操作 */
function Goods (){

}

Goods.prototype.add = function(data , callback){
	if(data instanceof Array){
		//add an array.
		db.Goods.bulkCreate(data).then(function(result){
			return callback(result);
		});
	}else if(data instanceof Object){
		db.Goods.build(data).save().then(function(result){
			return callback(result);
		});
	}else{
		return callback(null);
	}
}	

var GoodsObj = new Goods();



module.exports = {
	"User" : UserObj,
	"Type" : TypeObj,
	"Order": OrderObj,
	"Goods": GoodsObj
}




