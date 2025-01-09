function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }

    const resetBoard = () => {
        for (let i = 0; i <= 2; i++) {
            board[i] = [];
            for (let j = 0; j <= 2; j++) {
                board[i].push(Cell());
            }
        }
    }

    resetBoard();
  
    const getBoard = () => board;
  
    const markCell = (rowIndex, columnIndex, playerSymbol) => {
        let playerChoice = board[rowIndex][columnIndex].getValue();

        if (playerChoice === "") { // why can't I add gameIsActive here?
            board[rowIndex][columnIndex].addSymbol(playerSymbol); // only an empty cell can be filled
        } else {
            return; 
        }
    };
  
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    };
  
    return { getBoard, markCell, printBoard, resetBoard };
  }
  
function Cell() {
    let value = "";
  
    const addSymbol = (player) => {
      value = player;
    };
  
    const getValue = () => value;
  
    return {
      addSymbol,
      getValue
    };
}

function Player(name, symbol, color) {
    this.name = name;
    this.symbol = symbol;
    this.color = color;
}
  
function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const gameDisplay = document.querySelector("#game-display");
    const allCells = document.querySelectorAll(".cell");

    // first player score
    const playerOneScoreElement = document.querySelector("#player-one-score");
    let playerOneScore = 0;
    playerOneScoreElement.textContent = `Total score: ${playerOneScore}`;

    // second player information
    const playerTwoScoreElement = document.querySelector("#player-two-score");
    let playerTwoScore = 0;
    playerTwoScoreElement.textContent = `Total score: ${playerTwoScore}`;

    const board = Gameboard();
  
    const players = [
        new Player(playerOneName, "X", "lightblue"),
        new Player(playerTwoName, "O", "lightcoral")
    ];

    const getPlayers = () => players;
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      gameIsActive = true;
      board.printBoard();
      gameDisplay.textContent = `${activePlayer.name}'s turn...`;
      gameDisplay.style.backgroundColor = activePlayer.color;
    };

    // reset button functionality
    const restartBtn = document.querySelector("#restart-btn");
    restartBtn.addEventListener("click", () => {
        //clear the board
        allCells.forEach((cell) => {
            cell.textContent = "";
        })
        board.resetBoard();
        board.getBoard();
        printNewRound();
        restartBtn.style.display = "none";
    }) 
  
    const playRound = (rowIndex, columnIndex) => {
      board.markCell(rowIndex, columnIndex, getActivePlayer().symbol);
  
      /*  This is where we would check for a winner and handle that logic,
          such as a win message. */

        // victory function 
        const victoryMessage = () => {
            restartBtn.style.display = "block";
            gameDisplay.textContent = `Congratz, ${activePlayer.name}, you have won!`;
            gameDisplay.style.backgroundColor = "black";
            gameIsActive = false;
            if (activePlayer.name === players[0].name) {
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
            if (board.getBoard()[i][0].getValue() === getActivePlayer().symbol && board.getBoard()[i][1].getValue() === getActivePlayer().symbol && board.getBoard()[i][2].getValue() === getActivePlayer().symbol && gameIsActive) {
                victoryMessage();
                return; // return important otherwise it will check if it's a tie
            } 
            // logic to check whether a player has taken some column
            else if (board.getBoard()[0][i].getValue() === getActivePlayer().symbol && board.getBoard()[1][i].getValue() === getActivePlayer().symbol && board.getBoard()[2][i].getValue() === getActivePlayer().symbol && gameIsActive) {
                victoryMessage();
                return;
            } 
            // logic to check whether a player has taken some diagonal
            else if (board.getBoard()[0][0].getValue() === getActivePlayer().symbol && board.getBoard()[1][1].getValue() === getActivePlayer().symbol && board.getBoard()[2][2].getValue() === getActivePlayer().symbol && gameIsActive || board.getBoard()[2][0].getValue() === getActivePlayer().symbol && board.getBoard()[1][1].getValue() === getActivePlayer().symbol && board.getBoard()[0][2].getValue() === getActivePlayer().symbol && gameIsActive) {
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
        
        if (!gameIsActive) {
            return;
        } else {
            switchPlayerTurn();
            printNewRound();
        }
    };
  
    printNewRound();
  
    return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard,
      getPlayers,
      printNewRound
    };
  }
  
function ScreenController() {
    const gameDisplay = document.querySelector("#game-display");
    const allCells = document.querySelectorAll(".cell");

    const game = GameController();

    const players = game.getPlayers();

    // update player names through modal -- is it doable?
    // opening up the dialog: 

    const dialog = document.querySelector("dialog");
    dialog.showModal();

    // "Close" button closes the dialog
    const closeButton = document.querySelector("#close-btn");
    closeButton.addEventListener("click", () => {
        dialog.close();
    });

    const confirmBtn = document.querySelector("#confirm-btn");
    confirmBtn.addEventListener("click", (event) => {
        // hiding the start button
        startBtn.style.display = "none";

        // bringing out the the display screen element
        const hiddenItems = document.querySelectorAll(".hidden");
        hiddenItems.forEach((item) => {
            item.style.display = "block";
        })
        
        const restartBtn = document.querySelector("#restart-btn");
        restartBtn.style.display = "none";

        // capturing user imputs from dialog
        const firstPlayerInput = document.querySelector("#first-player-input").value;
        const secondPlayerInput = document.querySelector("#second-player-input").value;
            
        // updating names in the objects
        players[0].name = firstPlayerInput;
        players[1].name = secondPlayerInput;

        // first player information
        const playerOneScoreElement = document.querySelector("#player-one-score");
        let firstNameElement = document.querySelector("#player-one-name");
        firstNameElement.textContent = `${players[0].name}: X`; 
        let playerOneScore = 0;
        playerOneScoreElement.textContent = `Total score: ${playerOneScore}`;

        // second player information
        const playerTwoScoreElement = document.querySelector("#player-two-score");
        let secondNameElement = document.querySelector("#player-two-name");
        secondNameElement.textContent = `${players[1].name}: O`;
        let playerTwoScore = 0;
        playerTwoScoreElement.textContent = `Total score: ${playerTwoScore}`;

        gameDisplay.textContent = `${game.getActivePlayer().name}'s turn...`;
        gameDisplay.style.backgroundColor = game.getActivePlayer().color;

        event.preventDefault(); 
        dialog.close();
    })

    const updateScreen = () => {
        //clear the board
        allCells.forEach((cell) => {
            cell.textContent = "";
        })

        // get the newest version of the board and player turn
        const board = game.getBoard();

        // Display player's turn
        gameDisplay.textContent = `${game.getActivePlayer().name}'s turn...`;

        // render board squres
        allCells.forEach((cell) => {
            let cellId = cell.id;
            let rowIndex = Number(cellId.split("-")[0]);
            let columnIndex = Number(cellId.split("-")[1]);
            cell.textContent = board[rowIndex][columnIndex].getValue();
        })
    }

    // event listener for the board cells
    allCells.forEach((cell) => {
        cell.addEventListener("click", () => {
            let cellId = cell.id;
            let rowIndex = Number(cellId.split("-")[0]);
            let columnIndex = Number(cellId.split("-")[1]);
            if (cell.textContent === "" && gameIsActive) {
                cell.textContent = game.getActivePlayer().symbol;
                cell.style.color = game.getActivePlayer().color;
                game.playRound(rowIndex,columnIndex);
            }
        })
    })

    // initial render
    updateScreen();
}

let gameIsActive = false; 

// start button functionality
const startBtn = document.querySelector("#start-btn");
startBtn.addEventListener("click", () => {
    ScreenController();
})