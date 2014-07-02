module.exports = function (grunt) {
  grunt.initConfig({
    nodewebkit: {
                  options: {
                            build_dir: './webkitbuilds',
                            mac: true,
                            win: true,
                            linux32: true,
                            linux64: true
                },  
                src: [
                  './src/**/*'
                ]   
            },  
    }); 

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    //grunt.registerTask('default', ['grunt-node-webkit-builder']);
}
