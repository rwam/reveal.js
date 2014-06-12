// Load plugins
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    fs = require('fs'),
    imagemin = require('gulp-imagemin'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util');

// Provide a `gulp help` task
require('gulp-help')(gulp);

// Default task – List all available tasks
gulp.task('default', ['help']);

// loading of config files (*.json)
function parseJSON(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// build html
gulp.task('jade', 'Build presentation from jade partials.', function() {
    return gulp.src('jade/index.jade')
        .pipe(jade({
            locals :{
                parseJSON : parseJSON
            },
            pretty: true
        }))
        .pipe(gulp.dest('out'));
});

// Styles
gulp.task('styles', 'Build themes from SASS.', function() {
    return gulp.src('css/theme/source/**/' + (util.env.theme || '*') + '*.scss')
        .pipe(sass({
            loadPath    : 'css/theme',
            style       : 'compact',
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        // .pipe(gulp.dest('out/css/theme'))
        // .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('out/css/theme'));
});

// Copy
gulp.task('copy', 'Copy presentation files into output directory.', function() {
    gulp.src(['css/**', '!css/theme/**'])
        .pipe(gulp.dest('out/css'));
    gulp.src('lib/**')
        .pipe(gulp.dest('out/lib'));
});

// Cleanup
gulp.task('clean', 'Cleanup of the output directory.', function() {
    return gulp.src('out', { read: false })
        .pipe(clean());
});

// Build
gulp.task('build', 'Build the presentation', ['clean'], function() {
    gulp.start('copy', 'jade', 'styles');
});

// Server
gulp.task('server', 'Provide a simple http-server on port 5000.', function() {
    connect.server({
        root : 'out',
        port : 5000
    });
});

// Watch
gulp.task('watch', 'Watch task with livereload support.', ['server'], function() {

    // Create LiveReload server
    var server = livereload();
    livereload.listen();

    // Watch .jade files
    gulp.watch('jade/**/*', ['jade']);

    // Watch .scss files
    gulp.watch('css/theme/source/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('assets/images/**/*', ['images']);

    // Watch any files in inc/, reload on change
    gulp.watch(['out/**/*']).on('change', function(file) {
        server.changed(file.path);
    });

});
