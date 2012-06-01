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
