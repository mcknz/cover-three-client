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
    getContent:getContent
  };
}());
