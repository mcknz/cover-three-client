/*global module */

module.exports = function (grunt) {
  "use strict";
  // Project configuration.
  grunt.initConfig({
    lint: {
      files: [
        'grunt.js',
        'spec/CoverThreeSpec.js',
        'src/script/c3/app.js',
        'src/script/c3/player.js',
        'src/script/c3/piece.js',
        'src/script/c3/square.js',
        'src/script/c3/game.js',
        'src/script/c3/board.js',
        'src/script/c3/ui.js']
    },
    concat:{
      dist:{
        src:[
          'src/script/c3/app.js',
          'src/script/c3/player.js',
          'src/script/c3/piece.js',
          'src/script/c3/square.js',
          'src/script/c3/game.js',
          'src/script/c3/board.js',
          'src/script/c3/ui.js'],
        dest:'dist/c3.js'
      }
    },
    min:{
      dist:{
        src:['<config:concat.dist.dest>'],
        dest:'dist/c3.min.js'
      }
    },
    watch: {
        files: ['<config:lint.files>'],
        tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        plusplus: false,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      }
    }
  });

  grunt.registerTask('default', 'lint concat min');
};