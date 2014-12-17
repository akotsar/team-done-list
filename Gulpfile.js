var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	eventStream = require('event-stream'),
	del = require('del');

gulp.task('scripts', function() {
    var tsResult = gulp.src('app/scripts/**/*.ts')
                       .pipe(ts({
                           declarationFiles: false,
                           noExternalResolve: true,
                           module: 'commonjs',
                           target: 'es5'
                       }));

    return eventStream.merge(
        tsResult.js.pipe(gulp.dest('app/release/js'))
    );
});

gulp.task('clean', function(cb) {
    del(['release'], cb)
});

gulp.task('watch', ['scripts'], function() {
    gulp.watch('app/scripts/**/*.ts', ['scripts']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('scripts', 'watch');
});