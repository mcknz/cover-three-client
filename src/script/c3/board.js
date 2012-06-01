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