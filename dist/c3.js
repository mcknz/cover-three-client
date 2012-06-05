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
        return c3.square.get(piece.size, piece.player.id);
    }

    function toPiece(square) {
        ensureType("square", square);
        return c3.piece.get(
            square.sz,
            c3.player.get(square.pl)
        );
    }

    function serialize(obj) {
        return JSON.stringify(obj);
    }

    function deserialize(s) {
        return JSON.parse(s);
    }

    return {
        none:none,
        player1:0,
        player2:1,
        smallPiece:0,
        largePiece:1,
        player1SmallPiece:"a",
        player1LargePiece:"A",
        player2SmallPiece:"b",
        player2LargePiece:"B",
        isNone:isNone,
        equals:equals,
        ensureType:ensureType,
        toInt:toInt,
        toPiece:toPiece,
        toSquare:toSquare,
        serialize:serialize,
        deserialize:deserialize
    };
}());

/*global c3 */

c3.player = function(app, id) {
  "use strict";
  var type = "player";

  function equals(other) {
    app.ensureType(type, other);
    return app.equals(id, other.id);
  }

  return {
    type:type,
    id:id,
    equals:equals
  };
};
/*global c3 */

c3.piece = function(size, player, app) {
  "use strict";
  var type = "piece",
      content,
      className,
      isNoPiece,
      text = [
        [app.player1SmallPiece, app.player2SmallPiece],
        [app.player1LargePiece, app.player2LargePiece]
      ];

    function getClassName(isNone) {
        return isNone ? "" : "piece-" + size + " player-" + player.id;
    }

    function getContent(isNone) {
        return isNone ? 0 : text[size][player.id];
    }

    function getIsNoPiece() {
        return app.isNone(size) || app.isNone(player.id);
    }

    function equals(other) {
        app.ensureType(type, other);
        return app.equals(size, other.size) &&
            player.equals(other.player);
    }

    function getNextSize() {
        return size === app.none ? app.smallPiece : app.largePiece;
    }

    isNoPiece = getIsNoPiece();
    content = getContent(isNoPiece);
    className = getClassName(isNoPiece);

    return {
        type:type,
        content:content,
        className:className,
        size:size,
        player:player,
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
        pl:playerId,
        sz:size
    };
};
/*global c3 */
/*jslint plusplus: true */

c3.game = (function(app) {
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

    function setGame(game) {
        app.ensureType(type, game);
        if(app.equals(gameState, app.serialize(game))) {
            return;
        }
        playerId = game.playerId;
        squares = game.squares;
        updateState();
        if(resetCallback !== null) {
            resetCallback(game);
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
        saveCurrentPlayerId: saveCurrentPlayerId,
        saveSquare:saveSquare,
        addResetNotification:addResetNotification
    };
}(c3, c3.square));

/*global c3 */
/*jslint plusplus: true */

c3.board = (function(app) {
    "use strict";
    var pieces = [];

    function getCurrentPlayer(currentGame) {
        return c3.player(currentGame.playerId, app);
    }

    function setCurrentPlayer(currentPlayer, game) {
        game.saveCurrentPlayerId(currentPlayer.id);
    }

    function getSquarePiece(index) {
        return pieces[index];
    }

    function setSquarePiece(index, piece, game) {
        pieces[index] = piece;
        game.saveSquare(index, c3.toSquare(piece));
    }

    function resetBoard(currentGame) {
        var squares = currentGame.squares,
            i;
        for (i = 0; i < 9; i++) {
            pieces[i] = c3.toPiece(squares[i]);
        }
    }

    return {
        getSquarePiece:getSquarePiece,
        setSquarePiece:setSquarePiece,
        getCurrentPlayer:getCurrentPlayer,
        setCurrentPlayer:setCurrentPlayer,
        reset:resetBoard
    };
}(c3));
/*global jQuery, c3, event */

c3.ui = (function ($, app, piece, board, state) {
    "use strict";
    var container = $("#gridContainer"),
        squares = $(".sqr");

    //var defaultCursor = container.css("cursor");
    function setBoardSquare(index, pieceSize) {
        c3.board.setSquarePiece(
            index,
            piece.get(pieceSize, c3.player.one),
            state);
    }

    function paintSquare(squareId, oldPiece, newPiece) {
        $("#" + squareId)
            .text(newPiece.content)
            .removeClass(oldPiece.className)
            .addClass(newPiece.className);
    }

    function takeTurn(squareId) {
        var oldPiece = board.getSquarePiece(squareId),
            newPiece = piece.get(
                piece.getNextSize(oldPiece),
                board.getCurrentPlayer(state.get())
            );
        setBoardSquare(squareId, newPiece.size);
        paintSquare(squareId, oldPiece, newPiece);
    }

    function clickSquare(squareId) {
        takeTurn(squareId);
    }

    function setup() {
        squares.click(function (e) {
            clickSquare(app.toInt(e.target.id));
            container.css("cursor", "pointer");
        });

        squares.mousedown(function (e) {
            //prevent text cursor from showing on click
            if(e.originalEvent.preventDefault) {
                e.originalEvent.preventDefault();
            } else {
                event.returnValue = false;
            }
        });

        container.fadeIn("slow");
    }

    return {
        run:setup,
        clickSquare: clickSquare
    };

}(jQuery, c3, c3.piece, c3.board, c3.game));