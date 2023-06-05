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

  socket.on('gameStart', (payload) => {
    let answer = payload;

    // Store the answer for later
    numberz.correctNumber = answer;

    // Emit the 'gameStart' event to all players
    numberz.emit('gameStart');
  });

  // Event listener for receiving guesses from players
  socket.on('guess', (payload) => {
    const { id, guess } = payload;

    // Store the guess in the playerQueue
    playerQueue.store(id, guess);

    // Emit 'guessReceived' event to all players
    numberz.emit('guessReceived', { id, guess });

  });

  // TODO This isn't working, maybe this needs to be in the game controller side to receive and store players shit
  // Event listener for receiving the guessReceived event
  socket.on('guessChecker', (payload) => {
    // Check if all players have made their guesses

    if (playerQueue.size() === numberz.sockets.size - 2) {
      const results = playerQueue.getAll();
      const correctNumber = numberz.correctNumber;

      // Emit 'guessResults' event with 'results' and 'correctNumber' to all players
      numberz.emit('guessResults', { results, correctNumber });

      // Clear the playerQueue for the next round
      playerQueue.clear();
    }
  });

  // Event listener for winner event
  socket.on('winner', (payload) => {
    const { winner } = payload;
    numberz.emit('winner', { winner });

    // Emit 'disableGuessing' event to all players
    numberz.emit('disableGuessing', { winner });
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
