
module.exports = function(grunt) {
"use strict";

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON("package.json"),
    banner: "",
    // Task configuration.
    concat: {
      options: {
        banner: "<%= banner %>",
        stripBanners: true
      },
      dist: {
          files: [
                {
                    src: ["src/<%= pkg.name %>.js"],
                    dest: "dist/<%= pkg.name %>.js"
                },
                {
                    src: ["src/<%= pkg.name %>.js"],
                    dest: "dist/<%= pkg.name %>.<%= pkg.version %>.js"
                }
          ]
      },
    },
    uglify: {
      options: {
        banner: "<%= banner %>"
      },
      dist: {
          files: [
                {
                    src: "<%= concat.dist.files[0].dest %>",
                    dest: "dist/<%= pkg.name %>.min.js"
                },
                {
                    src: "<%= concat.dist.files[0].dest %>",
                    dest: "dist/<%= pkg.name %>.<%= pkg.version %>.min.js"
                }
          ]
      },
    },
	/*mocha: {
		test: {
			options: {
				run: true,
				debug: true,
				reporter: "Spec",
			},
			src: [ "test/index.html" ]
		}
	},*/
	mochaTest: {
      unit: {
        options: {
          reporter: "spec"
        },
        src: ["test/*.js"]
      }
	},
	// start - code coverage settings

    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: "../test/coverage/instrument/app/"
      }
    },


    clean: {
      coverage: {
        src: ["test/coverage/"]
      }
    },


    copy: {
      views: {
        expand: true,
        flatten: true,
        src: ["app/views/*"],
        dest: "test/coverage/instrument/app/views"
      }
    },


    instrument: {
      files: "app/*.js",
      options: {
        lazy: true,
        basePath: "test/coverage/instrument/"
      }
    },


    storeCoverage: {
      options: {
        dir: "test/coverage/reports"
      }
    },


    makeReport: {
      src: "test/coverage/reports/**/*.json",
      options: {
        type: "lcov",
        dir: "test/coverage/reports",
        print: "detail"
      }
    },

    // end - code coverage settings
	
    coveralls: {
		options: {
			

			// dont fail if coveralls fails
			force: true
		},
		main_target: {
			src: "reports/lcov/lcov.info"
		}
	},
    jshint: {
      gruntfile: {
        options: {
          jshintrc: ".jshintrc"
        },
        src: "Gruntfile.js"
      },
      src: {
        options: {
          jshintrc: "src/.jshintrc"
        },
        src: ["src/**/*.js"]
      },
      test: {
        options: {
          jshintrc: "test/.jshintrc"
        },
        src: ["test/**/*.js"]
      },
    },
    watch: {
      gruntfile: {
        files: "<%= jshint.gruntfile.src %>",
        tasks: ["jshint:gruntfile"]
      },
      src: {
        files: "<%= jshint.src.src %>",
        tasks: ["jshint:src", "qunit"]
      },
      test: {
        files: "<%= jshint.test.src %>",
        tasks: ["jshint:test", "qunit"]
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-coveralls");
  //grunt.loadNpmTasks("grunt-mocha");
  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-istanbul");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks("grunt-env");

  // Default task.
  
  grunt.registerTask("test",["jshint", "mochaTest:unit"]);
  grunt.registerTask("default", ["test", "concat", "uglify"]);
  grunt.registerTask("coverage", ["jshint", "copy:views", "env:coverage", "instrument", "mochaTest:unit", "storeCoverage", "makeReport"]);
};
