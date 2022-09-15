//#region Global Variables
const intervalID = { timer: 0, wait: 0, blink: 0, animHow: 0 };
const timeoutID = { AI: 0, turnend: 0, animation: 0 };
const playerInfo = { marker: "", turn: 0, wins: 0 };
const AIinfo = { type: "AI", marker: "", turn: 0, wins: 0 };
const markXO = {
  o: '<img src="images/noughts.png" alt="O-mark" />',
  x: '<img src="images/crosses.png" alt="X-mark" />',
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

//#endregion
//#region jquery functions
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
  $.fn.animClick = function () {
    if (!this.attr("src")) {
      return this;
    } else {
      const cursorMode = ["images/cursor.png", "images/cursor-click.png"];
      const fxCursor = this;
      fxCursor.attr("src", cursorMode[1]);
      setTimeout(function () {
        fxCursor.attr("src", cursorMode[0]);
        return this;
      }, 150);
    }
  };
})(jQuery);

//#endregion
//#region HTML elements
const heading = $("#heading");
const mainMenuBtn = $(".mainmenu-btn");
const quitBtns = $(".quit-btn");
const credits = $("#credits-btn");

const cursor = $("#anim-cursor");
const animCell = $(".xo-cell-ex");
const howCell = $(".instruction-text div");
const animCover = $(".accenno-cover-ex");
const animCross = $("#anim-cross");
const animNought = $("#anim-nought");
const playAnim = $("#play-anim");

const gameBoard = $(".xo-board");
const gameCell = $(".xo-cell");
const marker = $(".marker-buttons");

const cover = $(".accenno-cover");
const startMenu = $(".start-menu");
const waiting = $(".waiting");
const timeout = $("#timeout");
const endingTurn = $(".ending-turn");
const newRound = $(".new-round");
const newRoundBtn = $("#new-round-btn");
const nextRoundbtn = $("#next-round");

const circle = $("#circle");
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

//#endregion
//#region initialisation

function initialise() {
  resetGame();
  headerAnimation();
  animCover.hide();
  animCross.hide();
  animNought.hide();

  intervalID.blink = setInterval(function () {
    $("#blinking-header").toggle();
  }, 500);
  toggleCover("NG");
  popup.hide();
}

//#endregion
//#region event listeners

$(document).ready(function () {
  setTimeout(function () {
    $(document).scrollTop(0);
  }, 100);
  initialise();
});

mainMenuBtn.click(gotoTarget);
quitBtns.click(returnToMenu);
newRoundBtn.click(turns);
nextRoundbtn.click(nextRound);
marker.click(chooseMarker);
gameCell.click(toggleSelected);
gameCell.dblclick(confirmMark);
playAnim.click(animateHow);
credits.click(gotoCredits);

//#endregion

//#region Navigation
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

function returnToMenu() {
  $("html, body").animate({ scrollTop: 0 }, 800);
  setTimeout(function () {
    initialise();
  }, 800);
}

function gotoCredits() {
  $("html, body").animate(
    { scrollTop: $("#credits-section").offset().top },
    800
  );
}
//#endregion
//#region Animation
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

