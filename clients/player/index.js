'use strict';

const { io } = require('socket.io-client');
const readline = require('readline');

// Connect to the game server
const socket = io('http://localhost:3001/numberz');
const id = 'Player 1';

// Event listener for gameStart event
socket.on('gameStart', () => {
  console.log('Game has started! Guess a number between 1 and 100.');
});

console.log('Player 1 connected to the game server.');
setTimeout(() => {
  guessInput();
}, 2000);


function guessInput() {
  // Create a readline interface for reading user input from the console
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  // Prompt the player to enter a guess
  rl.question('Enter your guess (a number between 1 and 100): ', (rawGuess) => {
    let guess = parseInt(rawGuess);
    // Send the guess to the server
    socket.emit('guess', { guess, id });

    // Close the readline interface
    rl.close();
  });
}

// Event listener for guessReceived event
// setTimeout(() => {

// }, 3000);
// TODO We are hearing here but not on the server
// TODO also if the player guesses before the game controller is up, it says you won
socket.on('guessReceived', (payload) => {
  const { guess } = payload;
  console.log(`Player 1 has guessed ${guess.guess}`);
});

// Event listener for guessResults event
socket.on('guessResults', (payload) => {
  const { results, correctNumber } = payload;

  // Iterate through the results and display messages based on the guesses
  for (const playerId in results) {
    const guess = results[playerId];

    if (guess.guess < correctNumber) {
      setTimeout(() => {
        console.log(`Player ${guess.id}: Guess higher!`);
        guessInput();
      }, 1000);

    } else if (guess.guess > correctNumber) {
      setTimeout(() => {
        console.log(`Player ${guess.id}: Guess lower!`);
        guessInput();
      }, 1000);
    } else {
      console.log(`Player ${guess.id}: Congratulations! You guessed the correct number!`);
    }
  }

  socket.on('disconnect', () => {
    console.log(id, ' disconnected from the game server.');
  });
});


