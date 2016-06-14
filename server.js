/*
 * take_goods start.
 * time @ 2016.5.21
 * author@Mr.He
*/


var express = require("express"),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	session = require("express-session"),
	db  = require("./setup");



var app = express();

/* 配置express */
app.set("view engine" , "jade");
app.set("views" , __dirname + "/views");

app.use(express.static(__dirname + "/public"));


app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
	"secret":"mysecret",
	"resave":false,
	"saveUninitialized":true,
	"cookie":{ maxAge : 7200000 }
}));


//路劲设置
var viewRoute = require("./routes/view"),
	apiRoute  = require("./routes/api");

app.use(function(req , res , next){
	var user = req.session.user;

	if(!user){
		user = req.session.user = {};
	}

	console.log('%s %s %s' , req.method , req.url , req.path);

	console.log(req.session.user);
	next();
});


/* view 部分 */
app.use("/" , viewRoute);

/* api */
app.use("/api" , apiRoute);


// /* 用户相关 */
// app.use("/user" , userRoute);


// //收获界面
// // Receiving
// app.use("/receive" , receiveRoute);

// //交易查看
// // order

// //类型管理
// app.use("/type" , typeRoute);


// //数据统计






app.listen(3000 , function(){
	console.log("server running");
});
