function GameBoard() {
    const board = [];

    for (let i = 0; i <= 2; i++) {
        board[i] = [];
        for (let j = 0; j <= 2; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const makeChoice = (rowIndex, columnIndex, player) => {
        let choice = board[rowIndex][columnIndex].getValue();

        if (choice === 0) { 
            board[rowIndex][columnIndex].getChoice(player); // only an empty cell can be filled
        } else {
            console.log(`That cell is chosen already. Make another choice.`)
            game.switchPlayerTurn(); // No execution, gives the player another chance. Otherwise they'll miss a turn.
            return; 
        }
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return { getBoard, makeChoice, printBoard };
};

/*
** A Cell represents one "square" on the board and can have one of
** 0: no token is in the square,
** "X": Player One's token,
** "O": Player 2's token
*/

function Cell() {
    let value = 0;

    // accept a player's input:
    const getChoice = (player) => {
        value = player; // getActivePlayer().token goes here
    };

    // retrieve the value through closure
    const getValue = () => value;

    return {
        getChoice,
        getValue
    }
}

function Player(name, token) {
    this.name = name;
    this.token = token;
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
        const board = GameBoard();

        const players = [
            new Player(playerOneName, "X"),
            new Player(playerTwoName, "O")
        ];

        let activePlayer = players[0];

        const switchPlayerTurn = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        };
        const getActivePlayer = () => activePlayer;

        const printNewRound = () => {
            board.printBoard();
            console.log(`${getActivePlayer().name}'s turn.`);
        };

        const playRound = (rowIndex, columnIndex) => {
            console.log(`${getActivePlayer().name}'s choice was ${rowIndex +1}. row and ${columnIndex +1}. column...`);
            board.makeChoice(rowIndex, columnIndex, getActivePlayer().token);

            // checking winner here
            for (i=0; i<=2; i++) {
                // logic to check whether a player has taken some row
                if (
                    board.getBoard()[i][0].getValue() === getActivePlayer().token && 
                    board.getBoard()[i][1].getValue() === getActivePlayer().token && 
                    board.getBoard()[i][2].getValue() === getActivePlayer().token
                ) {
                    console.log(`Congratz, ${getActivePlayer().name}, you have won!`);
                    return;
                } 
                // logic to check whether a player has taken some column
                else if (
                    board.getBoard()[0][i].getValue() === getActivePlayer().token && 
                    board.getBoard()[1][i].getValue() === getActivePlayer().token && 
                    board.getBoard()[2][i].getValue() === getActivePlayer().token
                ) {
                    console.log(`Congratz, ${getActivePlayer().name}, you have won!`);
                    return;
                } 
                // logic to check whether a player has taken some diagonal
                else if (
                    board.getBoard()[0][0].getValue() === getActivePlayer().token && 
                    board.getBoard()[1][1].getValue() === getActivePlayer().token && 
                    board.getBoard()[2][2].getValue() === getActivePlayer().token || 
                    board.getBoard()[2][0].getValue() === getActivePlayer().token && 
                    board.getBoard()[1][1].getValue() === getActivePlayer().token && 
                    board.getBoard()[0][2].getValue() === getActivePlayer().token
                ) {
                    console.log(`Congratz, ${getActivePlayer().name}, you have won!`);
                    return;
                }
            }

            // checking a tie. When all the cells are populated and there hasn't been a winner, the game will be finished with a tie. 
            let isTie = true;
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    if (board.getBoard()[i][j].getValue() === 0) {
                        isTie = false;
                        break; // exit the inner loop if `0` is found
                    } 
                }
                if (!isTie) break; // exit the outer loop if `0` is found
            }

            if (isTie) {
                console.log(`It's a tie!`);
                return;
            }

            switchPlayerTurn();
            printNewRound();
        };

        printNewRound(); // initial play game message

        return {
            playRound,
            getActivePlayer,
            switchPlayerTurn
        };
}

function DisplayGame() {
    const board = GameBoard();

    const startBtn = document.querySelector("#start-btn");
    startBtn.addEventListener("click", () => {
        // getting players' names
        const playerOneName = document.querySelector("#player-one-name");
        playerOneName.textContent = prompt("Please enter player 1 name") + ": X";

        const playerTwoName = document.querySelector("#player-two-name");
        playerTwoName.textContent = prompt("Please enter player 2 name") + ": O";

        const players = [
            new Player(playerOneName, "X"),
            new Player(playerTwoName, "O")
        ];
    
        let activePlayer = players[0];
    
        const switchPlayerTurn = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        };
    
        const getActivePlayer = () => activePlayer;

        // rendering the board 
        const printNewRound = () => {
            board.printBoard();
            console.log(`${getActivePlayer().name}'s turn.`);
        };

        printNewRound();

        // first row
        const cellOne = document.querySelector("#zero-zero");
        cellOne.textContent = board.getBoard()[0][0].getValue();

        const cellTwo = document.querySelector("#zero-one");
        cellTwo.textContent = board.getBoard()[0][1].getValue();

        const cellThree = document.querySelector("#zero-two");
        cellThree.textContent = board.getBoard()[0][2].getValue();

        // second row
        const cellFour = document.querySelector("#one-zero");
        cellFour.textContent = board.getBoard()[1][0].getValue();

        const cellFive = document.querySelector("#one-one");
        cellFive.textContent = board.getBoard()[1][1].getValue();

        const cellSix = document.querySelector("#one-two");
        cellSix.textContent = board.getBoard()[1][2].getValue();

        // third row
        const cellSeven = document.querySelector("#two-zero");
        cellSeven.textContent = board.getBoard()[2][0].getValue();

        const cellEight = document.querySelector("#two-one");
        cellEight.textContent = board.getBoard()[2][1].getValue();

        const cellNine = document.querySelector("#two-two");
        cellNine.textContent = board.getBoard()[2][2].getValue();

        const cells = document.getElementsByClassName("cell");
        cells.forEach(cell => {
            addEventListener("click", () => {
                let choice = getChoice();
                cell.textContent = choice;
            })
        });

        // starting the game
        const game = GameController(playerOneName, playerTwoName);

        const gameTurn = document.querySelector("#game-turns-container");


    })
}

const start = DisplayGame();