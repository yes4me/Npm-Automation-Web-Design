// =====================================================================================================================
// include Gulp
// =====================================================================================================================

var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    jshint  = require('gulp-jshint');

// configure the jshint task
gulp.task('jshint', function() {
    gulp.src('./src/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// =====================================================================================================================
// Web plug-ins
// =====================================================================================================================

var imagemin    = require('gulp-imagemin');
var changed     = require('gulp-changed');
var minifyHTML  = require('gulp-htmlmin');
var concat      = require('gulp-concat');
var stripDebug  = require('gulp-strip-debug');
var uglify      = require('gulp-uglify');
var sass        = require('gulp-sass');
var autoprefix  = require('gulp-autoprefixer');
var minifyCSS   = require('gulp-minify-css');


// minify new images
gulp.task('image', function() {
    var imgSrc = './src/images/**/*',
        imgDst = './build/images';

    return gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest(imgDst));
});


// minify new or changed HTML pages
gulp.task('htmlpage', function() {
    var htmlSrc = './src/*.html',
        htmlDst = './build';

    return gulp.src(htmlSrc)
        .pipe(changed(htmlDst))
        .pipe(minifyHTML())
        .pipe(gulp.dest(htmlDst));
});


// JS concat, strip debugging and minify
gulp.task('scripts', function() {
    return gulp.src(['./src/scripts/lib.js','./src/scripts/*.js'])
        .pipe(concat('script.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./build/scripts/'));
});


// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
    return gulp.src(['./src/styles/*.scss'])
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(autoprefix('last 2 versions'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build/styles/'));
});


// default gulp task
gulp.task('compact', ['image', 'htmlpage', 'scripts', 'styles'], function() {
    // watch for images changes
    gulp.watch('./src/images/**/*', function() {
        gulp.run('image');
    });

    // watch for HTML changes
    gulp.watch('./src/*.html', function() {
        gulp.run('htmlpage');
    });

    // watch for JS changes
    gulp.watch('./src/scripts/*.js', function() {
        gulp.run('jshint', 'scripts');
    });

    // watch for CSS changes
    gulp.watch('./src/styles/*.css', function() {
        gulp.run('styles');
    });
});

// =====================================================================================================================
// Others
// =====================================================================================================================

// create a default task and just log a message
gulp.task('default', function() {
    // Run: gulp
    // Run: gulp --env=prod
    return gutil.env.env === 'prod'? gutil.log('Gulp is running in Prod!') : gutil.log('Gulp is running!');
});

// To stop "gulp compact" from hangout
gulp.on('stop', function () {
    process.nextTick(function () {
        process.exit(0);
    });
});