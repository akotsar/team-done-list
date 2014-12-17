var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	sass = require('gulp-ruby-sass'),
	notify = require('gulp-notify'),
	sourcemaps = require('gulp-sourcemaps'),
	eventStream = require('event-stream'),
	del = require('del');

gulp.task('scripts', function() {
    var tsResult = gulp.src('app/scripts/**/*.ts')
                       .pipe(sourcemaps.init())
                       .pipe(ts({
                           declarationFiles: false,
                           noExternalResolve: true,
                           module: 'commonjs',
                           target: 'es5',
                           sourceRoot: '../../scripts'
                       }));

    return eventStream.merge(
        tsResult.js
        	.pipe(sourcemaps.write())
        	.pipe(gulp.dest('app/dist/js'))
    );
});

gulp.task('sass', function() {
  return gulp.src('app/styles/app.scss')
    .pipe(sass({ style: 'expanded', sourcemap: true, sourcemapPath: '../../styles' }))
    .pipe(gulp.dest('app/dist/css'))
});

gulp.task('clean', function(cb) {
    del(['dist'], cb)
});

gulp.task('watch', ['scripts'], function() {
    gulp.watch('app/scripts/**/*.ts', ['scripts']);
    gulp.watch('app/styles/**/*.scss', ['sass']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('scripts', 'sass', 'watch');
});