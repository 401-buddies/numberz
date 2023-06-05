'use strict';

const { io } = require('socket.io-client');
const readline = require('readline');

// Connect to the game server
const socket = io('http://localhost:3001/numberz');
const id = 'Player 1';

// Variable to keep track of guess input status
let guessEnabled = true;

// Event listener for gameStart event
socket.on('gameStart', () => {
  console.log('Game has started! Guess a number between 1 and 100.');
  let guessEnabled = true;
  guessInput(guessEnabled); // Start the first round
  return guessEnabled;
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
  const { results, correctNumber } = payload;

  // Check if the guess input should be disabled
  if (payload.winner) {
    guessEnabled = false;
  }

  // Get the guess of Player 1
  const player1Guess = results['Player 1'];

  if (player1Guess < correctNumber && guessEnabled) {
    setTimeout(() => {
      console.log('You guessed: ', player1Guess, 'Guess higher!');
      guessInput();
    }, 1000);
  } else if (player1Guess > correctNumber) {
    setTimeout(() => {
      console.log('You guessed: ', player1Guess, 'Guess lower!');
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
  console.log(id, ' disconnected from the game server.');
});
