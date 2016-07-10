// Generated on 2015-02-08 using generator-Far 0.11.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    var fs = require('fs');

    // Define the configuration for all the tasks
    grunt.initConfig({


        //
        //// Empties folders to start fresh
        //clean: {
        //    dist: {
        //        files: [{
        //            dot: true,
        //            src: [
        //                '.tmp',
        //                '<%= yeoman.dist %>/{,**/}*',
        //                '!<%= yeoman.dist %>/.git{,**/}*'
        //            ]
        //        }]
        //    },
        //    server: '.tmp',
        //    tenant: '<%= yeoman.whiteLabelApp %>'
        //},

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: 'dist/three-d-viewer.html',
            options: {
                dest: 'dist',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: 'dist/*.html',
            options: {
                assetsDirs: [
                    //'<%= yeoman.dist %>',
                    //'<%= yeoman.dist %>/images',
                    //'<%= yeoman.dist %>/styles'
                ]
                //patterns: {
                //    html: [
                //        [
                //            ///mkp-*[^\>]*[^\>\S]+custom-src-attribute-here=['"]([^'"\)#]+)(#.+)?["']/gm
                //            /mkp-[^\>]*[^\>]+svg-icon=['"]([^'"\)#]+)(#.+)?["']/gm,
                //            'mkp-directives'
                //        ]
                //    ]
                //}
            }
        },


        uglify: {
            options: {
                sourceMap: true,
                mangle: false
            }
        },



        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: false,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '',
                    src: '*.html',
                    dest: 'dist/'
                }]
            }
        },

        vulcanize: {
            default: {
                files: {
                    'dist/three-d-viewer.html': 'three-d-viewer.html'
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                src: ["dist/**/*", 'bower_components/3DViewerComponent/**/*']
            }
        },
        //clean: ["dist"],

        //inline: {
        //    dist: {
        //        options:{
        //            tag: 'js/'
        //        },
        //        src: 'three-d-viewer.html',
        //        dest: 'dist/three-d-viewer.html'
        //    }
        //},

        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            files: {
                expand: true,
                cwd: '',
                ext: '-es5.js',
                src: ['*.es6.js'],
                dest: ''
            }

        },

        inline: {
            dist: {
                options:{
                    tag: ''
                },
                src: 'three-d-viewer.html',
                dest: 'dist/three-d-viewer.html'
            },
            test: {
                options:{
                    tag: ''
                },
                src: 'three-d-viewer.html',
                dest: 'bower_components/3DViewerComponent/dist/three-d-viewer.html'
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '',
                    dest: 'bower_components/3DViewerComponent',
                    src: [
                        'js/*'
                    ]
                }]
            }
        },

        watch: {
            js: {
                files: ['**/*.js'],
                tasks: ['clean:dist','copy','babel','inline:dist','inline:test','useminPrepare','uglify','usemin'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['*.html'],
                tasks: ['clean:dist','copy','babel','inline:dist','inline:test','useminPrepare','uglify','usemin'],
                options: {
                    livereload: true
                }
            }
        },

        connect: {
            livereload: {
                options:{
                    port: 9001,
                    hostname: "0.0.0.0",
                    // Prevents Grunt to close just after the task (starting the server) completes
                    // This will be removed later as `watch` will take care of that
                    //keepalive: true,
                    open: {
                        all: {
                            // Gets the port from the connect configuration
                            path: 'http://localhost:<%= connect.livereload.options.port%>'
                        }
                    }
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-vulcanize');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('build', 'Build the app', function () {
        grunt.task.run([
            'clean:dist',
            'copy',
            'babel',
            'inline:test',
            'inline:dist',
            'useminPrepare',
            //'concat',
            //'vulcanize',
            //'inline',
            'uglify',
            'usemin',
            'connect:livereload',
            'watch'
        ]);
    });


};
