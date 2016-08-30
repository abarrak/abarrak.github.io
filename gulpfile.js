var gulp      = require('gulp');
var concat    = require('gulp-concat');
var uglify    = require('gulp-uglify');
var cleanCSS  = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var rename    = require('gulp-rename');  

gulp.task('default', ['styles', 'scripts'], function() {
    console.log("\n... Processing Assets Done ! ...\n");
});

gulp.task('styles', function() {
   gulp.src("public/css/*.css")
        .pipe(concatCss("styles/all.css"))
        .pipe(rename('all.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/'));
});

gulp.task('scripts', function() {  
    return gulp.src("public/js/*.js")
        .pipe(concat('all.js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())        
        .pipe(gulp.dest("public/"));
});
