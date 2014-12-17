var gulp = require('gulp'),
    typescript = require('gulp-typescript'),
    sass = require('gulp-ruby-sass'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    ignore = require('gulp-ignore'),
    eventStream = require('event-stream'),
    del = require('del'),
    argv = require('yargs').argv;

gulp.task('scripts', function() {
    var tsResult = gulp.src(['app/scripts/**/*.ts', '!app/scripts/typings/**', '!**/_*.ts'])
                       .pipe(gulpif(argv.production, ignore.exclude('**/*_test.ts')))
                       .pipe(gulpif(!argv.production, sourcemaps.init()))
                       .pipe(typescript({
                           declarationFiles: false,
                           noImplicitAny: true,
                           module: 'commonjs',
                           target: 'es5',
                           sourceRoot: '../../scripts'
                       }));

    return eventStream.merge(
        tsResult.js
        	.pipe(gulpif(!argv.production, sourcemaps.write()))
            .pipe(gulpif(argv.production, uglify()))
        	.pipe(gulp.dest('app/dist/js'))
    );
});

gulp.task('test-scripts', function () {
    var tsResult = gulp.src(['e2e-tests/**/*.ts'])
                       .pipe(typescript({
                           declarationFiles: false,
                           module: 'commonjs',
                           target: 'es5',
                           sourceRoot: '../'
                       }));

    return eventStream.merge(
        tsResult.js.pipe(gulp.dest('e2e-tests/compiled'))
    );
});

gulp.task('sass', function() {
    return gulp.src('app/styles/app.scss')
        .pipe(sass({ style: argv.production ? 'compressed' : 'expanded', sourcemap: !argv.production, sourcemapPath: (!argv.production) && '../../styles' }))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('app/dist/css'));
});

gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

gulp.task('watch', ['scripts', 'sass'], function () {
    gulp.watch('app/scripts/**/*.ts', ['scripts']);
    gulp.watch('app/styles/**/*.scss', ['sass']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('scripts', 'sass', 'watch');
});