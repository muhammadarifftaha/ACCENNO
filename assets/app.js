//#region Global Variables
let opponentType = "";
let whosTurn = "";
let playerMark = 0;
let timer = 30;
let timerID;

const markXO = ["", "/images/noughts.png", "/images/crosses.png"];
const accenoBoard = {
  r1: { c1: 0, c2: 0, c3: 0 },
  r2: { c1: 0, c2: 0, c3: 0 },
  r3: { c1: 0, c2: 0, c3: 0 },
};
let blinkID;

//HTML elements
const heading = $("#heading");
const mainMenuBtn = $(".mainmenu-btn");
const cursor = $("#anim-cursor");
const quitBtns = $(".quit-btn");
const gameBoard = $(".xo-board");
const gameCell = $(".xo-cell");
const circle = $("#circle");

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

  blinkID = setInterval(function () {
    $("#blinking-header").toggle();
  }, 500);
}

function returnToMenu() {
  opponentType = "";
  whosTurn = 0;
  playerMark = 0;

  gameCell.removeClass("active");
  $("html, body").animate({ scrollTop: 0 }, 800);
  setTimeout(function () {
    initialise();
  }, 800);
}

(function ($) {
  $.fn.placeMarker = function () {
    const marker = $("<img>");
    marker.addClass("marker");
    marker.attr("src", markO);

    if (this.hasClass("empty")) {
      gameCell.removeClass("active");
      this.removeClass("empty");
      this.html(marker);
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
  let target = $(this).data("target");

  if (target == "how") {
    $("html, body").animate(
      { scrollTop: $("#instructions").offset().top },
      800
    );
  } else if (target == "AI" || target == "2P") {
    $("html, body").animate({ scrollTop: $("#gameboard").offset().top }, 800);
    opponentType = target;
  }
  setTimeout(function () {
    clearInterval(blinkID);
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

//#region Game Algorithm
$(".start-game").click(playGame);

gameCell.click(function () {
  $(this).toggleSelected();
});

gameCell.dblclick(function () {
  $(this).placeMarker();
});

function playGame(e) {
  //   whosTurn = "";
  turnTimer();
}

function gameEnd() {
  for (const row in accenoBoard) {
    for (const col in accenoBoard[row]) {
      if (accenoBoard[row][col] === 0) {
        return false;
      }
    }
  }
  return true;
}

function winCondition() {
  if (
    (accenoBoard.r1.c1 === accenoBoard.r2.c1 &&
      accenoBoard.r1.c1 === accenoBoard.r3.c1 &&
      accenoBoard.r1.c1 !== 0) ||
    (accenoBoard.r1.c2 === accenoBoard.r2.c2 &&
      accenoBoard.r1.c2 === accenoBoard.r3.c2 &&
      accenoBoard.r1.c2 !== 0) ||
    (accenoBoard.r1.c3 === accenoBoard.r2.c3 &&
      accenoBoard.r1.c3 === accenoBoard.r3.c3 &&
      accenoBoard.r1.c3 !== 0) ||
    (accenoBoard.r1.c1 === accenoBoard.r1.c2 &&
      accenoBoard.r1.c1 === accenoBoard.r1.c3 &&
      accenoBoard.r1.c1 !== 0) ||
    (accenoBoard.r2.c1 === accenoBoard.r2.c2 &&
      accenoBoard.r2.c1 === accenoBoard.r2.c3 &&
      accenoBoard.r2.c1 !== 0) ||
    (accenoBoard.r3.c1 === accenoBoard.r3.c2 &&
      accenoBoard.r3.c1 === accenoBoard.r3.c3 &&
      accenoBoard.r3.c1 !== 0) ||
    (accenoBoard.r1.c1 === accenoBoard.r2.c2 &&
      accenoBoard.r1.c1 === accenoBoard.r3.c3 &&
      accenoBoard.r1.c1 !== 0) ||
    (accenoBoard.r1.c3 === accenoBoard.r2.c2 &&
      accenoBoard.r1.c3 === accenoBoard.r3.c1 &&
      accenoBoard.r1.c3 !== 0)
  ) {
    return true;
  } else false;
}
//#endregion

//#region document ready
$(document).ready(function () {
  setTimeout(function () {
    $(document).scrollTop(0);
  }, 100);
  initialise();
});
//#endregion

//#region timer
function turnTimer(start = true) {
  if (start) {
    circle.circleProgress({
      value: 1,
      animation: { duration: 30000, easing: "linear" },
    });
    timerID = setInterval(function () {
      timer -= 1;
      $("#timer-text").text(timer);
      if (timer == 0) {
        clearInterval(timerID);
      }
    }, 1000);
  } else {
    clearInterval(timerID);
    circle.circleProgress({
      value: 0,
    });
  }
  return;
}

$("#circle").circleProgress({
  value: 0,
  size: $(".turn-status").height() * 0.9,
  thickness: 20,
  fill: {
    gradient: ["#FF4A4A", "#FF9551"],
  },
});

//#endregion
