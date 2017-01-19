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
   gulp.src(["../abarrak.github.io/public/css/*.css", "public/css/*.min.css"])
        .pipe(concatCss("public/css/all.css"))
        .pipe(rename('all.min.css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('scripts', function() {
    return gulp.src(["public/js/blog.js"])
        .pipe(concat('all.js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("public/js"));
});
