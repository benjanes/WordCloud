module.exports = function(grunt) {

    'use strict';

    var jsLibs = [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/underscore/underscore.js',
        'bower_components/backbone/backbone.js',
        'bower_components/marionette/lib/backbone.marionette.js',
        'bower_components/backbone.localstorage/backbone.localStorage.js',
        'bower_components/backbone.syphon/lib/backbone.syphon.js',
        'bower_components/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js'
    ];

    var jsConfig = [
        'dev_files/js/config/**/*.js'
    ];

    var jsApp = [
        'dev_files/js/libs.min.js',
        'dev_files/js/config.min.js',
        'dev_files/js/app.js',
        'dev_files/js/models/wordlist.js',
        'dev_files/js/Collections/filecollection.js',
        'dev_files/js/filelist/filelist_view.js',
        'dev_files/js/canvas/canvas_view.js',
        'dev_files/js/canvas/canvas_controller.js',
        'dev_files/js/selectedfile/selectedfile_view.js',
        'dev_files/js/selectedfile/selectedfile_controller.js',
        'dev_files/js/settings/settings_view.js',
        'dev_files/js/settings/settings_controller.js',
        'dev_files/js/load/load_view.js'
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

        autoprefixer: {
            dist: {
                files: {
                    'app/assets/css/style.css' : 'app/assets/css/style.css'
                }
            }
        },

        cssmin: {
            target: {
                files: {
                    'dist/app/assets/css/style.min.css' : ['app/assets/css/style.css', 'bower_components/mjolnic-bootstrap-colorpicker/dist/css/bootstrap-colorpicker.css']
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
                    'dist/app/assets/js/libs.min.js': [jsLibs],
                    'dist/app/assets/js/config.min.js': [jsConfig],
                    'dist/app/assets/js/app.min.js': [jsApp],
                }
            },
            dev: {
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
                tasks: ['copy:dev']
            }
        },

        copy: {
            dist: {
                files: [
                    {expand: true, cwd: 'dev_files/', src: 'favicon.ico', dest: 'dist/app/'},
                    {expand: true, cwd: 'dev_files/', src: 'templates/**', dest: 'dist/app/assets/'},
                    // bootstrap glyphicons
                    {expand: true, cwd: 'bower_components/bootstrap-sass/assets/', src: 'fonts/**', dest: 'dist/app/assets/'},
                    // colorpicker plugin
                    {expand: true, cwd: 'bower_components/mjolnic-bootstrap-colorpicker/dist/', src: 'img/**', dest: 'dist/app/assets/'}
                ]
            },
            dev: {
                files: [
                    {expand: true, cwd: 'dev_files/', src: ['**/*', '!sass/**', '!js/config/**', '!index.html', '!favicon.ico'], dest: 'app/assets/'},
                    {expand: true, cwd: 'dev_files/', src: 'favicon.ico', dest: 'app/'},
                    // bootstrap glyphicons
                    {expand: true, cwd: 'bower_components/bootstrap-sass/assets/', src: 'fonts/**', dest: 'app/assets/'},
                    // colorpicker plugin
                    {expand: true, cwd: 'bower_components/mjolnic-bootstrap-colorpicker/dist/css/', src: 'bootstrap-colorpicker.css', dest: 'app/assets/css/'},
                    {expand: true, cwd: 'bower_components/mjolnic-bootstrap-colorpicker/dist/', src: 'img/**', dest: 'app/assets/'}
                ]
            }
        },

        targethtml: {
            dist: {
                files: {
                    'dist/app/index.html': 'dev_files/index.html'
                }
            },
            dev: {
                files: {
                    'app/index.html': 'dev_files/index.html'
                }
            }
        },

        'gh-pages': {
            options: {
                base: 'dist/app'
            },
            src: ['**']
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
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-targethtml');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('default', ['sass', 'jshint', 'uglify:dev', 'copy:dev', 'targethtml:dev', 'connect:server', 'watch']);

    grunt.registerTask('build', ['sass', 'autoprefixer', 'cssmin', 'uglify', 'copy:dist', 'targethtml:dist', 'gh-pages']);
};
