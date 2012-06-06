var c3 = (function () {
  "use strict";
  var none = -1,
      player1SmallPiece ="a",
      player1LargePiece = "A",
      player2SmallPiece = "b",
      player2LargePiece = "B",
      content = [
        [player1SmallPiece, player2SmallPiece],
        [player1LargePiece, player2LargePiece]
      ];

  function equals(one, other) {
    return one === other;
  }

  function isNone(value) {
    return equals(value, none);
  }

  function ensureType(type, obj) {
    if (type !== obj.type) {
      throw "invalid type: " +
          "expected '" + type + "', " +
          "received '" + obj.type + "'";
    }
  }

  function toInt(s) {
    return parseInt(s, 10);
  }

  function toSquare(piece) {
    ensureType("piece", piece);
    return c3.square(piece.size, piece.playerId);
  }

  function serialize(obj) {
    return JSON.stringify(obj);
  }

  function deserialize(s) {
    return JSON.parse(s);
  }

  function getContent(size, playerId) {
    return content[size][playerId];
  }

  function init() {
    c3.game.addResetNotification(c3.board.reset);
    c3.game.addResetNotification(c3.ui.run);
    c3.game.reset();
  }

  return {
    none:none,
    player1:0,
    player2:1,
    smallPiece:0,
    largePiece:1,
    isNone:isNone,
    equals:equals,
    ensureType:ensureType,
    toInt:toInt,
    toSquare:toSquare,
    serialize:serialize,
    deserialize:deserialize,
    getContent:getContent,
    init:init
  };
}());

/*global c3 */

c3.player = function(id) {
  "use strict";
  var type = "player";

  function equals(other) {
    c3.ensureType(type, other);
    return c3.equals(id, other.id);
  }

  return {
    type:type,
    id:id,
    equals:equals
  };
};
/*global c3 */

c3.piece = function (size, playerId) {
  "use strict";
  var type = "piece",
      content,
      className,
      isNoPiece;

  function getClassName(isNone) {
    return isNone ? "" : "piece-" + size + " player-" + playerId;
  }

  function getContent(isNone) {
    return isNone ? 0 : c3.getContent(size, playerId);
  }

  function getIsNoPiece() {
    return c3.isNone(size) || c3.isNone(playerId);
  }

  function equals(other) {
    c3.ensureType(type, other);
    return c3.equals(size, other.size) &&
        c3.equals(playerId, other.playerId);
  }

  function getNextSize() {
    return size === c3.none ? c3.smallPiece : c3.largePiece;
  }

  isNoPiece = getIsNoPiece();
  content = getContent(isNoPiece);
  className = getClassName(isNoPiece);

  return {
    type:type,
    content:content,
    className:className,
    size:size,
    playerId:playerId,
    isNoPiece:isNoPiece,
    equals:equals,
    getNextSize:getNextSize
  };
};

/*global c3 */

c3.square = function(size, playerId) {
    "use strict";
    return {
        type:"square",
        playerId:playerId,
        size:size
    };
};
/*global c3 */
/*jslint plusplus: true */

c3.game = (function (app) {
  "use strict";
  var type = "game",
      gameState = null,
      playerId = app.player1,
      squares = [],
      resetCallbacks = [];

  function updateState() {
    gameState = app.serialize({
      type:type,
      playerId:playerId,
      squares:squares
    });
  }

  function addResetNotification(callback) {
    resetCallbacks.push(callback);
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
    var callbackCount = resetCallbacks.length - 1;
    app.ensureType(type, newGame);
    if (app.equals(gameState, app.serialize(newGame))) {
      return;
    }
    playerId = newGame.playerId;
    squares = newGame.squares;
    updateState();
    if (callbackCount > 0) {
      while(callbackCount >= 0) {
        resetCallbacks[callbackCount].call(null, newGame);
        callbackCount-=1;
      }
    }
  }

  function resetGame() {
    var i;
    for (i = 0; i < 9; i+=1) {
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
/*global jQuery, c3, event */

c3.ui = (function ($, app, board, game) {
  "use strict";
  var container = $("#gridContainer"),
      squares = $(".sqr");

  function setBoardSquare(index, pieceSize, playerId) {
    board.setSquarePiece(
        index,
        app.piece(pieceSize, playerId),
        game);
  }

  function paintSquare(squareId, oldPiece, newPiece) {
    $("#" + squareId)
        .text(newPiece.content)
        .removeClass(oldPiece.className)
        .addClass(newPiece.className);
  }

  function clickSquare(squareId) {
    var oldPiece,
        newPiece;
    oldPiece = board.getSquarePiece(squareId);
    newPiece = app.piece(
        oldPiece.getNextSize(),
        game.get().playerId
    );
    setBoardSquare(squareId, newPiece.size, newPiece.playerId);
    paintSquare(squareId, oldPiece, newPiece);
    if(newPiece.size === app.largePiece) {
      $("#" + squareId).off("click")
          .removeClass("sqr")
          .addClass("sqr-off");
    }
  }

  function setup() {
    squares.on("click", function (e) {
      clickSquare(app.toInt(e.target.id));
      container.css("cursor", "pointer");
    });

    squares.mousedown(function (e) {
      //prevent text cursor from showing on click
      if (e.originalEvent.preventDefault) {
        e.originalEvent.preventDefault();
      } else {
        event.returnValue = false;
      }
    });

    container.fadeIn("slow");
  }

  return {
    run:setup,
    clickSquare:clickSquare
  };

}(jQuery, c3, c3.board, c3.game));