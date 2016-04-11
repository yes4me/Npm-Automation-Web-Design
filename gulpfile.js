'use strict';

// =================================================================================================
// Settings
// =================================================================================================

const
  gulp        = require('gulp'),
  gutil       = require('gulp-util'),
  eslint      = require('gulp-eslint'),
  babel       = require('gulp-babel'),
  concat      = require('gulp-concat'),
  duration    = require('gulp-duration'),
  miniHTML    = require('gulp-htmlmin'),
  miniJS      = require('gulp-uglify'),
  miniCSS     = require('gulp-clean-css'),
  miniImg     = require('gulp-imagemin'),
  plumber     = require('gulp-plumber'),
  prefixCSS   = require('gulp-autoprefixer'),
  sass        = require('gulp-sass'),
  sourcemaps  = require('gulp-sourcemaps'),
  stripDebug  = require('gulp-strip-debug'),
  watch       = require('gulp-changed');

const src = {
  html: './src/**/*.html',
  js  : './src/scripts/**/*.js',
  css : './src/styles/**/*.scss',
  img : './src/images/**.*'
};

const dest = {
  html: './build',
  js  : './build/scripts',
  css : './build/style',
  img : './build/images'
};

// =================================================================================================
// Error handling
// =================================================================================================

const onError = function (error) {
  gutil.log(gutil.colors.red(error));
  this.emit('end');
};

// =================================================================================================
// eslint
// =================================================================================================

// configure the eslint task
gulp.task('eslint', function () {
  return gulp.src([
    '**/*.js',
    '!build/./**',
    '!node_modules/./**'
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(duration('task eslint'));
});

// =================================================================================================
// Plug-ins
// =================================================================================================

gulp.task('script', function () {
  return gulp.src(src.js)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(babel())
    .pipe(stripDebug())
    .pipe(concat('main.js'))
    .pipe(miniJS())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.js))
    .pipe(duration('task script'));
});


gulp.task('style', function () {
  return gulp.src(src.css)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass())
    .pipe(prefixCSS('last 2 versions'))
    .pipe(concat('main.css'))
    .pipe(miniCSS())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.css))
    .pipe(duration('task style'));
});


gulp.task('image', function () {
  return gulp.src(src.img)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(miniImg({ progressive: true }))
    .pipe(gulp.dest(dest.img))
    .pipe(duration('task image'));
});


gulp.task('html', function () {
  return gulp.src(src.html)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(miniHTML())
    .pipe(gulp.dest(dest.html))
  .pipe(duration('task html'));
});

// =================================================================================================
// Others
// =================================================================================================

// watch for code changes, and update on the fly
gulp.task('server', ['script', 'style', 'image', 'html'], function () {
  gulp.watch(src.js, ['eslint', 'scripts']);
  gulp.watch(src.css, ['style']);
  gulp.watch(src.img, ['image']);
  gulp.watch(src.html, ['html']);
});


// create a default task and just log a message
gulp.task('default', function () {
  // Run: gulp
  // Run: gulp --env=prod
  return gutil.env.env === 'prod' ?
    gutil.log('Gulp is running in Prod!') : gutil.log('Gulp is running!');
});
