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