function animateHow() {
  const resetPosition = () => {
    cursor.animate({ top: "25%", left: "25%" }, 500);
    animCross.hide("fade");
    animNought.hide("fade");
    animCover.hide();
    howCell.removeClass("active", 500, "swing");
    $("r2c2").addClass("active");
    playAnim.button({ disabled: false });
  };
  const firstAnim = () => {
    howCell.removeClass("active", 500, "swing");
    $(".one").addClass("active", 500, "swing");

    cursor.animate({ left: "+=100%", top: "-=100%" }, 1500);
    setTimeout(function () {
      toggleHoverClick("r1c2");
      setTimeout(function () {
        toggleHoverClick("r1c3");
        setTimeout(function () {
          cursor.animate({ top: "+=200%" }, 1500);
          setTimeout(function () {
            toggleHoverClick("r2c3");
            setTimeout(function () {
              toggleHoverClick("r3c3");
              setTimeout(function () {
                cursor.animate({ left: "-=200%" }, 1500);
                setTimeout(function () {
                  toggleHoverClick("r3c2");
                  setTimeout(function () {
                    toggleHoverClick("r3c1");
                    setTimeout(function () {
                      cursor.animate({ left: "+=100%", top: "-=100%" }, 1500);
                      setTimeout(function () {
                        toggleHoverClick("r2c1");
                        setTimeout(function () {
                          toggleHoverClick("r2c2");
                          setTimeout(() => {
                            secondAnim();
                          }, 1000);
                        }, 150);
                      }, 600);
                    }, 500);
                  }, 500);
                }, 500);
              }, 500);
            }, 500);
          }, 500);
        }, 750);
      }, 150);
    }, 600);

    //
    //
    //
  };
  const secondAnim = () => {
    howCell.removeClass("active", 500, "swing");
    $(".two").addClass("active", 500, "swing");

    cursor.animClick();
    toggleHoverClick("r2c2");

    setTimeout(() => {
      cursor.animate({ top: "+=100%" }, 1500);
      setTimeout(() => {
        toggleHoverClick("r3c2");
        setTimeout(() => {
          cursor.animClick();
          toggleHoverClick("r3c2");
          setTimeout(() => {
            cursor.animate({ top: "-=200%", left: "-=100%" }, 1500);
            setTimeout(() => {
              toggleHoverClick("r2c2");
              setTimeout(() => {
                toggleHoverClick("r2c1");
                setTimeout(() => {
                  toggleHoverClick("r1c1");
                  setTimeout(() => {
                    cursor.animClick();
                    toggleHoverClick("r1c1");
                    setTimeout(() => {
                      cursor.animate({ top: "+=100%", left: "+=100%" }, 1500);
                      setTimeout(() => {
                        toggleHoverClick("r2c2");
                        setTimeout(() => {
                          cursor.animClick();
                          toggleHoverClick("r2c2");
                          setTimeout(() => {
                            cursor.animClick();
                            toggleHoverClick("r2c2");
                            setTimeout(() => {
                              thirdAnim();
                            }, 1000);
                          }, 1500);
                        }, 900);
                      }, 750);
                    }, 500);
                  }, 750);
                }, 250);
              }, 250);
            }, 400);
          }, 200);
        }, 1000);
      }, 700);
    }, 500);
  };
  const thirdAnim = () => {
    howCell.removeClass("active", 500, "swing");
    $(".three").addClass("active", 500, "swing");

    cursor.animate({ top: "+=100%", left: "+=100%" }, 1500);
    setTimeout(() => {
      toggleHoverClick("r3c3");
      setTimeout(() => {
        cursor.animClick();
        toggleHoverClick("r3c3");
        setTimeout(() => {
          cursor.animClick();
          toggleHoverClick();
          animNought.show();
          setTimeout(() => {
            cursor.animate({ left: "+=150%" }, 1500);
            setTimeout(() => {
              fourthAnim();
            }, 1000);
          }, 300);
        }, 200);
      }, 900);
    }, 700);
  };
  const fourthAnim = () => {
    howCell.removeClass("active", 500, "swing");
    $(".four").addClass("active", 500, "swing");

    animCover.show("clip");

    let animID = setInterval(() => {
      const dots = $("#wait-anim-ex");

      let num = dots.text().length;

      if (num < 3) {
        dots.text(dots.text() + ".");
      } else {
        dots.text("");
      }
    }, 250);

    setTimeout(() => {
      animCross.show();
      animCover.hide("clip");
      clearInterval(animID);
      setTimeout(() => {
        resetPosition();
      }, 2000);
    }, 4000);
  };

  resetPosition();

  playAnim.button({ disabled: true });

  setTimeout(() => {
    firstAnim();
  }, 1000);
}

function toggleHoverClick(id) {
  if (!id) {
    animCell.removeClass("anim-hover");
    animCell.removeClass("anim-click");
  } else if ($(`#${id}`).hasClass("anim-hover")) {
    animCell.removeClass("anim-hover");
    animCell.removeClass("anim-click");
    $(`#${id}`).addClass("anim-click");
  } else if ($(`#${id}`).hasClass("anim-click")) {
    animCell.removeClass("anim-hover");
    animCell.removeClass("anim-click");
    $(`#${id}`).addClass("anim-hover");
  } else {
    animCell.removeClass("anim-hover");
    $(`#${id}`).addClass("anim-hover");
  }
}

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
//#region game related
function toggleCover(arg) {
  const hideAll = () => {
    startMenu.hide("clip");
    waiting.hide("clip");
    timeout.hide("clip");
    newRound.hide("clip");
    endingTurn.hide("clip");
  };

  if (!arg) {
    hideAll();
    cover.hide("clip");
  } else {
    if (arg === "AI") {
      hideAll();
      waiting.show("clip");
      waitForAI();
    } else if (arg === "NR") {
      hideAll();
      newRound.show("clip");
    } else if (arg === "TO") {
      hideAll();
      timeout.show("clip");
      waiting.show("clip");
      waitForAI();
    } else if (arg === "NG") {
      hideAll();
      startMenu.show("clip");
    } else if (arg === "ET") {
      hideAll();
      endingTurn.show("clip");
    }
    cover.show("clip");
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
