'use strict';

const { io } = require('socket.io-client');

// Establish a connection to the game server
const socket = io('http://localhost:3001/numberz');


const startGame = () => {
  // Generate a random number as the correct answer
  const answer = Math.floor(Math.random() * 100) + 1;

  // Emit the game start event
  // console.log('answer',answer);
  socket.emit('gameStart', answer);
 
  console.log(`Game is beginning. Players, are trying to guess ${answer}!`);
};

module.exports = { startGame };
