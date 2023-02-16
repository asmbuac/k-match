const moves = document.getElementById('moves-count');
const timeValue = document.getElementById('time');
const startButton = document.getElementById('start');
const playAgainButton = document.getElementById('play-again');
const restartButton = document.getElementById('restart');
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const gameContainer = document.querySelector('.memory-game');
const result = document.getElementById('result');
const instructions = document.getElementById('instructions')
const controls = document.querySelector('.controls-container')
let cards;
let interval;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// Initial time
let seconds = 0,
    minutes = 0;
// Initial moves and win count
let movesCount = 0,
    winCount = 0;

// Timer
const timeGenerator = () => {
    seconds += 1;
    // minutes logic
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    // format time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

// Calculating moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

// Cards array
const groups = [
    { name: 'blackpink', image: 'img/blackpink.jpeg' },
    { name: 'bts', image: 'img/bts.jpg' },
    { name: 'ikon', image: 'img/ikon.jpeg' },
    { name: 'newjeans', image: 'img/newjeans.jpeg' },
    { name: 'redvelvet', image: 'img/redvelvet.webp' },
    { name: 'sf9', image: 'img/sf9.webp' },
    { name: 'twice', image: 'img/twice.png' },
    { name: 'winner', image: 'img/winner.webp' },
];

// Randomly pick groups for the game board
const generateRandom = (size = 4) => {
    //temporary array
    let tempArray = [...groups];
    //initializes cardValues array
    let cardValues = [];
    //size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    //Random object selection
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //once selected remove the object from temp array
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

// Generate game board matrix
const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = '';
    cardValues = [...cardValues, ...cardValues];
    //simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        // Create cards
        gameContainer.innerHTML += `
        <div class="memory-card" data-group="${cardValues[i].name}">
            <img src="${cardValues[i].image}" class="front-face">
            <img src="img/backface.png" class="back-face">
        </div>
        `;
    }
    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    // Cards
    cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => card.addEventListener('click', flipCard));
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip')

    if (!hasFlippedCard) {
        // first click
        hasFlippedCard = true;
        firstCard = this;

        return;
    }

    // second click
    secondCard = this;

    movesCounter();

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.group === secondCard.dataset.group;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();

    checkWin();
}

function unflipCards(){
    lockBoard = true;

    setTimeout (() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function checkWin() {
    winCount += 1;
    // check if player won
    if (winCount == Math.floor(8)) {
        let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
        let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
        result.innerHTML = `<h2>You won!</h2>
        <h4>Moves: ${movesCount} | Time: ${minutesValue}:${secondsValue}</h4>`;
        stopGame();
    }
}

// Start game
startButton.addEventListener('click', () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    // Hide instructions
    instructions.classList.add('hide');
    // controls and buttons visibility
    controls.classList.add('hide');
    restartButton.classList.remove('hide');
    pauseButton.classList.remove('hide');
    startButton.classList.add('hide');
    // Start time
    interval = setInterval(timeGenerator, 1000);
    // initial moves
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
    initializer();
});

// Stop game
function stopGame() {
    controls.classList.remove('hide');
    playAgainButton.classList.remove('hide');
    gameContainer.classList.add('hide');
    clearInterval(interval);
}

// Play again
playAgainButton.addEventListener( 'click', () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    gameContainer.classList.remove('hide');
    controls.classList.add('hide');
    restartButton.classList.remove('hide');
    pauseButton.classList.remove('hide');
    playAgainButton.classList.add('hide');
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
    initializer();
});

// Restart game
restartButton.addEventListener('click', () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
    initializer();
});

// Pause game
pauseButton.addEventListener('click', () => {
    clearInterval(interval);
    lockBoard = true;
    pauseButton.classList.add('hide');
    playButton.classList.remove('hide');
})

// Play after pause
playButton.addEventListener('click', () => {
    interval = setInterval(timeGenerator, 1000);
    lockBoard = false;
    playButton.classList.add('hide');
    pauseButton.classList.remove('hide');
})

// Initialize values and function calls
const initializer = () => {
    result.innerText = '';
    winCount = 0;
    let cardValues = generateRandom();
    matrixGenerator(cardValues);
};
