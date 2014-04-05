'use strict';


module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    autoshot: {
      dev: {
        options: {
          path: 'screenshots/',
          viewport: ['1024x655'],
          local: false,
          remote: {
            files: [{
              src: 'http://0.0.0.0:8888/app#/',
              dest: 'home.jpg',
            }]
          }
        }
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'app-dist',
          ]
        }]
      },
      build: {
        files: [{
          dot: true,
          src: [
            'app-build',
          ]
        }]
      }
    },

    concat: {},

    connect: {
      options: {
        hostname: '0.0.0.0',
        base: './'
      },
      devserver: {
        options: {
          port: 8888,
          middleware: function(connect, options) {
            var middlewares = [];
            var directory = options.directory || options.base[options.base.length - 1];
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }

            options.base.forEach(function(base) {
              // Serve static files.
              middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            middlewares.push(connect.directory(directory));

            return middlewares;
          }
        }
      },
      screenshots: {
        options: {
          port: 5556,
          base: './screenshots/',
          keepalive: true
        }
      }
    },

    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          dest: 'app-build',
          src: [
            '**/*',
            '!lib/',
            '!lib/**/*',
            '!js/',
            '!js/**/*',
            '!components/**/*',
            '!css/',
            '!css/**/*',
          ]
        }, {
          expand: true,
          cwd: 'app/lib/bootstrap/dist',
          dest: 'app-build',
          src: [
            'fonts/*'
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app-build',
          dest: 'app-dist',
          src: [
            '**/*',
            '!js/**/*',
            '!css/**/*',
            '!*.html',
            '!views/**/*.html'
          ]
        }]
      }
    },

    cssmin: {
      dist: {
        expand: true,
        cwd: 'app-build/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'app-dist/css/'
      }
    },

    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app-build',
          src: ['*.html', 'views/**/*.html'],
          dest: 'app-dist'
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      all: [
        'Gruntfile.js',
        'app/js/**/*.js',
        'app/components/**/*.js'
      ]
    },

    karma: {
      unit: {
        configFile: 'config/karma.conf.js',
        singleRun: true
      },
      autoUnit: {
        configFile: 'config/karma.conf.js',
        autoWatch: true,
        singleRun: false
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            'app-dist/js/**/*.js',
            'app-dist/css/**/*.css',
            'app-dist/fonts/*'
          ]
        }
      }
    },

    uglify: {
      dist: {
        expand: true,
        cwd: 'app-build/js/',
        src: ['*.js', '!*.min.js'],
        dest: 'app-dist/js/'
      }
    },

    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'app-build',
        flow: {
          html: {
            steps: {
              'js': ['concat'],
              'css': ['concat']
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: ['app-build/**/*.html', 'app-dist/**/*.html'],
      css: ['app-build/css/**/*.css', 'app-dist/css/**/*.css'],
    },

    watch: {
      app: {
        files: [
          'app/**/*',
          '!app/lib/**/*'
        ],
        tasks: ['build']
      },
    },

  });

  grunt.registerTask('build:assets', [
    'jshint',
    'clean:build',
    'useminPrepare',
    'concat',
    'copy:build',
  ]);
  grunt.registerTask('build', ['build:assets', 'usemin']);

  grunt.registerTask('dist', [
    'build:assets',
    'clean:dist',
    'copy:dist',
    'htmlmin',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('test', ['jshint', 'karma:unit']);
  grunt.registerTask('autotest', ['jshint', 'karma:autoUnit']);

  grunt.registerTask('server:dev', ['connect:devserver']);

  grunt.registerTask('dev', ['build', 'server:dev', 'watch']);

  grunt.registerTask(
    'screenshots', ['build', 'server:dev', 'autoshot', 'connect:screenshots']);

  grunt.registerTask('default', ['test', 'build', 'server:dev', 'autoshot']);

};