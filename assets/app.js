//#region Global Variables
const intervalID = { timer: 0, wait: 0, blink: 0 };
const playerInfo = { marker: "", turn: 0 };
const AIinfo = { type: "AI", marker: "", turn: 0 };
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
const newRound = $("#new-round");
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
  headerAnimation();

  intervalID.blink = setInterval(function () {
    $("#blinking-header").toggle();
  }, 500);
  waiting.hide();
  popup.hide();
}

function returnToMenu() {
  accenno.turnTracker = 1;
  accenno.roundTracker = 1;
  AIinfo.type = "";
  playerInfo.marker = "";

  for (const row in accenno.board) {
    for (const col in accenno.board[row]) {
      accenno.board[row][col] = 0;
    }
  }

  gameCell.removeClass("active");
  gameCell.html("");
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
      this.html(playerInfo.marker);
      markBoard(this.data("pos"), playerInfo.turn);
    }
    return this;
  };
  $.fn.toggleSelected = function () {
    if (this.hasClass("active")) {
      this.removeClass("active");
    } else {
      gameCell.removeClass("active");
      this.addClass("active");
    }
    return this;
  };
})(jQuery);

//#endregion

//#region Main Menu
mainMenuBtn.click(function () {
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
});
//#endregion

//#region Instructions animation
//soon
//#endregion

//#region Back Buttons

quitBtns.click(returnToMenu);
//#endregion

marker.click(function () {
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
});

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

gameCell.click(function () {
  $(this).toggleSelected();
});

gameCell.dblclick(function () {
  $(this).placeMarker();
  endTurn();
});

function endTurn() {
  turnTimeout();
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

    let randomTime = 1000 + Math.floor(Math.random() * 10) * 1000;

    let occupied = true;
    let selectionAI = chooseAI();

    while (occupied === true) {
      if (accenno[selectionAI[0]][selectionAI[1]] !== 0) {
        selectionAI = chooseAI();
      } else {
        occupied = false;
      }
    }
    setTimeout(function () {
      const placeAI = $(".xo-board tr").find(`[data-pos="${selectionAI[0]}"]`);
      markBoard(selectionAI, AIinfo.turn);
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
    } else {
      resText.text(resultText.h2.P1P2);
      resSubtext.text(resultText.p.win);
    }
  } else {
    if (AIinfo.type === "AI") {
      resText.text(resultText.h2.AI);
      resSubtext.text(resultText.p.lose);
    } else {
      resText.text(resultText.h2.P2);
      resSubtext.text(resultText.p.win);
    }
  }
}

function turnTimeout() {
  clearInterval(intervalID.timer);
  clearInterval(intervalID.wait);
  circle.circleProgress({
    value: 0,
  });
  timerText.text("30");
}

function markBoard(pos, player) {
  let row = pos.slice(0, 2);
  let col = pos.slice(-2);

  accenno[row][col] = player;
}

function boardFilled() {
  for (const row in accenno.board) {
    for (const col in accenno.board[row]) {
      if (accenno[row][col] === 0) {
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
      turnTimeout();
    }
  }, 1000);
}

function toggleCover(arg) {
  if (!arg) {
    cover.hide();
    startMenu.hide();
    waiting.hide();
  } else if (arg === "AI") {
    cover.show();
    waitForAI();
  } else if (arg === "reset") {
    cover.show();
    if (accenno.roundTracker > 1) {
      newRound.show();
    } else {
      startMenu.show();
    }
  }
}

function waitForAI() {
  waiting.show();
  intervalID.wait = setInterval(function () {
    const dots = $("#wait-anim");

    let num = dots.text().length;

    if (num < 3) {
      dots.text(dots.text() + ".");
    } else {
      dots.text("");
    }
  }, 500);
}
