// these are the icons on our cards...
const shapes = ['bolt', 'diamond', 'paper-plane-o', 'anchor', 'cube', 'leaf', 'bicycle', 'bomb'];

let State = function () {
    // this keeps a list of the cards we're currently looking at
    // that may or may not have matched as well as moves and matches
    this.allCards = [];
    this.openCards = [];
    this.moves = 0;
    this.removedStars = 0;
    this.matches = 0;
    this.seconds = 0;
    this.intervalObj = {};
};

State.prototype.incrementMoves = function() {
    this.moves++;
};

State.prototype.removeStar = function() {
    this.removedStars++;
};

State.prototype.addCard = function(card) {
    this.allCards.push(card);
};

State.prototype.addOpenCard = function(card) {
    this.incrementMoves();
    // after 35 moves and 45 moves we remove stars
    switch (this.moves) {
        case 35:
            this.removeStar();
            break;
        case 45:
            this.removeStar();
            break;
    }
    this.openCards.push(card);
};

State.prototype.clearOpenCards = function() {
    this.openCards = [];
};

State.prototype.incrementSeconds = function() {
    this.seconds++;
};

State.prototype.reset = function() {
    // reset our state
    this.allCards = [];
    this.openCards = [];
    this.moves = 0;
    this.removedStars = 0;
    this.matches = 0;
    this.seconds = 0;
    this.intervalObj = {};
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function toggleCardClicks(state, toggle) {
    // enable or disable click-ability of all cards
    if (toggle === true) {
        state.allCards.map(card => { toggleCardClick(state, true, card)})
    } else if (toggle === false) {
        state.allCards.map(card => { toggleCardClick(state, false, card)})
    }
}

function toggleCardClick(state, toggle, card) {
    // enable or disable click-ability of single card
    if (toggle === true) {
        $(card).unbind();
        $(card).click(() => {
            turnCard(state, card);
        });
    } else if (toggle === false) {
        $(card).off('click');
    }
}

function clearBoard(cards) {
    for (const card of cards) {
        // clears out classes other than card
        $(card).attr('class', 'card');
        $(card).children('i').attr('class', 'fa');
        $(card).unbind();
    }
}

function checkForMatch(state) {
    if (state.openCards.length === 2) {
        const card1 = $(state.openCards[0]);
        const card2 = $(state.openCards[1]);
        // check if there is a match
        if (card1.data('shape') === card2.data('shape')) {
            markMatch(state);
        } else {
            nonMatch(state);
        }
    }
}

function markMatch(state) {
    state.openCards.map(card => { $(card).addClass('match')});
    state.clearOpenCards();
    state.matches++;
    // game has been won!
    if (state.matches === 8) {
        gameOver(state);
    }
}

function nonMatch(state) {
    toggleCardClicks(state, false);
    setTimeout(() => {
        state.openCards.map(card => { $(card).removeClass('open show')});
        state.clearOpenCards();
        toggleCardClicks(state, true)
    }, 1000);
}

function turnCard(state, card) {
    state.addOpenCard(card);
    $(card).addClass('open show');
    toggleCardClick(state, false, card);

    // show the number of moves we've made thus far
    $('#move-count').text(state.moves);

    showStars($('.score-panel-item').children('.stars')[0]);

    checkForMatch(state);

}

function showStars(starParentEl) {
    const stars = $(starParentEl).find('.fa-star');
    for (const star of stars) {
        console.log(star);
        $(star).css('display', 'none');
    }
}

function startTimer(state) {
    // clear timer if previously instantiated
    if (state.intervalObj !== undefined) {
        clearInterval(state.intervalObj);
        state.seconds = 0;
    }
    // start timer
    state.intervalObj = setInterval(() => {
        state.incrementSeconds();
        $('.seconds-passed').text(state.seconds);
    }, 1000)
}

function stopTimer(state) {
    clearInterval(state.intervalObj);
}

function gameOver(state) {
    // the game is over, stop the timer and give the user the results
    // and the option to play again
    stopTimer(state);

    const modal = $('.modal');
    modal.css('display', 'block');

    $('#modal-moves').text(state.moves);
    $('#modal-seconds').text(state.seconds);

    $('#modal-again-no').click(() => {
        modal.css('display', 'none');
    });

    $('#modal-again-yes').click(() => {
        modal.css('display', 'none');
        buildBoard(state);
    });

    // When the user clicks anywhere outside of the modal, close it
    $(window).click(function(evt) {
        if (evt.target.className === 'modal') {
            modal.css('display', 'none');
        }
    });
}

function addShapes(cards, cardShapes) {
    cards.map((index, card) => {
        $(card).data('shape', cardShapes[index]);
        $(card).children('i').addClass('fa-' + cardShapes[index]);
    });
}

function buildBoard(state) {

    // start fresh
    stopTimer(state);
    $('#move-count').text(0);
    $('.seconds-passed').text(0);
    state.reset();

    let cards = $('.card');
    clearBoard(cards);

    const cardShapes = shuffle([...shapes, ...shapes]);
    addShapes(cards, cardShapes);

    for (const card of cards) {
        state.addCard(card);
        $(card).click(() => {
            turnCard(state, card);
        });
    }

    startTimer(state);

}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* On Document Ready */
$(() => {
    // Instantiate state object
    let state = new State();

    // Build our initial board
    buildBoard(state);

    // Allows for new games to be restarted at any time
    $('i.fa-repeat').click(() => { buildBoard(state) });

});
