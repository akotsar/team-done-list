/*
 * Gulp configuration file for the angular.js - TypeScript seed project.
 * 
 * Configured tasks:
 *  - scripts - compiles all typescript files in the source directory and puts them to the configured desitnation directory.
 *  - test-scripts - compiles all unit test typescript files in the source directory and puts them to appropriate destination directory.
 *  - e2e-test-scripts - compiles all typescript files in the e2e tests source directory and puts them to appropriate destination directory.
 *  - sass - compiles SASS source files in the styles source directory and puts them to the configured destination directory.
 *  - clean - removes the destination directories for .js and .css files.
 *  - watch - starts watching changes of typescript and sass files for the 'scripts' and 'sass' tasks.
 *  - default - runs 'clean', 'scripts', 'sass' and then 'watch'
 * 
 * Flags:
 *  --production - Indicates that the compiled .js and .css files need to be minified and unit tests should not be compiled.
 */


// Configuring paths
var scriptsSrcPath = 'app/scripts',                 // Path to the source TypeScript files.
    testScriptsDstPath = 'unit-tests',              // The destination directory for compiled unit test .js files
    scriptsDstFile = 'app/dist/js/all.js',          // Filename for all combined javascript, combined.
    testScriptsMask = '**/*_test.ts',               // A mask for unit tests (to be excluded in production mode).
    scriptsSourceMapRelativePath = '../../scripts', // A relative path from the compiled .js files to the source .ts files (for source map).
    testScriptsSourceMapRelativePath = '/scripts',  // A relative path from the compiled unit test .js files to the source .ts files (for source map).
    e2eScriptsSrcPath = 'e2e-tests/**/*.ts',        // Path to the source .ts files of e2e tests.
    e2eScriptsDstPath = 'e2e-tests/compiled',       // The destination directory for compiled e2e tests .js files.
    e2eScriptsSourceMapRelativePath = '../',        // A relative path from the e2e tests compiled .js files to the source .ts files (for souce map).
    stylesSrcPath = 'app/styles',                   // Path to the source SASS files.
    stylesDstPath = 'app/dist/css',                 // The destination directory for compiled .css files.
    stylesSourceMapRelativePath = '../../styles';   // A relative path from the compiled .css files to the source .scss files (for source map).

// Loading all the libraries.
var gulp = require('gulp'),
    typescript = require('gulp-typescript'),
    sass = require('gulp-ruby-sass'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    ignore = require('gulp-ignore'),
    concat = require('gulp-concat-sourcemap'),
    del = require('del'),
    argv = require('yargs').argv;

/*
 * The 'scripts' task.
 */
gulp.task('scripts', function() {
    return gulp.src([scriptsSrcPath + '/**/*.ts', '!' + scriptsSrcPath + '/typings/**', '!**/_*.ts', '!' + testScriptsMask])
        .pipe(gulpif(!argv.production, sourcemaps.init()))
        .pipe(typescript({
            declarationFiles: false,
            noImplicitAny: true,
            module: 'commonjs',
            target: 'es5',
            sourceRoot: scriptsSourceMapRelativePath
        })).js
        .pipe(concat(scriptsDstFile.split('/').pop()))
        .pipe(gulpif(!argv.production, sourcemaps.write()))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest(scriptsDstFile.split('/').slice(0, scriptsDstFile.split('/').length - 1).join('/')));
});

/*
 * The 'test-scripts' task.
 */
gulp.task('test-scripts', function () {
    return gulp.src([scriptsSrcPath + '/' + testScriptsMask, '!**/_*.ts'])
        .pipe(gulpif(!argv.production, sourcemaps.init()))
        .pipe(typescript({
            declarationFiles: false,
            noImplicitAny: false,
            module: 'commonjs',
            target: 'es5',
            sourceRoot: testScriptsSourceMapRelativePath
        })).js
        .pipe(gulpif(!argv.production, sourcemaps.write()))
        .pipe(gulp.dest(testScriptsDstPath));
});

/*
 * The 'e2e-test-scripts' task.
 */
gulp.task('e2e-test-scripts', function () {
    del(e2eScriptsDstPath);
    return gulp.src([e2eScriptsSrcPath, '!**/_*.ts'])
        .pipe(typescript({
            declarationFiles: false,
            module: 'commonjs',
            target: 'es5',
            sourceRoot: e2eScriptsSourceMapRelativePath
        }))
        .js
        .pipe(gulp.dest(e2eScriptsDstPath));
});

/*
 * The 'sass' task.
 */
gulp.task('sass', function() {
    return gulp.src(stylesSrcPath + '/**/*.scss')
        .pipe(sass({ style: argv.production ? 'compressed' : 'expanded', sourcemap: !argv.production, sourcemapPath: stylesSourceMapRelativePath }))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest(stylesDstPath));
});

/*
 * The 'clean' task.
 */
gulp.task('clean', function(cb) {
    del([testScriptsDstPath, scriptsDstFile, stylesDstPath], cb);
});

/*
 * The 'watch' task.
 */
gulp.task('watch', ['scripts', 'sass'], function () {
    gulp.watch(scriptsSrcPath + '/**/*.ts', ['scripts', 'test-scripts']);
    gulp.watch(stylesSrcPath + '/**/*.scss', ['sass']);
});

/*
 * The 'default' task.
 */
gulp.task('default', ['clean'], function() {
    gulp.start('scripts', 'test-scripts', 'sass', 'watch');
});