/*global jQuery, c3, event */

c3.ui = (function ($, app, board, game) {
    "use strict";
    var container = $("#gridContainer"),
        squares = $(".sqr");

    //var defaultCursor = container.css("cursor");
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

    function takeTurn(squareId) {
        var oldPiece = board.getSquarePiece(squareId),
            newPiece = app.piece(
                oldPiece.getNextSize(),
                game.get().playerId
            );
        setBoardSquare(squareId, newPiece.size, newPiece.playerId);
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

}(jQuery, c3, c3.board, c3.game));