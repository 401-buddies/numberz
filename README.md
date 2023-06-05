# Numberz

Numberz is a multiplayer number guessing game where players try to guess a randomly generated number. It is built with Node.js and Socket.IO.

## Features

- Multiple players can join the game and make guesses simultaneously.
- The game provides feedback to players, indicating whether their guess should be higher or lower.
- The game ends when a player guesses the correct number.
- The server keeps track of the player guesses and broadcasts the results to all players.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/numberz.git
   ```

2. Navigate to the project directory:

   ```bash
   cd numberz
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

# To Run

To run the application please use ```node index.js```


2. Players can join the game by connecting to `http://localhost:3001` in their web browsers.

3. Players will be prompted to enter their guesses when the game starts.

4. The game provides feedback to each player based on their guesses.

5. The game ends when a player guesses the correct number, and the results are displayed to all players.

## Configuration

The server configuration can be modified by editing the `.env` file in the project root directory.

- `PORT`: Specifies the port number on which the server will listen (default is `3001`).

## Running Tests

Your scripts section should have the following, so that you can easily run tests locally and in your CI.

```json
  "scripts": {
    "start": "node index.js",
    "test": "jest --verbose --coverage",
    "test-watch": "jest --watchAll --verbose --coverage",
    "init:config": "sequelize init:config",
    "db:create": "sequelize db:create"
},
```

The following tests can be run to ensure the functionality and edge cases of the Numberz application:
- Run Command: `npm test`

- Test 1: Simultaneous guesses from multiple players.
  - Description: Verify that the game correctly handles and updates the guesses from multiple players at the same time.
  

- Test 2: Guesses exceeding the number range.
  - Description: Ensure that the game handles guesses that are outside the specified number range (1-100) and provides appropriate feedback to the players.
  

- Test 3: Correct guess from the first attempt.
  - Description: Validate that the game correctly identifies and displays the result when a player guesses the correct number on their first attempt.
  

- Test 4: Multiple correct guesses in one round.
  - Description: Check that the game handles the scenario where multiple players guess the correct number in the same round and displays the results correctly.
  

- Test 5: Disconnect and reconnection of players.
  - Description: Verify that the game maintains the state of the ongoing game even when players disconnect and reconnect.
 
 ## Collaborators
  Thanks to Kati Lee and Nick Mullaney for rocking such a cool project
  Thanks to ChatGPT for double checking consistency errors and tests, prompts to follow.
  Thanks also to Ryan Gallaway for pulling us out of the weeds and getting us back on the path!
  
##  UML for Lab 14
![Alt text](assets/lab14%20numberz.png)

## License

This project is licensed under the [MIT License](LICENSE).
