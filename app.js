//#region Global Variables
let opponentType = "";

const accenoBoard = {
  r1: { c1: "0", c2: "0", c3: "0" },
  r2: { c1: "0", c2: "0", c3: "0" },
  r3: { c1: "0", c2: "0", c3: "0" },
};
const heading = $("#heading");
const mainMenuBtn = $(".mainmenu-btn");
const cursor = $("#anim-cursor");
const backBtns = $(".back-btn");
const gameBoard = $(".xo-board");
const gameCell = $(".xo-cell");

let blinkID;
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
  gameCell.removeClass("active");
  $("html, body").animate({ scrollTop: 0 }, 800);
  setTimeout(function () {
    initialise();
  }, 800);
}

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
//#region Game Board

gameCell.click(function () {
  gameCell.removeClass("active");
  $(this).addClass("active");
});

//#endregion
//#region Instructions animation
//soon
//#endregion
//#region Back Buttons
backBtns.click(returnToMenu);
//#endregion
//#region Game Algorithm
gameCell.dblCLick(function () {});
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

$("#circle").circleProgress({
  value: 0.75,
  size: $(".turn-status").height() * 0.9,
  fill: {
    gradient: ["red", "orange"],
  },
});

//#endregion
