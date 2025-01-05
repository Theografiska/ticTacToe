function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const makeChoice = (rowIndex, columnIndex, player) => {
        let choice = board[rowIndex][columnIndex].getValue();

        if (choice === 0) { 
            board[rowIndex][columnIndex].getChoice(player); // when have an empty cell, it can be filled
            /*
            // add logic so that when all the cells are populated, the game will be finished. 
            const availableCells = board.filter((row) => {
                return row[columnIndex].getValue() === 0;
            }); 
            if (!availableCells.length) {
                console.log('Game over!')
                return;
            }
            */
        } else {
            console.log(`That cell is chosen already. Make another choice.`)
            game.switchPlayerTurn();
            return; // If the cell doesn't make it through the filter, the move is invalid. Stops execution.
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
                if (board.getBoard()[i][0].getValue() === getActivePlayer().token && board.getBoard()[i][1].getValue() === getActivePlayer().token && board.getBoard()[i][2].getValue() === getActivePlayer().token) {
                    console.log(`Congratz, ${getActivePlayer().name}, you have won!`);
                    return;
                } 
                // logic to check whether a player has taken some column
                else if (board.getBoard()[0][i].getValue() === getActivePlayer().token && board.getBoard()[1][i].getValue() === getActivePlayer().token && board.getBoard()[2][i].getValue() === getActivePlayer().token) {
                    console.log(`Congratz, ${getActivePlayer().name}, you have won!`);
                    return;
                } 
                // logic to check whether a player has taken some diagonal
                else if (board.getBoard()[0][0].getValue() === getActivePlayer().token && board.getBoard()[1][1].getValue() === getActivePlayer().token && board.getBoard()[2][2].getValue() === getActivePlayer().token 
                || board.getBoard()[2][0].getValue() === getActivePlayer().token && board.getBoard()[1][1].getValue() === getActivePlayer().token && board.getBoard()[0][2].getValue() === getActivePlayer().token) {
                    console.log(`Congratz, ${getActivePlayer().name}, you have won!`);
                    return;
                }
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

const game = GameController("Theo", "Britten");