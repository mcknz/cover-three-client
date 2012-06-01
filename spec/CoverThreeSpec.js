/*global jasmine, c3, describe, it, expect, beforeEach, loadFixtures, $ */
var help;
describe("App", function () {
  "use strict";
  it("runs", function () {
    expect(2 + 2).toBe(4);
  });
});

jasmine.getFixtures().fixturesPath = '../src';

describe("page", function () {
  "use strict";
  beforeEach(function () {
    c3.game.addResetNotification(c3.board.reset);
    c3.game.reset();
    loadFixtures('Test.html');
  });
  it("starts with first player turn", function () {
    expect(c3.board.getCurrentPlayer(c3.game.get()).id).toBe(c3.player1);
  });
  it("has a small piece in the first square when clicked", function () {
    $(c3.ui.run);
    c3.ui.clickSquare(0);
    expect($("#0")).toHaveText("a");
  });
});

describe("piece", function () {
  "use strict";
  it("has no class name when none", function () {
    expect(c3.piece.none.className).toBe("");
  });
  it("has no player class name when none", function () {
    expect(c3.piece.none.className).not.toContain("player");
  });
  it("has small class name when small", function () {
    expect(help.getPlayer1SmallPiece().className).toContain("piece-0");
  });
  it("has large class name when large", function () {
    expect(help.getPlayer1LargePiece().className).toContain("piece-1");
  });
  it("has player 1 class name when player 1", function () {
    expect(help.getPlayer1LargePiece().className).toContain("player-0");
  });
  it("has player 2 class name when player 2", function () {
    expect(help.getPlayer2LargePiece().className).toContain("player-1");
  });
  it("has correct entity when player 1 small piece", function () {
    expect(help.getPlayer1SmallPiece().content).toBe(c3.player1SmallPiece);
  });
  it("has correct entity when player 2 small piece", function () {
    expect(help.getPlayer2SmallPiece().content).toBe(c3.player2SmallPiece);
  });
});

describe("player", function () {
  "use strict";
  it("has player one id when created as player one", function () {
    expect(c3.player.one.id).toBe(c3.player1);
  });
  it("has player two id when created as player two", function () {
    expect(c3.player.two.id).toBe(c3.player2);
  });
});

describe("board", function () {
  "use strict";
  beforeEach(function () {
    c3.game.addResetNotification(c3.board.reset);
    c3.game.reset();
  });
  it("has square one empty on start", function () {
    expect(c3.board.getSquarePiece(0).equals(c3.piece.none)).toBeTruthy();
  });
  it("can set square", function () {
    c3.board.setSquarePiece(0, help.getPlayer1SmallPiece(), c3.game);
    expect(help.boardSquareHasPiece(0, help.getPlayer1SmallPiece())).toBeTruthy();
  });
  it("can be restored", function () {
    c3.board.setSquarePiece(0, help.getPlayer1SmallPiece(), c3.game);
    var state = c3.game.get();
    c3.board.setSquarePiece(0, help.getPlayer2LargePiece(), c3.game);
    c3.game.set(state);
    expect(help.boardSquareHasPiece(0, help.getPlayer1SmallPiece())).toBeTruthy();
  });
});

help = (function () {
  "use strict";
  function getPlayer1SmallPiece() {
    return c3.piece.get(c3.piece.small, c3.player.one);
  }

  function getPlayer2SmallPiece() {
    return c3.piece.get(c3.piece.small, c3.player.two);
  }

  function getPlayer1LargePiece() {
    return c3.piece.get(c3.piece.large, c3.player.one);
  }

  function getPlayer2LargePiece() {
    return c3.piece.get(c3.piece.large, c3.player.two);
  }

  function boardSquareHasPiece(index, piece) {
    return c3.board.getSquarePiece(index).equals(piece);
  }

  return {
    getPlayer1SmallPiece:getPlayer1SmallPiece,
    getPlayer2SmallPiece:getPlayer2SmallPiece,
    getPlayer1LargePiece:getPlayer1LargePiece,
    getPlayer2LargePiece:getPlayer2LargePiece,
    boardSquareHasPiece:boardSquareHasPiece
  };
}());


