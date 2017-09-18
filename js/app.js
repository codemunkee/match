// these are the icons on our cards...
const shapes = ['bolt', 'diamond', 'paper-plane-o', 'anchor', 'cube', 'leaf', 'bicycle', 'bomb'];

var State = function () {
    // this keeps a list of the cards we're currently looking at, may or may not have matched
    this.openCards = [],
    this.matches = 0,
    this.nonMatches = 0
};

State.prototype.turnCard = function (card) {
    this.openCards.push(card);
    $(card).addClass('open show');
    if (this.openCards.length === 2) {
        const card1 = $(this.openCards[0]);
        const card2 = $(this.openCards[1]);
        // check if there is a match
        if (card1.data('shape') === card2.data('shape')) {
            this.markMatch();
        } else {
            this.nonMatch();
        }
    }
    console.log(this.openCards);
};

State.prototype.markMatch = function() {
    $(this.openCards[0]).addClass('match');
    $(this.openCards[1]).addClass('match');
    this.openCards = [];
    this.matches++;
};

State.prototype.nonMatch = function() {
    setTimeout(() => {
        console.log('Open Card 0: ' + $(this.openCards[0]));
        $(this.openCards[0]).removeClass('open show');
        $(this.openCards[1]).removeClass('open show');
        this.openCards = [];
    }, 3000);
    this.nonMatches++;
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

function buildBoard(state) {
    let cards = $('.card');
    clearBoard(cards);

    // contains all of the card shapes well display, 2 of each type
    const cardShapes = shuffle([...shapes, ...shapes]);
    addShapes(cards, cardShapes);

    // add event handlers
    for (const card of cards) {
        $(card).click(() => { state.turnCard(card); });
    }
}

function clearBoard(cards) {
    for (const card of cards) {
        // clear card classes
        $(card).attr('class', 'card');
        $(card).children('i').attr('class', 'fa');
    }
}

function addShapes(cards, cardShapes) {
    cards.map((index, card) => {
        $(card).data('shape', cardShapes[index]);
        $(card).children('i').addClass('fa-' + cardShapes[index]);
    });
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
    let state = new State();
    $('i.fa-repeat').click(() => { buildBoard(state) });
    buildBoard(state);
});
