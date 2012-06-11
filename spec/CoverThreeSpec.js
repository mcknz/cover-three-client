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
    loadFixtures('Test.html');
    c3.init();
  });
  it("starts with first player turn", function () {
    expect(c3.game.get().playerId).toBe(c3.player1);
  });
  it("has a small player 1 piece in the first square when clicked", function () {
    $("#0").click();
    expect($("#0")).toContain($("img[src~='images/piece0_player0.svg']"));
  });
  it("current player is player 2 after the first square is clicked", function () {
    $("#0").click();
    expect(c3.game.get().playerId).toBe(c3.player2);
  });
  it("has large player 2 piece in first square after both players click first square", function () {
    var game = c3.game.get();
    $("#0").click();
    $("#0").click();
    expect($("#0")).toContain($("img[src~='images/piece1_player1.svg']"));
  });
  it("cannot change square after large piece added", function () {
    $("#0").click();
    $("#0").click();
    expect($("#0")).toHaveClass("sqr-off");
  });
  it("cannot set small piece to large for the same player", function () {
    var game = c3.game.get();
    $("#0").click();
    $("#1").click();
    $("#0").click();
    expect(c3.game.get().squares[0].size).toBe(c3.smallPiece);
  });

});

describe("message", function () {
  "use strict";
  beforeEach(function () {
    loadFixtures('Test.html');
    c3.init();
  });
  it("is player 1 turn first", function () {
    expect($("#message").text()).toBe("Player 1's turn.");
  });
  it("is player 1 color first", function () {
    expect($("#message")).toHaveClass("player-0");
  });
  it("is not player 2 turn first", function () {
    expect($("#message").text()).not.toBe("Player 2's turn.");
  });
  it("is not player 2 color first", function () {
    expect($("#message")).not.toHaveClass("player-1");
  });
  it("is player 2 turn second", function () {
    $("#0").click();
    expect($("#message").text()).toBe("Player 2's turn.");
  });
  it("is player 2 color second", function () {
    $("#0").click();
    expect($("#message")).toHaveClass("player-1");
  });
  it("is not player 1 turn second", function () {
    $("#0").click();
    expect($("#message").text()).not.toBe("Player 1's turn.");
  });
  it("is not player 1 color second", function () {
    var game = c3.ui.setMessage("s");
    $("#0").click();
    expect($("#message")).not.toHaveClass("player-0");
  });
  it("is player 1 turn third", function () {
    $("#0").click();
    $("#1").click();
    expect($("#message").text()).toBe("Player 1's turn.");
  });
  it("is player 1 color third", function () {
    $("#0").click();
    $("#1").click();
    expect($("#message")).toHaveClass("player-0");
  });
  it("is not player 2 turn third", function () {
    $("#0").click();
    $("#1").click();
    expect($("#message").text()).not.toBe("Player 2's turn.");
  });
  it("is not player 2 color third", function () {
    $("#0").click();
    $("#1").click();
    expect($("#message")).not.toHaveClass("player-1");
  });
});

describe("winning the game", function () {
  "use strict";
  beforeEach(function () {
    loadFixtures('Test.html');
    c3.init();
    $("#0").click(); //player 1
    $("#3").click(); //player 2
    $("#1").click(); //player 1
    $("#4").click(); //player 2
    $("#2").click(); //player 1 wins
  });
  it("happens when three in a row", function () {
    expect(c3.game.get().over).toBeTruthy();
  });
  it("has correct player", function () {
    expect(c3.game.get().winningPlayerId).toBe(c3.player1);
  });
  it("has correct message", function () {
    expect($("#message").text()).toBe("PLAYER 1 WINS!");
  });
});


describe("piece", function () {
  "use strict";
  it("has no class name when none", function () {
    expect(help.getNoPiece().className).toBe("");
  });
  it("has no player class name when none", function () {
    expect(help.getNoPiece().className).not.toContain("playerId");
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
});

describe("playerId", function () {
  "use strict";
  it("has player one id when created as player one", function () {
    expect(help.getPlayer1SmallPiece().playerId).toBe(c3.player1);
  });
  it("has player two id when created as player two", function () {
    expect(help.getPlayer2SmallPiece().playerId).toBe(c3.player2);
  });
});

describe("board", function () {
  "use strict";
  beforeEach(function () {
    c3.game.addResetNotification(c3.board.reset);
    c3.game.reset();
  });
  it("has square one empty on start", function () {
    expect(c3.board.getSquarePiece(0).equals(help.getNoPiece())).toBeTruthy();
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
  function getNoPiece() {
    return c3.piece(c3.none, c3.none);
  }

  function getPlayer1SmallPiece() {
    return c3.piece(c3.smallPiece, c3.player1);
  }

  function getPlayer2SmallPiece() {
    return c3.piece(c3.smallPiece, c3.player2);
  }

  function getPlayer1LargePiece() {
    return c3.piece(c3.largePiece, c3.player1);
  }

  function getPlayer2LargePiece() {
    return c3.piece(c3.largePiece, c3.player2);
  }

  function boardSquareHasPiece(index, piece) {
    return c3.board.getSquarePiece(index).equals(piece);
  }

  return {
    getPlayer1SmallPiece:getPlayer1SmallPiece,
    getPlayer2SmallPiece:getPlayer2SmallPiece,
    getPlayer1LargePiece:getPlayer1LargePiece,
    getPlayer2LargePiece:getPlayer2LargePiece,
    boardSquareHasPiece:boardSquareHasPiece,
    getNoPiece:getNoPiece
  };
}());


