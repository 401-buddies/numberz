'use strict';

const { io } = require('socket.io-client');
const readline = require('readline');

// Connect to the game server
const socket = io('http://localhost:3001/numberz');
const id = 'Player 2';

// Variable to keep track of guess input status
let guessEnabled = true;

// Event listener for gameStart event
socket.on('gameStart', () => {
  console.log('Game has started! Guess a number between 1 and 100. Gamestart');
  guessInput(); // Start the first round
});

socket.on('connect', () => {
  console.log(id, 'connected to the game server.');
  console.log('Game has started! Guess a number between 1 and 100.');
  setTimeout(() => {
    guessInput();
  }, 2000);
});

function guessInput() {
  if (!guessEnabled) {
    console.log('Guessing is disabled. Wait for the next round.');
    return;
  }

  // Create a readline interface for reading user input from the console
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Prompt the player to enter a guess
  rl.question('Enter your guess (a number between 1 and 100): ', (rawGuess) => {
    let guess = parseInt(rawGuess);
    // Send the guess to the server
    socket.emit('guess', { id, guess });

    // Close the readline interface
    rl.close();
  });
}

// Event listener for guessResults event
socket.on('guessResults', (payload) => {

  // Check if the guess input should be disabled
  if (payload.winner) {
    guessEnabled = false;
  }

  const { results, correctNumber } = payload;

  // Iterate through the results and display messages based on the guesses
  // Get the guess of Player 2
  const player2Guess = results['Player 2'];

  if (player2Guess < correctNumber && guessEnabled === true) {
    setTimeout(() => {
      console.log('You guessed: ', player2Guess, 'Guess higher!');
      guessInput();
    }, 1000);
  } else if (player2Guess > correctNumber) {
    setTimeout(() => {
      console.log('You guessed: ', player2Guess, 'Guess lower!');
      guessInput();
    }, 1000);
  } else {
    console.log('Congratulations! You guessed the correct number!');
    socket.emit('winner', { winner: id }); // Emit 'winner' event with the winner's ID
  }
});

socket.on('disableGuessing', (payload) => {
  console.log(`We have a winner! ${payload.winner}`);
  guessEnabled = false;
});

socket.on('enableGuessing', () => {
  guessEnabled = true;
});

socket.on('disconnect', () => {
  console.log(id, 'disconnected from the game server.');
});
