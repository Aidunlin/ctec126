/** @type {HTMLDivElement} */
const deckDisplay = document.getElementById("deck");
/** @type {HTMLDivElement} */
const actionMessage = document.getElementById("action");
/** @type {HTMLButtonElement} */
const shuffleButton = document.getElementById("shuffle");
/** @type {HTMLButtonElement} */
const removeButton = document.getElementById("remove");
/** @type {HTMLButtonElement} */
const newDeckButton = document.getElementById("new-deck");
/** @type {HTMLButtonElement} */
const showFacesButton = document.getElementById("show-faces");
/** @type {HTMLButtonElement} */
const showBacksButton = document.getElementById("show-backs");

/** Relative URL to an image of the back of a card. */
const BACK_IMAGE = "img/back.png";

class PlayingCard {
    /**
     * Constructs a new playing card with a face and suit.
     * Each `PlayingCard` object has an image element associated with it that can be toggled to show its face or back.
     * @param {string} face 
     * @param {string} suit 
     */
    constructor(face, suit) {
        /** @type {HTMLImageElement} */
        this.element = document.createElement("img");
        /** @type {string} */
        this.suit = suit;
        /** @type {string} */
        this.face = face;
        /** @type {string} */
        this.faceImage = `img/${face}_of_${suit}.png`;

        this.element.src = BACK_IMAGE;
        this.element.onclick = () => {
            this.isFacing = !this.isFacing;
        };
    }

    /** Returns whether the card's image source is set to its face */
    get isFacing() {
        return this.element.src.endsWith(this.faceImage);
    }

    /** Sets the image source to its face or back image. */
    set isFacing(val) {
        if (val) {
            this.element.src = this.faceImage;
        } else {
            this.element.src = BACK_IMAGE;
        }
    }
}

/**
 * Contains the timeout ID for clearing the action message.
 * @type {number | undefined}
 */
let actionTimeout;

/** 
 * Contains playing cards.
 * @type {PlayingCard[]}
 */
let deck = buildDeck();
shuffleDeck();
displayDeck();

/**
 * Displays a message, and optionally for how long to display it.
 * @param {string} message The message to display. If left blank, essentially resets the action message.
 * @param {number} seconds The number of seconds to display the message. If not set, it will display it indefinitely.
 */
function setAction(message = "", seconds = 0) {
    // Clears the previous timeout if it existed.
    if (actionTimeout != undefined) {
        clearTimeout(actionTimeout);
        actionTimeout = undefined;
    }

    actionMessage.innerHTML = message;

    // Sets a new timeout to clear the message.
    if (seconds > 0) {
        actionTimeout = setTimeout(() => actionMessage.innerHTML = "", seconds * 1000);
    }
}

/** Clears the deck display and displays every card in the deck. */
function displayDeck() {
    deckDisplay.innerHTML = "";
    deck.forEach(card => deckDisplay.append(card.element));
}

/** Shuffles the deck in place using the [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle). */
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        // Random index between 0 and i (inclusive).
        const j = Math.floor(Math.random() * (i + 1));

        // Exchanges cards at index i and index j.
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

/**
 * Creates and returns a deck of un-shuffled playing cards.
 * @returns {PlayingCard[]}
 */
function buildDeck() {
    let newDeck = [];
    const suits = ["hearts", "spades", "diamonds", "clubs"];
    const faces = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

    suits.forEach(suit => {
        faces.forEach(face => {
            newDeck.push(new PlayingCard(face, suit));
        });
    });

    return newDeck;
}

/* Handle button click events. */

shuffleButton.onclick = () => {
    shuffleDeck();
    displayDeck();
    setAction("The deck of cards has been shuffled.", 3);
};

removeButton.onclick = () => {
    if (deck.length > 0) {
        deck[0].element.remove();
        deck.shift();
    }

    setAction("A card was removed.", 3);
    if (deck.length == 0) {
        setAction("There are no cards left in the deck.");
    }
};

newDeckButton.onclick = () => {
    deck = buildDeck();
    displayDeck();
    setAction("A new deck of cards has been created for you.", 3);
};

showFacesButton.onclick = () => {
    deck.forEach(card => card.isFacing = true);
    setAction("All of the card faces are now showing.", 3);
};

showBacksButton.onclick = () => {
    deck.forEach(card => card.isFacing = false);
    setAction("All of the card backs are now showing.", 3);
};
