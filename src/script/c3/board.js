/*global c3 */
/*jslint plusplus: true */

c3.board = (function (app) {
  "use strict";
  var pieces = [];

  function getSquarePiece(index) {
    return pieces[index];
  }

  function setSquarePiece(index, piece, game) {
    pieces[index] = piece;
    game.saveSquare(index, app.toSquare(piece));
    game.saveCurrentPlayerId(
        app.equals(piece.playerId, app.player1) ? app.player2 : app.player1);
  }

  function toPiece(square) {
    app.ensureType("square", square);
    return app.piece(
        square.size,
        square.playerId
    );
  }

  function resetBoard(currentGame) {
    var squares = currentGame.squares,
        i;
    for (i = 0; i < 9; i+=1) {
      pieces[i] = toPiece(squares[i]);
    }
  }

  return {
    getSquarePiece:getSquarePiece,
    setSquarePiece:setSquarePiece,
    reset:resetBoard
  };
}(c3));