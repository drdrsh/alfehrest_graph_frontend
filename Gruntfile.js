module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		serve: {
			options: {
				port: 9000,
				serve: {
					path: './dev/'
				}
			}
		},

        "bower-install-simple": {
            options: {color: true},
            "prod": {options: {production: true}},
            "dev":  {options: {production: false}}
        },

        concat: {
            "dev": {
                "jquery-ui": {
                    options: {
                        separator: ';'
                    },
                    src: [
                        'bower_components/jquery-ui/ui/core.js',
                        'bower_components/jquery-ui/ui/widget.js',
                        'bower_components/jquery-ui/ui/mouse.js',
                        'bower_components/jquery-ui/ui/position.js',
                        'bower_components/jquery-ui/ui/draggable.js',
                        'bower_components/jquery-ui/ui/resizable.js',
                        'bower_components/jquery-ui/ui/button.js',
                        'bower_components/jquery-ui/ui/dialog.js'
                    ],
                    dest: 'bower_components/jquery-ui/jquery-ui.js'
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }
        },

        jshint: {
            all: ['./source/js/*.js'],
            options: {
                esnext: true
            }
        },

        bowercopy: {
            dev : {
                options: {
                    clean: false
                },
                files: {
                    "dev/assets/lib/jquery/jquery.js" : "./jquery/dist/jquery.js",
                    "dev/assets/lib/vivagraphjs/vivagraph.js" : "./vivagraphjs/dist/vivagraph.js",

                    "dev/assets/lib/jquery-ui/jquery-ui.js" : "./jquery-ui/jquery-ui.js",
                    "dev/assets/lib/jquery-ui/jquery-ui.css" : "./jquery-ui/themes/start/jquery-ui.css",
                    "dev/assets/lib/jquery-ui/images" : "./jquery-ui/themes/start/images"
                }
            }
        },

        "expand-in-place": {
            'dev': { //specify a target with any name
                target: ['dev/*.html']
            }
        }

    });

    grunt.loadNpmTasks('grunt-bower-install-simple')
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-expand-in-place');
    grunt.loadNpmTasks('grunt-bowercopy');
	grunt.loadNpmTasks('grunt-serve');
    
    // task setup 
    grunt.registerTask('dev', ['bower-install-simple:dev', 'concat:dev', 'bowercopy:dev', 'expand-in-place:dev', 'serve']);
    grunt.registerTask('default', ['dev']);
};