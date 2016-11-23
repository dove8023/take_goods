const gulp = require("gulp");
const uglify = require('gulp-uglify');
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const minifyCss = require("gulp-minify-css");
const babel = require("gulp-babel");



// gulp.task("js" , function(){
//     return gulp.src("./js/**/*.js")
//     .pipe(babel({
//         "presets" : ["es2015"]
//     }))
//     .pipe(concat("app.js"))
//     .pipe(gulp.dest("build"))
//     .pipe(uglify())
//     .pipe(rename({ extname: ".min.js" }))
//     .pipe(gulp.dest("build"));
// });

gulp.task("css" , function(){
    return gulp.src(["./css/**/*.css" , "./js/libs/bower_components/bootstrap/dist/css/bootstrap.css"])
    .pipe(concat("all.css"))
    .pipe(gulp.dest("build"))
    .pipe(minifyCss())
    .pipe(rename({ extname: ".min.css"}))
    .pipe(gulp.dest("build"));
});



// gulp watch  , 实现热重载
gulp.task("watch" , function(){
    gulp.start("js" , "css");
    // gulp.watch("./js/**/*.js" , ["js"]);
    gulp.watch("./css/**/*.css" , ["css"]);
});








gulp.task("default" , ["css"]);





