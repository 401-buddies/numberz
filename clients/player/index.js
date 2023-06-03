'use strict';

const { io } = require('socket.io-client');
const readline = require('readline');

// Connect to the game server
const socket = io('http://localhost:3001/numberz');

// Event listener for gameStart event
socket.on('gameStart', () => {
  console.log('Game has started! Guess a number between 1 and 100.');
});

console.log('Player 1 connected to the game server.');

// Create a readline interface for reading user input from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt the player to enter a guess
rl.question('Enter your guess (a number between 1 and 100): ', (guess) => {
  // Send the guess to the server
  socket.emit('guess', parseInt(guess));

  // Close the readline interface
  rl.close();
});

// Event listener for guessReceived event
// setTimeout(() => {
  
// }, 3000);
socket.on('guessReceived', (payload) => {
  const { guess } = payload;
  console.log(`Player 1 has guessed ${guess}`);
});

// Event listener for guessResults event
socket.on('guessResults', (payload) => {
  const { results, correctNumber } = payload;

  // Iterate through the results and display messages based on the guesses
  for (const playerId in results) {
    const guess = results[playerId];

    if (guess < correctNumber) {
      console.log(`Player ${playerId}: Guess higher!`);
    } else if (guess > correctNumber) {
      console.log(`Player ${playerId}: Guess lower!`);
    } else {
      console.log(`Player ${playerId}: Congratulations! You guessed the correct number!`);
    }
  }
});


