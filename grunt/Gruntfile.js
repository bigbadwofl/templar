module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			release: {
				files: {
					'../client/css/main.css': '../client/css-less/main.less'
				}
			}
		},
		watch: {
			debug: {
				files: '../client/css-less/*.less',
				tasks: ['less']
			}
		}
	});

	require('load-grunt-tasks')(grunt);
};