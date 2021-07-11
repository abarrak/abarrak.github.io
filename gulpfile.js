const { series, src, pipe, dest } = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var rename = require('gulp-rename');


function styles(_cb) {
  src(["../abarrak.github.io/public/css/*.css", "public/css/*.min.css"])
    .pipe(concatCss("public/css/all.css"))
    .pipe(rename('all.min.css'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(dest('../abarrak.github.io/public/css'));
  _cb();
}

function scripts(_cb) {
  src(["public/js/blog.js"])
    .pipe(concat('all.js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(dest("../abarrak.github.io/public/js"));
  _cb();
}

function printSucces(_cb) {
  console.log("\n... Processing Assets Done ! ...\n");
  _cb();
}

exports.default = series(styles, scripts, printSucces);
exports.build = exports.default;
