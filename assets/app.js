//#region Global Variables
const intervalID = { timer: 0, wait: 0, blink: 0 };
const timeoutID = { AI: 0, turnend: 0 };
const playerInfo = { marker: "", turn: 0, wins: 0 };
const AIinfo = { type: "AI", marker: "", turn: 0, wins: 0 };
const markXO = {
  o: '<img src="images/noughts.png" alt="X-mark" />',
  x: '<img src="images/crosses.png" alt="O-mark" />',
};
const accenno = {
  board: {
    r1: { c1: 0, c2: 0, c3: 0 },
    r2: { c1: 0, c2: 0, c3: 0 },
    r3: { c1: 0, c2: 0, c3: 0 },
  },
  turnTracker: 1,
  roundTracker: 1,
};
accenno.turnTracker = 1;

//#endregion
//#region HTML elements
const heading = $("#heading");
const mainMenuBtn = $(".mainmenu-btn");
const cursor = $("#anim-cursor");
const quitBtns = $(".quit-btn");
const gameBoard = $(".xo-board");
const gameCell = $(".xo-cell");
const circle = $("#circle");

const marker = $(".marker-buttons");

const cover = $(".accenno-cover");
const startMenu = $(".start-menu");
const waiting = $(".waiting");
const timeout = $("#timeout");
const endingTurn = $(".ending-turn");

const newRound = $(".new-round");
const newRoundBtn = $("#new-round-btn");
const nextRoundbtn = $("#next-round");

const timerText = $("#timer-text");
const popup = $(".popup");
const turnText = $("#turn-text");
const resText = $("#result-text");
const resSubtext = $("#result-subtext");

circle.circleProgress({
  value: 0,
  size: $(".turn-status").height() * 0.9,
  thickness: 20,
  fill: {
    gradient: ["#FF4A4A", "#FF9551"],
  },
});
$(document).ready(function () {
  setTimeout(function () {
    $(document).scrollTop(0);
  }, 100);
  initialise();
});

//#endregion

//#region Functions
function headerAnimation() {
  heading.text("");
  let i = 0;
  let title = "ACCENNO";
  let speed = 200;

  setTimeout(typeWriter, 500);
  function typeWriter() {
    if (i < title.length) {
      heading.text(heading.text() + title.charAt(i));
      i++;
      setTimeout(typeWriter, speed);
    }
  }
}

function initialise() {
  resetGame();
  headerAnimation();

  intervalID.blink = setInterval(function () {
    $("#blinking-header").toggle();
  }, 500);
  toggleCover("NG");
  popup.hide();
}

function returnToMenu() {
  $("html, body").animate({ scrollTop: 0 }, 800);
  setTimeout(function () {
    initialise();
  }, 800);
}

(function ($) {
  $.fn.placeMarker = function () {
    if (this.hasClass("empty")) {
      gameCell.removeClass("active");
      this.removeClass("empty");
      if (playerInfo.turn === accenno.turnTracker) {
        this.html(playerInfo.marker);
      } else {
        this.html(AIinfo.marker);
      }
    }
    return this;
  };
})(jQuery);

//#endregion

//#region Main Menu
function gotoTarget() {
  let playerType = $(this).data("target");

  if (playerType == "how") {
    $("html, body").animate(
      { scrollTop: $("#instructions").offset().top },
      800
    );
  } else if (playerType == "AI" || playerType == "2P") {
    $("html, body").animate({ scrollTop: $("#gameboard").offset().top }, 800);
    AIinfo.type = playerType;
  }
  setTimeout(function () {
    clearInterval(intervalID.blink);
    heading.text("");
  }, 500);
}
//#endregion

//#region Instructions animation
//soon
//#endregion

//#region Buttons
mainMenuBtn.click(gotoTarget);
quitBtns.click(returnToMenu);
newRoundBtn.click(turns);
nextRoundbtn.click(nextRound);
gameCell.dblclick(confirmMark);
marker.click(chooseMarker);
gameCell.click(toggleSelected);

//#endregion

//#region Game Algorithm
function chooseMarker() {
  playerInfo.marker = markXO[$(this).data("marker")];
  if (playerInfo.marker === markXO.o) {
    AIinfo.marker = markXO.x;
    playerInfo.turn = 1;
    AIinfo.turn = 2;
  } else {
    AIinfo.marker = markXO.o;
    playerInfo.turn = 2;
    AIinfo.turn = 1;
  }
  turns();
}

function turns() {
  if (playerInfo.turn === accenno.turnTracker) {
    turnPlayer();
  } else {
    turnAI();
  }
}

function turnPlayer() {
  turnText.text("P1 Turn");
  turnTimer();
  toggleCover();
}

function toggleSelected() {
  if ($(this).hasClass("active")) {
    $(this).removeClass("active");
  } else {
    gameCell.removeClass("active");
    $(this).addClass("active");
  }
}

function confirmMark() {
  $(this).placeMarker();
  markBoard($(this).data("pos"));
  endTurn();
}

