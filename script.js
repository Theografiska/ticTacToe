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
        value = player; 
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
    let gameIsActive = false;

    const gameDisplay = document.querySelector("#game-display");
    const playerOneScoreElement = document.querySelector("#player-one-score");
    const playerTwoScoreElement = document.querySelector("#player-two-score");

    let firstNameElement = document.querySelector("#player-one-name");
    let secondNameElement = document.querySelector("#player-two-name");

    firstNameElement.textContent = `${playerOneName}: X`; 
    secondNameElement.textContent = `${playerTwoName}: O`;

    let playerOneScore = 0;
    let playerTwoScore = 0;

    playerOneScoreElement.textContent = `Total score: ${playerOneScore}`;
    playerTwoScoreElement.textContent = `Total score: ${playerTwoScore}`;

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

    const printNewRound = () => {
        gameIsActive = true;
        board.printBoard();
        gameDisplay.textContent = `${getActivePlayer().name}'s turn.`;
        gameDisplay.style.backgroundColor = getActivePlayer().color;
    };

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
        board.makeChoice(rowIndex, columnIndex, getActivePlayer().symbol);

        // victory function (to be used multiple times)
        const victoryMessage = () => {
            restartBtn.style.display = "block";
            gameDisplay.textContent = `Congratz, ${getActivePlayer().name}, you have won!`;
            gameDisplay.style.backgroundColor = "black";
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
            restartBtn.style.display = "block";
            gameDisplay.textContent = `It's a tie!`;
            gameDisplay.style.backgroundColor = "gray";
            gameIsActive = false;
            return;
        }

        if (gameIsActive) {
            switchPlayerTurn();
            printNewRound();
        }
    };

    function DisplayGame() {
        // start button kicks off the game and asks for names through modal dialog
        const startBtn = document.querySelector("#start-btn");
        startBtn.addEventListener("click", () => {        
            // opening up the dialog: 
            const dialog = document.querySelector("dialog");
            dialog.showModal();
    
            // "Close" button closes the dialog
            const closeButton = document.querySelector("#close-btn");
            closeButton.addEventListener("click", () => {
                dialog.close();
            });
        
            // Prevent the "confirm" button from the default behavior of submitting the form 
            const confirmBtn = document.querySelector("#confirm-btn");
            confirmBtn.addEventListener("click", (event) => {
                startBtn.style.display = "none";

                const hiddenItems = document.querySelectorAll(".hidden");
                hiddenItems.forEach((item) => {
                    item.style.display = "block";
                })

                // capturing user imputs from dialog
                const firstPlayerInput = document.querySelector("#first-player-input").value;
                const secondPlayerInput = document.querySelector("#second-player-input").value;
                    
                // updating names in the objects
                players[0].name = firstPlayerInput;
                players[1].name = secondPlayerInput;
                
                // starting a game with correct names
                GameController(firstPlayerInput, secondPlayerInput);
                game.printNewRound();
        
                event.preventDefault(); // don't want to submit the form
                dialog.close();
            });
        });
            
        const RenderBoard = () => {
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

    DisplayGame(); // initial game rendering to DOM
        
    return {
        playRound,
        getActivePlayer,
        switchPlayerTurn,
        printNewRound,
        DisplayGame
    };
}

let gameIsActive = false;

// default names, these will be updated in the dialog modal. 
let playerOneName = "Player 1";
let playerTwoName = "Player 2";

const game = GameController(playerOneName, playerTwoName);