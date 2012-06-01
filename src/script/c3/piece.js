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
