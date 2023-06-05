'use strict';

const { io } = require('socket.io-client');
const readline = require('readline');

// Connect to the game server
const socket = io('http://localhost:3001/numberz');
const id = 'Player 2';

// Event listener for gameStart event
socket.on('gameStart', () => {
  console.log('Game has started! Guess a number between 1 and 100.');
});

socket.on('connect', () => {
  console.log(id, ' connected to the game server.');
});

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


// Event listener for guessResults event
socket.on('guessResults', (payload) => {
  console.log('I am here', payload);
  const { results, correctNumber } = payload;
  console.log('These are my results', results);

  // Iterate through the results and display messages based on the guesses
  // Get the guess of Player 1
  const player2Guess = results[id];

  if (player2Guess < correctNumber) {
    setTimeout(() => {
      console.log('You guessed: ', player2Guess,'Guess higher!');
      guessInput();
    }, 1000);

  } else if (player2Guess > correctNumber) {
    setTimeout(() => {
      console.log('You guessed: ', player2Guess,'Guess lower!');
      guessInput();
    }, 1000);
  } else {
    console.log('Congratulations! You guessed the correct number!');
  }
});

socket.on('disconnect', () => {
  console.log(id, ' disconnected from the game server.');
});



