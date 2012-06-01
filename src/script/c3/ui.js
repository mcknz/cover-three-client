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