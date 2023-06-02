'use strict';

const { io } = require('socket.io-client');

// Connect to the game server
const socket = io('http://localhost:3001/numberz');

// Event listener for gameStart event
socket.on('gameStart', (payload) => {
  const { correctNumber } = payload;
  console.log(`Game has started! Guess a number between 1 and 100.`);
});

// Event listener for guessReceived event
socket.on('guessReceived', (payload) => {
  const { playerId, guess } = payload;
  console.log(`Player ${playerId} has guessed ${guess}`);
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

console.log('Player connected to the game server.');
