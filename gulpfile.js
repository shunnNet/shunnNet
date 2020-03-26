var fs = require("fs")
var gulp = require("gulp");
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var $ = require("gulp-load-plugins")();
var lostgrid = require("lost")
/*
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var pug = require('gulp-pug');
var data = require('gulp-data'); //https://www.npmjs.com/package/gulp-data
*/
var babel_option = [
    "@babel/env", {
        "targets": {
            "browsers": "ie 10"
        },
        "useBuiltIns": "usage",
        "corejs" : 3      // needed when useBuiltInd : "usage"
    }
]


gulp.task("copyHTML",copyHTML);
gulp.task('pug', compilePug);
gulp.task("css",css)
gulp.task('babel', babel);
gulp.task('Obabel', Obabel);
gulp.task('watch', watch)

// call cb if you didn't return something in task function
// in gulp , all function is async , no support to sync function

function watch(cb){
    const series = gulp.series(copyHTML,compilePug,babel);
    gulp.watch("./source/*.pug",series)
    // watch second param need task function or function list generate by series() or parellel()
}

function Obabel(cb) {
        // set up the browserify instance on a task basis
        var b = browserify({
          entries: './source/test.js',
          debug: true,
          // defining transforms here will avoid crashing your stream
          
        }).transform("babelify", {presets: [babel_option]} );
      
        return b.bundle()
          .pipe(source('./all.js'))
          .pipe(buffer())
          .pipe($.sourcemaps.init({loadMaps: true}))
              // Add transformation tasks to the pipeline here.
          .pipe($.uglify())
          .pipe($.sourcemaps.write('./'))
          .pipe(gulp.dest('./public/'));
          
    
}

function babel(cb) {
    gulp.src('./source/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: [
                babel_option
            ]
        }))
        .pipe($.concat('all.js'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/'))
    cb()
}



function css(cb){
    gulp.src('./public/*.css')
        .pipe($.postcss([lostgrid()])) // lostgrid need to use special css property1
        .pipe(gulp.dest('./public/'));
    cb();
}

function lostgrid(cb) {
    
}

function copyHTML(cb){
    return gulp.src("./source/*.html")
               //.pipe($.plumber())
               .pipe(gulp.dest("./public/"))
}

function compilePug(cb){
    return gulp.src('./source/*.pug')
                //.pipe($.plumber())
                .pipe($.data(function(file) {
                    return JSON.parse(fs.readFileSync('./model/data.json')); //fs.readFileSync('./examples/' + path.basename(file.path) + '.json')
                }))
                .pipe($.pug({
                    pretty : true
                    // true to compile no minify html  , other option : https://pugjs.org/api/reference.html && https://www.npmjs.com/package/gulp-pug
                }))
                .pipe(gulp.dest("./public/"))

}