function endTurn() {
  turnTimeout();
  toggleCover("ET");
  timeoutID.turnend = setTimeout(function () {
    if (accenno.turnTracker == 1) {
      accenno.turnTracker++;
    } else if (accenno.turnTracker == 2) {
      accenno.turnTracker--;
    }
    if (endRound()) {
      popup.show();
    } else {
      turns();
    }
  }, 1250);
}

function turnAI() {
  turnTimer();

  if (AIinfo.type === "AI") {
    turnText.text("AI Turn");
    toggleCover("AI");

    const chooseAI = () => {
      let rowAI = "r" + Math.ceil(Math.random() * 3);
      let colAI = "c" + Math.ceil(Math.random() * 3);
      return [rowAI, colAI];
    };

    let randomTime = 1000 + Math.ceil(Math.random() * 9) * 1000;

    let occupied = true;
    let selectionAI = chooseAI();

    while (occupied === true) {
      if (accenno.board[selectionAI[0]][selectionAI[1]] !== 0) {
        selectionAI = chooseAI();
      } else {
        occupied = false;
      }
    }

    timeoutID.AI = setTimeout(function () {
      const placeAI = $(".xo-board tr").find(
        `[data-pos="${selectionAI.join("")}"]`
      );
      markBoard(selectionAI);
      placeAI.html(AIinfo.marker);
      endTurn();
    }, randomTime);
  } else {
    turnText.text("P2 Turn");
    turnTimer();
    toggleCover();
  }
}

function endRound() {
  let winner = winCondition();
  if (winner !== 0) {
    popupMessage(winner);
    return true;
  } else if (boardFilled()) {
    popupMessage(0);
    return true;
  } else {
    return false;
  }
}
//#endregion
//#region Win Conditions + Post turn stuff
function popupMessage(winner) {
  let resultText = {
    h2: {
      draw: "DRAW!",
      P1AI: "YOU WIN!",
      P1P2: "P1 WINS!",
      AI: "You lose",
      P2: "P2 WINS!",
    },
    p: {
      draw: "There are no winners today.",
      win: "Congratulations! Click the button below to play again!",
      lose: "Tough luck! Click Play Again for a rematch!",
    },
  };

  if (winner === 0) {
    resText.text(resultText.h2.draw);
    resSubtext.text(resultText.p.draw);
  } else if (playerInfo.turn === winner) {
    if (AIinfo.type === "AI") {
      resText.text(resultText.h2.P1AI);
      resSubtext.text(resultText.p.win);
      pointTracking(1);
    } else {
      resText.text(resultText.h2.P1P2);
      resSubtext.text(resultText.p.win);
      pointTracking(1);
    }
  } else {
    if (AIinfo.type === "AI") {
      resText.text(resultText.h2.AI);
      resSubtext.text(resultText.p.lose);
      pointTracking(2);
    } else {
      resText.text(resultText.h2.P2);
      resSubtext.text(resultText.p.win);
      pointTracking(2);
    }
  }
  return;
}

function boardFilled() {
  for (const row in accenno.board) {
    for (const col in accenno.board[row]) {
      if (accenno.board[row][col] === 0) {
        return false;
      }
    }
  }
  return true;
}

function winCondition() {
  if (
    (accenno.board.r1.c1 === accenno.board.r2.c1 &&
      accenno.board.r1.c1 === accenno.board.r3.c1 &&
      accenno.board.r1.c1 === 1) ||
    (accenno.board.r1.c2 === accenno.board.r2.c2 &&
      accenno.board.r1.c2 === accenno.board.r3.c2 &&
      accenno.board.r1.c2 === 1) ||
    (accenno.board.r1.c3 === accenno.board.r2.c3 &&
      accenno.board.r1.c3 === accenno.board.r3.c3 &&
      accenno.board.r1.c3 === 1) ||
    (accenno.board.r1.c1 === accenno.board.r1.c2 &&
      accenno.board.r1.c1 === accenno.board.r1.c3 &&
      accenno.board.r1.c1 === 1) ||
    (accenno.board.r2.c1 === accenno.board.r2.c2 &&
      accenno.board.r2.c1 === accenno.board.r2.c3 &&
      accenno.board.r2.c1 === 1) ||
    (accenno.board.r3.c1 === accenno.board.r3.c2 &&
      accenno.board.r3.c1 === accenno.board.r3.c3 &&
      accenno.board.r3.c1 === 1) ||
    (accenno.board.r1.c1 === accenno.board.r2.c2 &&
      accenno.board.r1.c1 === accenno.board.r3.c3 &&
      accenno.board.r1.c1 === 1) ||
    (accenno.board.r1.c3 === accenno.board.r2.c2 &&
      accenno.board.r1.c3 === accenno.board.r3.c1 &&
      accenno.board.r1.c3 === 1)
  ) {
    return 1;
  } else if (
    (accenno.board.r1.c1 === accenno.board.r2.c1 &&
      accenno.board.r1.c1 === accenno.board.r3.c1 &&
      accenno.board.r1.c1 === 2) ||
    (accenno.board.r1.c2 === accenno.board.r2.c2 &&
      accenno.board.r1.c2 === accenno.board.r3.c2 &&
      accenno.board.r1.c2 === 2) ||
    (accenno.board.r1.c3 === accenno.board.r2.c3 &&
      accenno.board.r1.c3 === accenno.board.r3.c3 &&
      accenno.board.r1.c3 === 2) ||
    (accenno.board.r1.c1 === accenno.board.r1.c2 &&
      accenno.board.r1.c1 === accenno.board.r1.c3 &&
      accenno.board.r1.c1 === 2) ||
    (accenno.board.r2.c1 === accenno.board.r2.c2 &&
      accenno.board.r2.c1 === accenno.board.r2.c3 &&
      accenno.board.r2.c1 === 2) ||
    (accenno.board.r3.c1 === accenno.board.r3.c2 &&
      accenno.board.r3.c1 === accenno.board.r3.c3 &&
      accenno.board.r3.c1 === 2) ||
    (accenno.board.r1.c1 === accenno.board.r2.c2 &&
      accenno.board.r1.c1 === accenno.board.r3.c3 &&
      accenno.board.r1.c1 === 2) ||
    (accenno.board.r1.c3 === accenno.board.r2.c2 &&
      accenno.board.r1.c3 === accenno.board.r3.c1 &&
      accenno.board.r1.c3 === 2)
  ) {
    return 2;
  } else {
    return 0;
  }
}

