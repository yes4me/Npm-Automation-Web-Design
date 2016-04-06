'use strict';

// =================================================================================================
// include Gulp
// =================================================================================================

const gulp  = require('gulp'),
  gutil     = require('gulp-util'),
  eslint    = require('gulp-eslint'),
  babel     = require('gulp-babel');

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
// Web plug-ins
// =================================================================================================

const imagemin = require('gulp-imagemin'),
  changed     = require('gulp-changed'),
  minifyHTML  = require('gulp-htmlmin'),
  concat      = require('gulp-concat'),
  stripDebug  = require('gulp-strip-debug'),
  uglify      = require('gulp-uglify'),
  sass        = require('gulp-sass'),
  autoprefix  = require('gulp-autoprefixer'),
  minifyCSS   = require('gulp-clean-css'),
  browserSync = require('browser-sync');


// minify new images
gulp.task('image', function () {
  const imgSrc = './src/images/**/*',
    imgDst = './build/images';

  return gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest(imgDst))
    .pipe(browserSync.reload({ stream: true }));
});


// minify new or changed HTML pages
gulp.task('htmlpage', function () {
  const htmlSrc = './src/*.html',
    htmlDst = './build';

  return gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst))
    .pipe(browserSync.reload({ stream: true }));
});


// JS concat, strip debugging and minify
gulp.task('scripts', function () {
  return gulp.src(['./src/scripts/lib.js', './src/scripts/*.js'])
    .pipe(babel())
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./build/scripts/'))
    .pipe(browserSync.reload({ stream: true }));
});


// CSS concat, auto-prefix and minify
gulp.task('styles', function () {
  return gulp.src(['./src/styles/*.scss'])
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/styles/'))
    .pipe(browserSync.reload({ stream: true }));
});


// default gulp task
gulp.task('compact', ['image', 'htmlpage', 'scripts', 'styles'], function () {
  // watch for images changes
  gulp.watch('./src/images/**/*', function () {
    gulp.run('image');
  });

  // watch for HTML changes
  gulp.watch('./src/*.html', function () {
    gulp.run('htmlpage');
  });

  // watch for JS changes
  gulp.watch('./src/scripts/*.js', function () {
    gulp.run('eslint', 'scripts');
  });

  // watch for CSS changes
  gulp.watch('./src/styles/*.scss', function () {
    gulp.run('styles');
  });
});


// =================================================================================================
// Others
// =================================================================================================

// Static server
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

// create a default task and just log a message
gulp.task('default', function () {
  // Run: gulp
  // Run: gulp --env=prod
  return gutil.env.env === 'prod' ?
    gutil.log('Gulp is running in Prod!') : gutil.log('Gulp is running!');
});


// To stop 'gulp compact' from hangout
gulp.on('stop', function () {
  process.nextTick(function () {
    process.exit(0);
  });
});
