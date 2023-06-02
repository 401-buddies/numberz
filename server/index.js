'use strict';

require('dotenv').config();

// Import required modules
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3001;
const Queue = require('./lib/queue');
const playerQueue = new Queue();

// Create a socket server instance
const server = new Server();

// Create a namespace for the game
const numberz = server.of('/numberz');

// Event listener for connections to the numberz namespace
numberz.on('connection', (socket) => {
  console.log('Connected to the numberz namespace', socket.id);

  // Event listener for joining a room
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined the ${room} room`);
  });

  // Event listener for starting the game
  socket.on('startGame', () => {
    // Generate a random number for the game
    const correctNumber = Math.floor(Math.random() * 100) + 1;

    // Emit the gameStart event with the correctNumber to all players
    numberz.emit('gameStart', { correctNumber });
  });

  // Event listener for receiving guesses from players
  socket.on('guess', (guess) => {
    const playerId = socket.id;

    // Store the guess in the playerQueue
    playerQueue.store(playerId, guess);

    // Emit guessReceived event to all players
    numberz.emit('guessReceived', { playerId, guess });

    // Check if all players have made their guesses
    if (playerQueue.size() === numberz.sockets.size) {
      const results = playerQueue.getAll();
      const correctNumber = numberz.sockets.get(playerQueue.peekKey()).correctNumber;

      // Emit guessResults event with results and correctNumber to all players
      numberz.emit('guessResults', { results, correctNumber });

      // Clear the playerQueue for the next round
      playerQueue.clear();
    }
  });

  // Event listener for disconnection
  socket.on('disconnect', () => {
    // Remove the player from the playerQueue
    playerQueue.remove(socket.id);
  });
});

// Start the server and listen on the specified PORT
console.log('Listening on PORT:', PORT);
server.listen(PORT);
