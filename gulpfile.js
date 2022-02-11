const { series, src, pipe, dest } = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var rename = require('gulp-rename');
var rtlcss = require('gulp-rtlcss');
var del = require('del');

function clean(_cb) {
  del(['public/css/all.min.css', 'all.rtl.min.css']);
  _cb();
}

function styles(_cb) {
  src(["public/css/*.css", "public/css/*.min.css"])
    .pipe(concatCss("public/css/all.css"))
    .pipe(rename('all.min.css'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(dest('public/css'))
  _cb();
}

function stylesAr(_cb) {
  src(["public/css/*.css", "public/css/*.min.css"])
    .pipe(concatCss("public/css/all.css"))
    .pipe(rtlcss())
    .pipe(rename('all.rtl.min.css'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(dest('public/css'))
  _cb();
}

function scripts(_cb) {
  src(["public/js/blog.js"])
    .pipe(concat('all.js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(dest("public/js"));
  _cb();
}

function printSucces(_cb) {
  console.log("\n... Processing Assets Done ! ...\n");
  _cb();
}


exports.default = series(clean, styles, stylesAr, scripts, printSucces);
exports.build = exports.default;
