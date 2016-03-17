module.exports = function(grunt) {

	// Project configuration. 
	grunt.initConfig({
  		concat: {
    		dist: {
      			src: 'src/*.js',
      			dest: 'releases/musicxml-converter.js',
    		},
  		},
	});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat']);
}