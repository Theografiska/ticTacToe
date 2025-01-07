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
        console.log(boardWithCellValues); // can remove later
    }

    return { getBoard, makeChoice, printBoard, resetBoard };
};

function Cell() {
    let value = "";

    // accept a player's input:
    const getChoice = (player) => {
        value = player; // getActivePlayer().symbol goes here
    };

    // retrieve the value through closure
    const getValue = () => value;

    return {
        getChoice,
        getValue
    }
}

function Player(name, symbol, color) {
    this.name = name;
    this.symbol = symbol;
    this.color = color;
}

function GameController(
    playerOneName,
    playerTwoName
) {
        const board = GameBoard();

        const players = [
            new Player(playerOneName, "X", "lightblue"),
            new Player(playerTwoName, "O", "lightcoral")
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
            gameDisplay.style.backgroundColor = getActivePlayer().color;
            console.log(`${getActivePlayer().name}'s turn.`); // can remove later
        };

        const playerOneScoreElement = document.querySelector("#player-one-score");
        playerOneScoreElement.textContent = `Total score: ${playerOneScore}`;

        const playerTwoScoreElement = document.querySelector("#player-two-score");
        playerTwoScoreElement.textContent = `Total score: ${playerTwoScore}`;

        // reset button functionality
        const restartBtn = document.querySelector("#restart-btn");
        restartBtn.addEventListener("click", () => {
            board.resetBoard();
            board.getBoard();
            printNewRound();
            DisplayGame();
            gameDisplay.style.color = "white";
            restartBtn.style.display = "none";
        })

        const playRound = (rowIndex, columnIndex) => {
            console.log(`${getActivePlayer().name}'s choice was ${rowIndex +1}. row and ${columnIndex +1}. column...`); // can remove later
            board.makeChoice(rowIndex, columnIndex, getActivePlayer().symbol);

            // victory function (to be used multiple times)
            const victoryMessage = () => {
                console.log(`Congratz, ${getActivePlayer().name}, you have won!`); // can remove later
                restartBtn.style.display = "block";
                gameDisplay.textContent = `Congratz, ${getActivePlayer().name}, you have won!`;
                gameDisplay.style.backgroundColor = "gold";
                gameDisplay.style.color = "black";
                gameIsActive = false;
                if (getActivePlayer().name === players[0].name) {
                    playerOneScore ++;
                    playerOneScoreElement.textContent = `Total score: ${playerOneScore}`;
                } else {
                    playerTwoScore ++;
                    playerTwoScoreElement.textContent = `Total score: ${playerTwoScore}`;
                }
            }

            // checking winner
            for (i = 0; i <= 2; i++) {
                // logic to check whether a player has taken some row
                if (board.getBoard()[i][0].getValue() === getActivePlayer().symbol && board.getBoard()[i][1].getValue() === getActivePlayer().symbol && board.getBoard()[i][2].getValue() === getActivePlayer().symbol) {
                    victoryMessage();
                    return; // return important otherwise it will check if it's a tie
                } 
                // logic to check whether a player has taken some column
                else if (board.getBoard()[0][i].getValue() === getActivePlayer().symbol && board.getBoard()[1][i].getValue() === getActivePlayer().symbol && board.getBoard()[2][i].getValue() === getActivePlayer().symbol) {
                    victoryMessage();
                    return;
                } 
                // logic to check whether a player has taken some diagonal
                else if (board.getBoard()[0][0].getValue() === getActivePlayer().symbol && board.getBoard()[1][1].getValue() === getActivePlayer().symbol && board.getBoard()[2][2].getValue() === getActivePlayer().symbol || board.getBoard()[2][0].getValue() === getActivePlayer().symbol && board.getBoard()[1][1].getValue() === getActivePlayer().symbol && board.getBoard()[0][2].getValue() === getActivePlayer().symbol) {
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
                console.log(`It's a tie!`); // can remove later
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
    // start button kicks off the game and asks for names

    const startBtn = document.querySelector("#start-btn");
    startBtn.addEventListener("click", () => {
        // opening up the dialogue: 
        
        GameController(playerOneName = prompt("First player name", "Player 1"), playerTwoName = prompt("Second player name", "Player 2"));

        game.printNewRound();
        startBtn.style.display = "none";
        const hiddenItems = document.querySelectorAll(".hidden");
        hiddenItems.forEach((item) => {
            item.style.display = "block";
        })
    });

    // rendering players' names
    let firstName = document.querySelector("#player-one-name");
    firstName.textContent = playerOneName + ": X";

    let secondName = document.querySelector("#player-two-name");
    secondName.textContent = playerTwoName + ": O";

    const board = GameBoard();

    const RenderBoard = () => {
        const board = GameBoard();

        // adding listeners to the cells
        const allCells = document.querySelectorAll(".cell");
        allCells.forEach((cell) => {
            let cellId = cell.id;
            let rowIndex = Number(cellId.split("-")[0]);
            let columnIndex = Number(cellId.split("-")[1]);
            cell.textContent = board.getBoard()[rowIndex][columnIndex].getValue();
            cell.addEventListener("click", () => {
                if (cell.textContent === "" && gameIsActive) {
                    cell.textContent = game.getActivePlayer().symbol;
                    cell.style.color = game.getActivePlayer().color;
                    game.playRound(rowIndex,columnIndex);
                }
            })
        })
    }
    RenderBoard();
}

let playerOneScore = 0;
let playerTwoScore = 0;

let gameIsActive = false;

let playerOneName = "Player 1";
let playerTwoName = "Player 2";

const game = GameController(playerOneName, playerTwoName);