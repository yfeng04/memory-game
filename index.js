"use strict";
const cards = Array.from(document.querySelectorAll('.memory-card'));

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedCard = [];
let moves = 0;
let second = 0;
let minute = 0;
let interval;

const $playerName = $('#name');
const $splashScreen = $('#splash');
const $levelScreen = $('#level');
const $easyScreen = $('.easy');
const $difficultScreen = $('.difficult');
const $overScreen = $('#game-over');
const $timer = $(".timer");

const game = {
    isRunning: false,
    currentScreen: "splash",
    
    switchScreen(screen) {
        switch (screen) {
            case 'splash':
                $splashScreen.show();
                $levelScreen.hide();
                $easyScreen.hide();
                $difficultScreen.hide();
                $('.header-quit').hide();
                game.isRunning = false;
                break;
            case 'level':
                $splashScreen.hide();
                $levelScreen.show();
                $easyScreen.hide();
                $difficultScreen.hide();
                $('.header-quit').hide();
                game.isRunning = false;
                break;
            case 'easy':
                $easyScreen.show();
                $splashScreen.hide();
                $difficultScreen.hide();
                $('.header-quit').show();
                game.isRunning = true;
                break;
            case 'difficult':
                $difficultScreen.show();
                $easyScreen.hide();
                $splashScreen.hide();
                $('.header-quit').show();
                game.isRunning = true;
                break;
        };
        
        game.currentScreen = screen;
        
    },

    btnControl() {
        $('.next').on('click', (event) => {
            event.preventDefault();
            if ($playerName.val().length > 0) {
                this.switchScreen('level');
            } else {
                $('.namealert').html(`<p>Please enter your name.</p>`);
            }
        });
    
        $('.easy-btn').on('click', () => {
            this.switchScreen('easy');
            startTimer();
            shuffleCards();
        });
    
        $('.difficult-btn').on('click', () => {
            this.switchScreen('difficult');
            startTimer();
            shuffleCards();
        });
    
        $('.play-again').on('click', () => {
            window.location.reload();
    
        });
    
        $('.header-quit').on('click', () => {
            window.location.reload();
        });
    }

};


function startGame() {
    if (lockBoard) return; //if lockboard is true, rest won't get executed

    //prevent double click the same card
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        //first click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    //second click
    secondCard = this;

    checkForMatch();
    moveCounter();
    finishScreen();
}

function checkForMatch() {
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
        disableCards();
        matchedCard.push(this);
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', startGame);
    secondCard.removeEventListener('click', startGame);

    resetBoard();
}

function unflipCards() {
    lockBoard = true; 
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


// Count player's moves
function moveCounter() {
    if (game.currentScreen === "easy") {
        moves++;
        $(".easy-moves").html(moves);
        $("#final-move").html(moves);
    }

    if (game.currentScreen === "difficult") {
        moves++;
        $(".difficult-moves").html(moves);
        $("#final-move").html(moves);
    }

}

// Timer
function startTimer() {
    interval = setInterval(function () {
        second++;

        $timer.html(`<p>${minute} mins ${second} secs </p>`);

        if (second == 60) {
            minute++;
            second = 0;
        }

    }, 1000);
}


// Display game-over screen 
function finishScreen() {
    if (game.currentScreen === "easy") {
        if (matchedCard.length == 8) {
            game.isRunning = false;
            document.querySelector(".game-over").classList.add("show");
            clearInterval(interval);
            $('#total-time').html(`<p>${minute} mins ${second} secs </p>`);
            $('.display-name').html(`<p>${$playerName.val()}</p>`);
        }
    } else if (game.currentScreen === "difficult") {
        if (matchedCard.length == 18) {
            game.isRunning = false;
            document.querySelector(".game-over").classList.add("show");
            clearInterval(interval);
            $('#total-time').html(`<p>${minute} mins ${second} secs </p>`);
            $('.display-name').html(`<p>${$playerName.val()}</p>`);
        }
    }
}


function shuffleCards() {
    if (game.currentScreen === "easy") {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 16);
            card.style.order = randomPos;
        });
    } else if (game.currentScreen === "difficult") {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 36);
            card.style.order = randomPos;
        });
    }
};


game.switchScreen('splash');
game.btnControl();
cards.forEach(card => card.addEventListener('click', startGame))