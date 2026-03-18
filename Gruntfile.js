module.exports = function(grunt) {
	grunt.registerMultiTask('concatAndWrap', function () {
		var files = [];
		var wrapper = grunt.file.read(this.data.wrapper);

		grunt.file.expand(this.data.src).forEach(function (file) {
			files.push(grunt.file.read(file));
		});

		grunt.file.write(this.data.dest, grunt.template.process(wrapper, {
			data: {
				pkg: grunt.file.readJSON('package.json'),
				src: files.join('\n\n').replace(/\n/g, '\n' + (this.data.indent || ''))
			}
		}).replace(/\r/g, ''));

		console.log('File %s created.', this.data.dest);
	});

	grunt.initConfig({
		concatAndWrap: {
			umd: {
				dest: 'ractive-route.js',
				indent: '\t',
				src: 'src/*',
				wrapper: '.wrapper-umd'
			},
			esm: {
				dest: 'ractive-route.mjs',
				src: 'src/*',
				wrapper: '.wrapper-esm'
			}
		},
		uglify: {
			options: {
				sourceMap: true,
				output: {
					comments: /^!/,
				}
			},
			umd: {
				options: {
					sourceMapName: 'ractive-route.js.map',
				},
				files: {
					'ractive-route.min.js': 'ractive-route.js'
				}
			},
			esm: {
				options: {
					sourceMapName: 'ractive-route.mjs.map',
				},
				files: {
					'ractive-route.min.mjs': 'ractive-route.mjs'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('build', [
		'concatAndWrap',
		'uglify'
	]);

	grunt.registerTask('default', 'build');
};
