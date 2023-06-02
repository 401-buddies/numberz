'use strict';

const { io } = require('socket.io-client');

// Connect to the game server
const socket = io('http://localhost:3001/numberz');
const { startGame } = require('./handler');
const store = 'game-room';

// Join the game room
socket.emit('join', store);

// Event listener for successful connection to the game server
socket.on('connect', () => {
  console.log('Game controller connected to the game server.');

  // Start the game when connected
  startGame(socket);
});

// Event listener for disconnection from the game server
socket.on('disconnect', () => {
  console.log('Game controller disconnected from the game server.');
});

socket.on('gameStart', () => {
  console.log('Game is beginning. Players, make your guess!');
});
