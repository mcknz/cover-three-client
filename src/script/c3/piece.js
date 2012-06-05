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
