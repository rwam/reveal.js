// Load plugins
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    fs = require('fs'),
    imagemin = require('gulp-imagemin'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    uglify = require('gulp-uglify');

// Provide a `gulp help` task
require('gulp-help')(gulp);

// Default task – List all available tasks
gulp.task('default', ['help']);

// loading of config files (*.json)
function parseJSON(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

gulp.task('jade', 'build presentation from jade partials', function() {
    return gulp.src('jade/*.jade')
        .pipe(jade({
            locals :{
                parseJSON : parseJSON
            },
            pretty: true
        }))
        .pipe(gulp.dest('out'));
});

// Styles
gulp.task('styles', 'Build themes from SASS', function() {
    return gulp.src('css/theme/source/**/*.scss')
        .pipe(sass({
            loadPath    : 'css/theme',
            style       : 'compact',
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('css/theme'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('css/theme'));
});

// Watch
gulp.task('watch', 'Watch task with livereload support', function() {

    // Create LiveReload server
    var server = livereload();
    livereload.listen();

    // Watch .scss files
    gulp.watch('css/theme/source/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('assets/images/**/*', ['images']);

    // Watch any files in inc/, reload on change
    gulp.watch(['css/theme/*.css']).on('change', function(file) {
        server.changed(file.path);
    });

});
