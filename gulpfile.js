'use strict';

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Include the required tools used on tasks
var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  jshint = require('gulp-jshint'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  csso = require('gulp-csso'),
  del = require('del');

// Specify the Source files
var SRC_JS = 'src/js/*.js';
var SRC_CSS = 'src/css/*.css';

// Specify the Destination folders
var DEST_JS = 'dist/js';
var DEST_CSS = 'dist/css';

// JS TASKS
// Lint JS
gulp.task('lint:js', function() {
  return gulp
    .src(SRC_JS)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

// Build JS
gulp.task('build:js', ['clean:js', 'lint:js'], function() {
  return gulp
    .src(SRC_JS)
    .pipe(gulp.dest(DEST_JS))
    .pipe(uglify({ preserveComments: 'license' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(DEST_JS));
});

// Build CSS
gulp.task('build:sass', function() {
  gulp
    .src('src/scss/style.scss')
    .pipe(sass({ style: 'expanded' }))
    .on('error', console.error.bind(console, 'Sass error:'))
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest(DEST_CSS));
});

// CLEAN files
gulp.task('clean:js', function() {
  return del([DEST_JS]);
});

gulp.task('clean:css', function() {
  return del([DEST_CSS]);
});

// WATCH for file changes and rerun the task
gulp.task('watch', function() {
  gulp.watch(SRC_JS, ['build:js']);
  gulp.watch(SRC_CSS, ['build:css']);
});

// DEFAULT task
gulp.task('default', function() {
  gulp.start('build:js', 'build:sass');
});
