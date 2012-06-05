/*global c3 */
/*jslint plusplus: true */

c3.game = (function (app) {
  "use strict";
  var type = "game",
      gameState = null,
      playerId = app.player1,
      squares = [],
      resetCallback = null;

  function updateState() {
    gameState = app.serialize({
      type:type,
      playerId:playerId,
      squares:squares
    });
  }

  function addResetNotification(callback) {
    resetCallback = callback;
  }

  function saveCurrentPlayerId(id) {
    playerId = id;
    updateState();
  }

  function saveSquare(index, square) {
    squares[index] = square;
    updateState();
  }

  function getGame() {
    return app.deserialize(gameState);
  }

  function setGame(newGame) {
    app.ensureType(type, newGame);
    if (app.equals(gameState, app.serialize(newGame))) {
      return;
    }
    playerId = newGame.playerId;
    squares = newGame.squares;
    updateState();
    if (resetCallback !== null) {
      resetCallback(newGame);
    }
  }

  function resetGame() {
    var i;
    for (i = 0; i < 9; i++) {
      squares[i] = c3.square(app.none, app.none);
    }
    setGame({
      type:type,
      playerId:app.player1,
      squares:squares
    });
  }

  return {
    get:getGame,
    set:setGame,
    reset:resetGame,
    saveCurrentPlayerId:saveCurrentPlayerId,
    saveSquare:saveSquare,
    addResetNotification:addResetNotification
  };
}(c3));
