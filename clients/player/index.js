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
  
  // Iterate through the results and display messages based on the guesses
  for (const id in results) {
    const guess = results[id];
    console.log('Im a guess', guess, 'I am guess.id', results.id, 'I am guess.guess', results.guess);
    console.log('I am inside for loop', payload);

    if (guess.id < correctNumber) {
      setTimeout(() => {
        console.log(`${guess.id}: Guess higher!`);
        guessInput();
      }, 1000);

    } else if (guess.id > correctNumber) {
      setTimeout(() => {
        console.log(`${guess.id}: Guess lower!`);
        guessInput();
      }, 1000);
    } else {
      console.log(`${guess.id}: Congratulations! You guessed the correct number!`);
    }
  }

  socket.on('disconnect', () => {
    console.log(id, ' disconnected from the game server.');
  });
});


