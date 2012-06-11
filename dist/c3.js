var c3 = (function () {
  "use strict";
  var none = -1;

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
      className;

  function getClassName() {
    return c3.isNone(size) ? "" : "piece-" + size + " player-" + playerId;
  }

  function equals(other) {
    c3.ensureType(type, other);
    return c3.equals(size, other.size) &&
        c3.equals(playerId, other.playerId);
  }

  function getNextSize() {
    return size === c3.none ? c3.smallPiece : c3.largePiece;
  }

  className = getClassName();

  return {
    type:type,
    className:className,
    size:size,
    playerId:playerId,
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
      resetCallbacks = [],
      over = false,
      winningPlayerId = app.none;

  function updateState() {
    gameState = app.serialize({
      type:type,
      playerId:playerId,
      squares:squares,
      over:over,
      winningPlayerId:winningPlayerId
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

  function saveWinningPlayerId(playerId) {
    winningPlayerId = playerId;
    over = playerId !== app.none;
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
    over = newGame.over;
    winningPlayerId = newGame.winningPlayerId;
    updateState();
    if (callbackCount > 0) {
      while (callbackCount >= 0) {
        resetCallbacks[callbackCount].call(null, newGame);
        callbackCount -= 1;
      }
    }
  }

  function resetGame() {
    var emptySquare = c3.square(app.none, app.none),
        i;

    for (i = 0; i < 9; i += 1) {
      squares[i] = emptySquare;
    }
    setGame({
      type:type,
      playerId:app.player1,
      squares:squares,
      over:over,
      winningPlayerId:winningPlayerId
    });
  }

  return {
    get:getGame,
    set:setGame,
    reset:resetGame,
    saveCurrentPlayerId:saveCurrentPlayerId,
    saveSquare:saveSquare,
    addResetNotification:addResetNotification,
    saveWinningPlayerId:saveWinningPlayerId
  };
}(c3));

/*global c3 */
/*jslint plusplus: true */

c3.board = (function (app) {
  "use strict";
  var pieces = [],
      rows = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];

  function getWinningPlayerId(currentGame) {
    var rowCount = rows.length - 1,
        squares = currentGame.squares,
        playerId,
        rowDone;

    while (rowCount >= 0) {
      rowDone = false;
      while (!rowDone) {
        playerId = squares[rows[rowCount][0]].playerId;
        if (app.isNone(playerId)) {
          rowDone = true;
        } else {
          if (app.equals(playerId, squares[rows[rowCount][1]].playerId) &&
              app.equals(playerId, squares[rows[rowCount][2]].playerId)) {
            return playerId;
          } else {
            rowDone = true;
          }
        }
      }
      rowCount -= 1;
    }
    return app.none;
  }

  function getSquarePiece(index) {
    return pieces[index];
  }

  function setSquarePiece(index, piece, game) {
    pieces[index] = piece;
    game.saveSquare(index, app.toSquare(piece));
    game.saveCurrentPlayerId(
        app.equals(piece.playerId, app.player1) ? app.player2 : app.player1);
    game.saveWinningPlayerId(getWinningPlayerId(game.get()));
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
    for (i = 0; i < 9; i += 1) {
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
        .html('<img src="images/piece' +
          newPiece.size + '_player' + newPiece.playerId + '.svg" />')
        .removeClass(oldPiece.className)
        .addClass(newPiece.className);
  }

  function disableSquare(squareId) {
    var square = $("#" + squareId);
    if (square.hasClass("sqr")) {
      $("#" + squareId).off("click")
          .removeClass("sqr")
          .addClass("sqr-off");
    }
  }

  function disableBoard() {
    $("*").css("cursor","default");
    $(".sqr").off("click")
        .removeClass("sqr")
        .addClass("sqr-off");
  }

  function setMessage(msg) {
    $("#message").text(msg);
  }

  function changePlayerTurn(playerId) {
    var oldClass = "player-" +
        (app.equals(playerId, app.player1) ?
            app.player2 : app.player1);

    $("#message")
        .removeClass(oldClass)
        .addClass("player-" + playerId);

    setMessage("Player " + (playerId + 1) + "'s turn.");
  }

  function clickSquare(squareId) {
    var oldPiece,
        newPiece,
        updatedGame;
    oldPiece = board.getSquarePiece(squareId);

    if (oldPiece.size === app.smallPiece &&
        oldPiece.playerId === game.get().playerId) {
      return;
    }

    newPiece = app.piece(
        oldPiece.getNextSize(),
        game.get().playerId
    );
    setBoardSquare(squareId, newPiece.size, newPiece.playerId);
    paintSquare(squareId, oldPiece, newPiece);
    if (newPiece.size === app.largePiece) {
      disableSquare(squareId);
    }

    updatedGame = game.get();

    if (updatedGame.over) {
      disableBoard();
      setMessage("PLAYER " +
          (updatedGame.winningPlayerId + 1) +
          " WINS!");
    } else {
      changePlayerTurn(updatedGame.playerId);
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

    changePlayerTurn(0);

    container.fadeIn("slow");
  }

  return {
    run:setup,
    setMessage:setMessage
  };

}(jQuery, c3, c3.board, c3.game));