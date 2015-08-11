module.exports = function(grunt) {

    'use strict';

    var jsLibs = [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/underscore/underscore.js',
        'bower_components/backbone/backbone.js',
        'bower_components/marionette/lib/backbone.marionette.js',
        'bower_components/backbone.localstorage/backbone.localStorage.js'
    ];

    var jsApp = [
        'js/app.js',
        'js/**/*.js'
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
                    'app/assets/js/libs.min.js': [jsLibs]
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
                files: ['dev_files/js/**/*.js', 'dev_files/index.html'],
                tasks: ['copy']
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'dev_files/js/', src: ['**'], dest: 'app/assets/js/', filter: 'isFile'},
                    {expand: true, cwd: 'dev_files/', src: 'index.html', dest: 'app/'}
                ]
            }
        },

        //grunt serve
        'http-server': {
            'dev': {
                root: './app',
                port: 9000
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-http-server');

    grunt.registerTask('default', ['sass', 'jshint', 'uglify', 'copy', 'watch']);
    grunt.registerTask('serve', ['http-server:dev']);
};
