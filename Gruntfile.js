module.exports = function(grunt) {

    'use strict';

    var jsLibs = [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/underscore/underscore.js',
        'bower_components/backbone/backbone.js',
        'bower_components/marionette/lib/backbone.marionette.js',
        'bower_components/backbone.localstorage/backbone.localStorage.js',
        'bower_components/backbone.syphon/lib/backbone.syphon.js'
    ];

    var jsConfig = [
        'dev_files/js/config/**/*.js'
    ];

    // project config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    loadPath: ['bower_components/bootstrap-sass/assets/stylesheets']
                },
                files: {
                    'app/assets/css/style.css' : 'dev_files/sass/style.sass'
                }
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'dev_files/js/**/*.js'
            ]
        },

        uglify: {
            dist: {
                files: {
                    'app/assets/js/libs.min.js': [jsLibs],
                    'app/assets/js/config.min.js': [jsConfig]
                }
            }
        },

        watch: {
            css: {
                files: 'dev_files/sass/*.sass',
                tasks: ['sass'],
                options: {
                    livereload: true
                }
            },
            jshint: {
                files: ['dev_files/js/**/*.js'],
                tasks: ['jshint']
            },
            copy: {
                files: ['dev_files/**'],
                tasks: ['copy']
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'dev_files/', src: ['**/*', '!sass/**', '!js/config/**', '!index.html'], dest: 'app/assets/'},
                    {expand: true, cwd: 'dev_files/', src: 'index.html', dest: 'app/'}
                ]
            }
        },

        connect: {
            server: {
                options: {
                    livereload: true,
                    base: './app',
                    port: 9000
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['sass', 'jshint', 'uglify', 'copy', 'connect:server', 'watch']);
    //grunt.registerTask('serve', ['default', 'connect:server', 'watch']);
};
