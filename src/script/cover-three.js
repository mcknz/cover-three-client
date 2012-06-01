/*global jQuery */
/*jslint plusplus: true, white: true */

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

c3.player = (function () {
    "use strict";
    var type = "player";

    function getPlayer(id) {
        function equals(other) {
            c3.ensureType(type, other);
            return c3.equals(id, other.id);
        }

        return {
            type:type,
            id:id,
            equals:equals
        };
    }

    return {
        one:getPlayer(0),
        two:getPlayer(1),
        none:getPlayer(c3.none),
        get:getPlayer
    };
}());

c3.piece = (function () {
    "use strict";
    var type = "piece",
        entities = [
            [c3.player1SmallPiece, c3.player2SmallPiece],
            [c3.player1LargePiece, c3.player2LargePiece]
        ];

    function getPiece(size, player) {
        var content, className, isNoPiece;

        function getClassName(isNone) {
            return isNone ? "" : "piece-" + size + " player-" + player.id;
        }

        function getContent(isNone) {
            return isNone ? 0 : entities[size][player.id];
        }

        function getIsNoPiece() {
            return c3.isNone(size) || c3.isNone(player.id);
        }

        function equals(other) {
            c3.ensureType(type, other);
            return c3.equals(size, other.size) &&
                player.equals(other.player);
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
            equals:equals
        };
    }

    function getNextSize(currentPiece) {
        return currentPiece.size === c3.none ? c3.piece.small : c3.piece.large;
    }

    return {
        small:0,
        large:1,
        get:getPiece,
        none:getPiece(c3.none, c3.player.none),
        getNextSize:getNextSize
    };
}());

c3.square = (function () {
    "use strict";
    function getSquare(size, playerId) {
        return {
            type:"square",
            pl:playerId,
            sz:size
        };
    }

    return {
        get:getSquare,
        none:getSquare(c3.none, c3.none)
    };
}());

c3.state = (function() {
    "use strict";
    var type = "state",
        serializedState = null,
        playerId = c3.player1,
        squares = [],
        resetCallback = null;

    function updateState() {
        serializedState = c3.serialize({
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

    function getState() {
        return c3.deserialize(serializedState);
    }

    function setState(newState) {
        c3.ensureType(type, newState);
        if(c3.equals(serializedState, c3.serialize(newState))) {
            return;
        }
        playerId = newState.playerId;
        squares = newState.squares;
        updateState();
        if(resetCallback !== null) {
            resetCallback(newState);
        }
    }

    function resetState() {
        var i;
        for (i = 0; i < 9; i++) {
            squares[i] = c3.square.none;
        }
        setState({
            type:type,
            playerId:c3.player1,
            squares:squares
        });
    }

    resetState();

    return {
        get:getState,
        set:setState,
        reset:resetState,
        saveCurrentPlayerId: saveCurrentPlayerId,
        saveSquare:saveSquare,
        addResetNotification:addResetNotification
    };
}());

c3.board = (function(player, initialState) {
    "use strict";
    var pieces = [];

    function getCurrentPlayer(currentState) {
        return player.get(currentState.playerId);
    }

    function setCurrentPlayer(currentPlayer, state) {
        state.saveCurrentPlayerId(currentPlayer.id);
    }

    function getSquarePiece(index) {
        return pieces[index];
    }

    function setSquarePiece(index, piece, state) {
        pieces[index] = piece;
        state.saveSquare(index, c3.toSquare(piece));
    }

    function resetBoard(currentState) {
        var squares = currentState.squares,
            i;
        for (i = 0; i < 9; i++) {
            pieces[i] = c3.toPiece(squares[i]);
        }
    }

    resetBoard(initialState);

    return {
        getSquarePiece:getSquarePiece,
        setSquarePiece:setSquarePiece,
        getCurrentPlayer:getCurrentPlayer,
        setCurrentPlayer:setCurrentPlayer,
        reset:resetBoard
    };
}(c3.player, c3.state.get()));

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
            e.originalEvent.preventDefault();
        });

        container.fadeIn("slow");
    }

    return {
        run:setup,
        clickSquare: clickSquare
    };

}(jQuery, c3, c3.piece, c3.board, c3.state));

c3.state.addResetNotification(c3.board.reset);
jQuery(c3.ui.run);

