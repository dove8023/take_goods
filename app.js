/*
 * take_goods start.
 * time @ 2016.5.21
 * author@Mr.He
*/

// const PORT = process.env.NODE_ENV == "development" ? 3000 : 80;
const PORT = 3000;  //using nginx proxy.
var express      = require("express"),
	bodyParser   = require("body-parser"),
	cookieParser = require("cookie-parser"),
	redis        = require("redis"),
	redisConfig  = require("./db/redis.json"),
	session      = require("express-session"),
	db           = require("./mysql/setup"),
	favicon      = require('serve-favicon'),
	path         = require("path"),
	log4js       = require("./log"),
	RedisStore   = require("connect-redis")(session),
	ejs 		 = require("ejs");
var logger = require('morgan');



var app = express();
var client = new RedisStore(redisConfig);
client.on("connect" , function(){
	console.log("redis connect");
})

/* 配置express */
app.engine("html" , ejs.renderFile);
app.set("view engine" , "html");

app.set("views" , __dirname + "/views");

app.use(express.static(__dirname + "/static"));
app.use(favicon(path.join(__dirname, '/static/images', 'favicon.ico')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
	"name"  : "session_id",
	"secret": "mysecret",
	"resave":true,       //每获进行一次请求，就从写一次，只要一直请求一直不会过期
	"saveUninitialized":true,  //对链接进来的所有客户端创建session
	"cookie":{ 
		maxAge : 7200000 ,
		httpOnly : true
	},
	"store" : client
}));


/* 日志配置，启用 */
/*log4js.configure();
app.use(log4js.useLog());*/



app.use(logger("dev"));


//路劲设置
var viewRoute = require("./routes/view"),
	apiRoute  = require("./routes/api");




/* view 部分 */
app.use("/" , viewRoute);

/* api */
app.use("/api" , apiRoute);

app.listen(PORT , function(){
	console.log("server running");
});
