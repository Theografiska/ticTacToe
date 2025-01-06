function GameBoard() {
    const board = [];

    for (let i = 0; i <= 2; i++) {
        board[i] = [];
        for (let j = 0; j <= 2; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const resetBoard = () => {
        for (let i = 0; i <= 2; i++) {
            board[i] = [];
            for (let j = 0; j <= 2; j++) {
                board[i].push(Cell());
            }
        }
    }

    const makeChoice = (rowIndex, columnIndex, player) => {
        let choice = board[rowIndex][columnIndex].getValue();

        if (choice === "") { 
            board[rowIndex][columnIndex].getChoice(player); // only an empty cell can be filled
        } else {
            return; 
        }
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => {
            return row.map((cell) => {
                return cell.getValue();
            });
        });
        console.log(boardWithCellValues);
    }

    return { getBoard, makeChoice, printBoard, resetBoard };
};

// A Cell represents one "square" on the board and can have one of "": no token is in the square, "X": Player One's token, "O": Player 2's token

function Cell() {
    let value = "";

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
    playerOneName,
    playerTwoName
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

        const gameDisplay = document.querySelector("#game-display");

        const printNewRound = () => {
            board.printBoard();
            gameIsActive = true;
            gameDisplay.textContent = `${getActivePlayer().name}'s turn.`;
            console.log(`${getActivePlayer().name}'s turn.`); // can remove later
        };

        // reset button functionality
        const restartBtn = document.querySelector("#restart-btn");
        restartBtn.addEventListener("click", () => {
            board.resetBoard();
            board.getBoard();
            printNewRound();
            DisplayGame();
            gameDisplay.style.backgroundColor = "black";
            gameDisplay.style.color = "white";
            restartBtn.style.display = "none";
        })

        const playRound = (rowIndex, columnIndex) => {
            console.log(`${getActivePlayer().name}'s choice was ${rowIndex +1}. row and ${columnIndex +1}. column...`);
            board.makeChoice(rowIndex, columnIndex, getActivePlayer().token);

            const victoryMessage = () => {
                console.log(`Congratz, ${getActivePlayer().name}, you have won!`);
                    restartBtn.style.display = "block";
                    gameDisplay.textContent = `Congratz, ${getActivePlayer().name}, you have won!`;
                    gameDisplay.style.backgroundColor = "gold";
                    gameDisplay.style.color = "black";
                    gameIsActive = false;
            }

            // checking winner
            for (i = 0; i <= 2; i++) {
                // logic to check whether a player has taken some row
                if (board.getBoard()[i][0].getValue() === getActivePlayer().token && board.getBoard()[i][1].getValue() === getActivePlayer().token && board.getBoard()[i][2].getValue() === getActivePlayer().token) {
                    victoryMessage();
                    return;
                } 
                // logic to check whether a player has taken some column
                else if (board.getBoard()[0][i].getValue() === getActivePlayer().token && board.getBoard()[1][i].getValue() === getActivePlayer().token && board.getBoard()[2][i].getValue() === getActivePlayer().token) {
                    victoryMessage();
                    return;
                } 
                // logic to check whether a player has taken some diagonal
                else if (board.getBoard()[0][0].getValue() === getActivePlayer().token && board.getBoard()[1][1].getValue() === getActivePlayer().token && board.getBoard()[2][2].getValue() === getActivePlayer().token || board.getBoard()[2][0].getValue() === getActivePlayer().token && board.getBoard()[1][1].getValue() === getActivePlayer().token && board.getBoard()[0][2].getValue() === getActivePlayer().token) {
                    victoryMessage();
                    return;
                }
            }

            // checking a tie. When all the cells are populated and there hasn't been a winner, the game will be finished with a tie. 
            let isTie = true;
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    if (board.getBoard()[i][j].getValue() === "") {
                        isTie = false;
                        break; // exit the inner loop if "" is found
                    } 
                }
                if (!isTie) break; // exit the outer loop if "" is found
            }

            if (isTie) {
                console.log(`It's a tie!`);
                restartBtn.style.display = "block";
                gameDisplay.textContent = `It's a tie!`;
                gameDisplay.style.backgroundColor = "gray";
                gameDisplay.style.color = "white";
                gameIsActive = false;
                return;
            }

            if (gameIsActive) {
                switchPlayerTurn();
                printNewRound();
            }
        };

        DisplayGame(); // initial game rendering to DOM
        
        return {
            playRound,
            getActivePlayer,
            switchPlayerTurn,
            printNewRound
        };
}

function DisplayGame() {
    // start button kicks off the game
    const startBtn = document.querySelector("#start-btn");
    startBtn.addEventListener("click", () => {
        game.printNewRound();
        startBtn.style.display = "none";
        const hiddenItems = document.querySelectorAll(".hidden");
        hiddenItems.forEach((item) => {
            item.style.display = "block";
        })
    });

    // rendering players' names
    let firstPlayer = document.querySelector("#player-one-name");
    firstPlayer.textContent = playerOneName + ": X";

    let secondPlayer = document.querySelector("#player-two-name");
    secondPlayer.textContent = playerTwoName + ": O";

    const board = GameBoard();

    const RenderBoard = () => {
        const board = GameBoard();

        const allCells = document.querySelectorAll(".cell");
        allCells.forEach((cell) => {
            let cellId = cell.id;
            let rowIndex = Number(cellId.split("-")[0]);
            let columnIndex = Number(cellId.split("-")[1]);
            cell.textContent = board.getBoard()[rowIndex][columnIndex].getValue();
            cell.addEventListener("click", () => {
                if (cell.textContent === "" && gameIsActive) {
                    cell.textContent = game.getActivePlayer().token;
                    game.playRound(rowIndex,columnIndex);
                }
            })
        })
    }
    RenderBoard();
}

let gameIsActive = false;

const game = GameController(playerOneName = prompt("First player name", "Player 1"), playerTwoName = prompt("Second player name", "Player 2"));
