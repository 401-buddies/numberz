'use strict';

const { io } = require('socket.io-client');

// Connect to the game server
const socket = io('http://localhost:3001/numberz');
const { startGame } = require('./handler');
const room = 'game-controller';

// Join the game room
socket.emit('join', room);

// Event listener for successful connection to the game server
socket.on('connect', () => {
  console.log('Game controller connected to the game server.');

  // Start the game when connected
  startGame();
});

socket.on('guessReceived', (payload) =>{
  console.log('Guess received: ', payload.id, ' guessed ', payload.guess);
  socket.emit('guessChecker', payload);
});

// Event listener for disconnection from the game server
socket.on('disconnect', () => {
  console.log('Game controller disconnected from the game server.');
});

