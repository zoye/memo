'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
    require('time-grunt')(grunt);

    var config={
        src:'src',
        dist:'dist'
    };

    grunt.initConfig({

        config:config,

        //复制src下文件到dist
        copy:{
            dist:{
                files:[
                    {
                        expand:true,
                        cwd:'<%= config.src %>/',
                        dest:'<%= config.dist %>/',
                        src:'**'

                    }
                ]
            }
        },

        //清除dist目录
        clean:{
            dist:{
                src:[
                    '<%= config.dist %>/'
                ]
            }
        },

        useminPrepare:{
            options:{
                dest:'<%= config.dist %>'
            },
            html:'<%= config.dist %>/*.html'
        },

        //md5命名
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            assets: {
                files: [{
                    src:[
                        '<%= config.dist %>/**/*',
                        '!<%= config.dist %>/*.html'
                    ]
                }]
            }
        },

        usemin:{

            html:['<%= config.dist %>/*.html'],
            css:['<%= config.dist %>/css/{,*/}*.css']
        },

        //concat:{
        //    options:{
        //        separator:';'
        //    }
        //},
        //cssmin:{
        //    options:{}
        //},
        //uglify:{
        //    options:{}
        //}

    });

    grunt.registerTask('build',[
        'clean',
        'useminPrepare',
        //'concat',
        //'cssmin',
        //'uglify',
        'copy',
        'filerev',
        'usemin'
    ])



};