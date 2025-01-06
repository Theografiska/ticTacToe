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

        if (choice === "") { 
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

        const gameTurn = document.querySelector("#game-turns-container");

        const printNewRound = () => {
            board.printBoard();
            gameTurn.textContent = `${getActivePlayer().name}'s turn.`;
            console.log(`${getActivePlayer().name}'s turn.`); // can remove later
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
                    restartBtn.style.display = "block";
                    gameTurn.textContent = `Congratz, ${getActivePlayer().name}, you have won!`;
                    gameTurn.style.backgroundColor = "green";
                    gameTurn.style.color = "white";
                    gameIsActive = false;
                    return;
                } 
                // logic to check whether a player has taken some column
                else if (
                    board.getBoard()[0][i].getValue() === getActivePlayer().token && 
                    board.getBoard()[1][i].getValue() === getActivePlayer().token && 
                    board.getBoard()[2][i].getValue() === getActivePlayer().token
                ) {
                    console.log(`Congratz, ${getActivePlayer().name}, you have won!`);
                    restartBtn.style.display = "block";
                    gameTurn.textContent = `Congratz, ${getActivePlayer().name}, you have won!`;
                    gameTurn.style.backgroundColor = "green";
                    gameTurn.style.color = "white";
                    gameIsActive = false;
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
                    restartBtn.style.display = "block";
                    gameTurn.textContent = `Congratz, ${getActivePlayer().name}, you have won!`;
                    gameTurn.style.backgroundColor = "green";
                    gameTurn.style.color = "white";
                    gameIsActive = false;
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
                gameTurn.textContent = `It's a tie!`;
                gameTurn.style.backgroundColor = "gray";
                gameTurn.style.color = "white";
                gameIsActive = false;
                return;
            }

            if (gameIsActive) {
                switchPlayerTurn();
                printNewRound();
            }
        };

        printNewRound(); // initial play game message
        DisplayGame(); // initial game rendering to DOM
        
        return {
            playRound,
            getActivePlayer,
            switchPlayerTurn,
        };
}


function DisplayGame() {
    const startBtn = document.querySelector("#start-btn");
    startBtn.addEventListener("click", () => {
        gameIsActive = true;
        startBtn.style.display = "none";
        const infoContainer = document.querySelector("#info-container");
        infoContainer.style.display = "flex";
});
    // getting players' names
    let firstPlayer = document.querySelector("#player-one-name");
    firstPlayer.textContent = playerOneName + ": X";

    let secondPlayer = document.querySelector("#player-two-name");
    secondPlayer.textContent = playerTwoName + ": O";

    const board = GameBoard();

    const RenderBoard = () => {
        const board = GameBoard();
    
        // first row
        const cellOne = document.querySelector("#zero-zero");
        cellOne.textContent = board.getBoard()[0][0].getValue();
        cellOne.addEventListener("click", () => {
            if (cellOne.textContent === "" && gameIsActive) {
                cellOne.textContent = game.getActivePlayer().token;
                game.playRound(0,0);
            }
            
        })
    
        const cellTwo = document.querySelector("#zero-one");
        cellTwo.textContent = board.getBoard()[0][1].getValue();
        cellTwo.addEventListener("click", () => {
            if (cellTwo.textContent === "" && gameIsActive) {
                cellTwo.textContent = game.getActivePlayer().token;
                game.playRound(0,1);
            }
        })
    
        const cellThree = document.querySelector("#zero-two");
        cellThree.textContent = board.getBoard()[0][2].getValue();
        cellThree.addEventListener("click", () => {
            if (cellThree.textContent === "" && gameIsActive) {
                cellThree.textContent = game.getActivePlayer().token;
                game.playRound(0,2);
            }
        })
    
        // second row
        const cellFour = document.querySelector("#one-zero");
        cellFour.textContent = board.getBoard()[1][0].getValue();
        cellFour.addEventListener("click", () => {
            if (cellFour.textContent === "" && gameIsActive) {
                cellFour.textContent = game.getActivePlayer().token;
                game.playRound(1,0);
            }
        })
    
        const cellFive = document.querySelector("#one-one");
        cellFive.textContent = board.getBoard()[1][1].getValue();
        cellFive.addEventListener("click", () => {
            if (cellFive.textContent === "" && gameIsActive) {
                cellFive.textContent = game.getActivePlayer().token;
                game.playRound(1,1);
            }
        })
    
        const cellSix = document.querySelector("#one-two");
        cellSix.textContent = board.getBoard()[1][2].getValue();
        cellSix.addEventListener("click", () => {
            if (cellSix.textContent === "" && gameIsActive) {
                cellSix.textContent = game.getActivePlayer().token;
                game.playRound(1,2);
            }
        })
    
        // third row
        const cellSeven = document.querySelector("#two-zero");
        cellSeven.textContent = board.getBoard()[2][0].getValue();
        cellSeven.addEventListener("click", () => {
            if (cellSeven.textContent === "" && gameIsActive) {
                cellSeven.textContent = game.getActivePlayer().token;
                game.playRound(2,0);
            }
        })
    
        const cellEight = document.querySelector("#two-one");
        cellEight.textContent = board.getBoard()[2][1].getValue();
        cellEight.addEventListener("click", () => {
            if (cellEight.textContent === "" && gameIsActive) {
                cellEight.textContent = game.getActivePlayer().token;
                game.playRound(2,1);
            }
        })
    
        const cellNine = document.querySelector("#two-two");
        cellNine.textContent = board.getBoard()[2][2].getValue();
        cellNine.addEventListener("click", () => {
            if (cellNine.textContent === "" && gameIsActive) {
                cellNine.textContent = game.getActivePlayer().token;
                game.playRound(2,2);
            }
        })
    }
    RenderBoard();
}

let gameIsActive = false;

let playerOneName = prompt("First player name");
let playerTwoName = prompt("Second player name");

const game = GameController(playerOneName, playerTwoName);

const restartBtn = document.querySelector("#restart-btn");
restartBtn.addEventListener("click", () => {
    // restart everything
})
