/*
 * take_goods start.
 * time @ 2016.5.21
 * author@Mr.He
*/

const PORT = process.env.NODE_ENV == "development" ? 3000 : 80;

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
	RedisStore = require("connect-redis")(session);

var app = express();

/* 配置express */
app.set("view engine" , "jade");
app.set("views" , __dirname + "/views");

app.use(express.static(__dirname + "/public"));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
	"name"  : "session_id",
	"secret": "mysecret",
	"resave":false,
	"saveUninitialized":true,
	"cookie":{ 
		maxAge : 7200000 ,
		httpOnly : true
	},
	"store" : new RedisStore({
		"host" : redisConfig.host,
		"port" : redisConfig.port
	})
}));


/* 日志配置，启用 */
log4js.configure();
app.use(log4js.useLog());


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
