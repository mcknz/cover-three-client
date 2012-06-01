/*global module */

module.exports = function (grunt) {
  "use strict";
  // Project configuration.
  grunt.initConfig({
    concat:{
      dist:{
        src:[
          'src/script/c3/app.js',
          'src/script/c3/player.js',
          'src/script/c3/piece.js',
          'src/script/c3/square.js',
          'src/script/c3/game.js',
          'src/script/c3/board.js',
          'src/script/c3/ui.js',
          'src/cover-three.js'
        ],
        dest:'dist/c3.js'
      }
    },
    min:{
      dist:{
        src:['dist/c3.js'],
        dest:'dist/c3.min.js'
      }
    }
  });

  grunt.registerTask('default', 'concat min');
};