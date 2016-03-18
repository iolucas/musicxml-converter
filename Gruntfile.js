module.exports = function(grunt) {

	// Project configuration. 
	grunt.initConfig({
  		concat: {
    		dist: {
      			src: 'src/*.js', //select all javascript files of the src folder
      			dest: 'releases/musicxml-converter.js', //target to the concatened files
    		},
  		},

      uglify: {
        options: {
          compress: {
            drop_console: true
          }
        },
        my_target: {
          files: {
            'releases/musicxml-converter.min.js': ['releases/musicxml-converter.js']
          }
        }
      },
      //Every time some js file change, concatenate them to the release version
      watch: {
        scripts: {
          files: ['src/*.js'],
          tasks: ['concat']
        },
      }
	});

	grunt.loadNpmTasks('grunt-contrib-concat');	//load concat module

  grunt.loadNpmTasks('grunt-contrib-uglify'); //load minification module

  grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat', 'watch']);	//execute concat function on grunt call
}