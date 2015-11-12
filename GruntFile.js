module.exports = function (grunt) {
  grunt.initConfig({
    nwjs: {
      options: {
        platforms: [ 'linux', 'osx', 'win' ],
        buildDir: './webkitbuilds',
        version: '0.12.2'
      },
      src: [
        './src/**/*',
        './node_modules/bluebird/**/*'
      ],
    },
  });

  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['nwjs']);
};
