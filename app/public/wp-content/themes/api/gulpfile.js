const gulp         = require('gulp');
const sourcemaps   = require('gulp-sourcemaps');
const scss         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack      = require('webpack-stream');
const config       = require('./webpack.config.js');

var paths = {
  scripts: ['./dev/js/**/*.js'],
  styles: ['./dev/scss/**/*.scss']
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(webpack(config))
    .pipe(gulp.dest('./js'));
});

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', ['scripts', 'styles'], function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles, ['styles']);
});

gulp.task('default', ['watch']);