function markBoard(pos) {
  let row;
  let col;
  if (jQuery.type(pos) === "array") {
    row = pos[0];
    col = pos[1];
  } else {
    row = pos.slice(0, 2);
    col = pos.slice(2);
  }
  accenno.board[row][col] = accenno.turnTracker;
  return;
}
//#endregion
//#region timer functions

function turnTimer() {
  let timer = 30;

  circle.circleProgress({
    value: 1,
    animation: { duration: 30000, easing: "linear" },
  });
  intervalID.timer = setInterval(function () {
    timer -= 1;
    timerText.text(timer);
    if (timer === 0) {
      turnTimeout(0);
    }
  }, 1000);
}

function turnTimeout(num) {
  clearInterval(intervalID.timer);
  clearInterval(intervalID.wait);
  clearTimeout(timeoutID.AI);
  clearTimeout(timeoutID.turnend);
  circle.circleProgress({
    value: 0,
  });
  timerText.text("30");

  if (num === 0) {
    toggleCover("TO");
    endTurn();
  }
  return;
}

//#endregion
//#region
function toggleCover(arg) {
  if (!arg) {
    cover.hide();
    startMenu.hide();
    waiting.hide();
    timeout.hide();
    newRound.hide();
    endingTurn.hide();
  } else {
    toggleCover();
    if (arg === "AI") {
      waiting.show();
      waitForAI();
    } else if (arg === "NR") {
      newRound.show();
    } else if (arg === "TO") {
      timeout.show();
      waiting.show();
      waitForAI();
    } else if (arg === "NG") {
      startMenu.show();
    } else if (arg === "ET") {
      endingTurn.show();
    }
    cover.show();
  }
  return;
}

function waitForAI() {
  intervalID.wait = setInterval(function () {
    const dots = $("#wait-anim");

    let num = dots.text().length;

    if (num < 3) {
      dots.text(dots.text() + ".");
    } else {
      dots.text("");
    }
  }, 300);
  return;
}

function resetGame() {
  turnTimeout();
  resetBoard();
  accenno.roundTracker = 1;

  AIinfo.turn = 0;
  AIinfo.marker = "";
  AIinfo.type = "";
  AIinfo.wins = 0;

  playerInfo.turn = 0;
  playerInfo.marker = "";
  playerInfo.wins = 0;

  $(".tally-box").css("background-color", "#fff");

  toggleCover("NG");

  return;
}

function resetBoard() {
  for (const row in accenno.board) {
    for (const col in accenno.board[row]) {
      accenno.board[row][col] = 0;
    }
  }
  gameCell.removeClass("active");
  gameCell.addClass("empty");
  gameCell.html("");

  accenno.turnTracker = 1;
  popup.hide();
  return;
}

function nextRound() {
  accenno.roundTracker += 1;
  $("#round-num").text(accenno.roundTracker);
  if (playerInfo.turn === 1) {
    playerInfo.turn = 2;
    playerInfo.marker = markXO.x;
    AIinfo.turn = 1;
    AIinfo.marker = markXO.o;
  } else {
    playerInfo.turn = 1;
    playerInfo.marker = markXO.o;
    AIinfo.turn = 2;
    AIinfo.marker = markXO.x;
  }
  resetBoard();
  toggleCover("NR");
}

function pointTracking(num) {
  if (num === 1) {
    playerInfo.wins += 1;
    for (let i = 1; i <= playerInfo.wins; i++) {
      $("#status-p1 .tally")
        .find(".win-" + i)
        .css("background-color", "#46fa76");
    }
  } else if (num === 2) {
    AIinfo.wins += 1;
    for (let i = 1; i <= AIinfo.wins; i++) {
      $("#status-p2 .tally")
        .find(".win-" + i)
        .css("background-color", "#46fa76");
    }
  }
}

//#endregion
