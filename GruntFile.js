module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['app/scripts/**/*.ts'],
                dest: 'app/scripts/compiled',
                options: {
                    module: 'amd',
                    target: 'es5',
                    basePath: 'app/scripts',
                    sourceMap: true
                }
            }
        },
        watch: {
            files: '**/*.ts',
            tasks: ['typescript']
        }
    });
 
    grunt.registerTask('default', ['watch']);
 
}