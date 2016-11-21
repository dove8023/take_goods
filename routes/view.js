/*
 * content @ all view request.
 * time @ 2016.6.8
 * author@ Mr.He
*/

var express = require("express"),
	logger  = require("morgan");

var router = express.Router();


/* need login page. */

router.use(function(req , res , next){
	if(!req.session.user && req.path != "/api/login"){
		res.render("login");
	}else{
		next();
	}
});

/* center page. */
router.all("/" , function(req , res , next){
	res.render("index");
});




/* ========== no longer use. =========== */


// /* type page. */
// router.get("/type/" , function(req , res , next){
// 	res.render("type");
// });

// /* receive page. */
// router.get("/receive" , function(req , res , next){
// 	res.render("receiving");
// });

// /* order check page. */
// router.get("/order" , function(req , res , next){
// 	res.render("order");
// });

// /* stats page. */
// router.get("/stats" , function(req , res , next){
// 	res.render("stats");
// });


module.exports = router;

