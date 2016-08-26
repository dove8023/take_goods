/*
 * take_goods start.
 * time @ 2016.5.21
 * author@Mr.He
*/


var express = require("express"),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	session = require("express-session"),
	db  = require("./setup"),
	favicon = require('serve-favicon'),
	path = require("path"),
	log4js = require("./log");
	// RedisStore = require("connect-redis")(session);

var app = express();

/* 配置express */
app.set("view engine" , "jade");
app.set("views" , __dirname + "/views");

app.use(express.static(__dirname + "/public"));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
	"secret":"mysecret",
	"resave":false,
	"saveUninitialized":true,
	"cookie":{ maxAge : 7200000 }
}));


/* 日志配置，启用 */
log4js.configure();

app.use(log4js.useLog());





//路劲设置
var viewRoute = require("./routes/view"),
	apiRoute  = require("./routes/api");

app.use(function(req , res , next){
	var user = req.session.user;

	if(!user){
		user = req.session.user = {};
	}

	// console.log('%s %s %s' , req.method , req.url , req.path);
	// logger.info(req.method);
	// console.log(req.method);
	// console.log(req.session.user);
	next();
});

/* view 部分 */
app.use("/" , viewRoute);

/* api */
app.use("/api" , apiRoute);



app.listen(3000 , function(){
	console.log("server running");
});
