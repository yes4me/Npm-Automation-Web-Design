'use strict';

// =================================================================================================
// Settings
// =================================================================================================

const
  gulp        = require('gulp'),
  gutil       = require('gulp-util'),
  eslint      = require('gulp-eslint'),
  babel       = require('gulp-babel'),
  prefixCSS   = require('gulp-autoprefixer'),
  concat      = require('gulp-concat'),
  inject      = require('gulp-inject'),
  miniHTML    = require('gulp-htmlmin'),
  miniJS      = require('gulp-uglify'),
  miniCSS     = require('gulp-clean-css'),
  miniImg     = require('gulp-imagemin'),
  plumber     = require('gulp-plumber'),
  sass        = require('gulp-sass'),
  sourcemaps  = require('gulp-sourcemaps'),
  stripDebug  = require('gulp-strip-debug'),
  watch       = require('gulp-changed');

const src = {
  html  : "./src/**/*.html",
  js    : "./src/scripts/**/*.js",
  css   : "./src/styles/**/*.scss",
  img   : "./src/images/**.*"
}

const dest = {
  html  : "./build",
  js    : "./build/scripts",
  css   : "./build/style",
  img   : "./build/images"
}

// =================================================================================================
// Error handling
// =================================================================================================

var onError = function(err) {
  console.log(err);
  this.emit('end');
}

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
  .pipe(eslint.format());
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
    .pipe(concat('script.js'))
    .pipe(miniJS())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.js));
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
    .pipe(gulp.dest(dest.css));
});


gulp.task('image', function () {
  return gulp.src(src.img)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(miniImg({ progressive: true }))
    .pipe(gulp.dest(dest.img));
});


gulp.task('htmlpage', function () {
  return gulp.src(src.html)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(inject(gulp.src([src.css]), {name: 'styles'}))
    .pipe(inject(gulp.src([src.js]), {name: 'scripts'}))
    //.pipe(miniHTML())
    .pipe(gulp.dest(dest.html));
});

// =================================================================================================
// Others
// =================================================================================================

// watch for code changes, and update on the fly
gulp.task('compact', ['script', 'style', 'image', 'htmlpage'], function () {
  gulp.watch(src.js, ['eslint', 'scripts']);
  gulp.watch(src.css, ['style']);
  gulp.watch(src.img, ['image']);
  gulp.watch(src.html, ['htmlpage']);
});


// create a default task and just log a message
gulp.task('default', function () {
  // Run: gulp
  // Run: gulp --env=prod
  return gutil.env.env === 'prod' ?
    gutil.log('Gulp is running in Prod!') : gutil.log('Gulp is running!');
});