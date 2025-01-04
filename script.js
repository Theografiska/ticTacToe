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
        const availableCells = board.filter((row) => row[columnIndex].getValue() === 0).map(row => row[columnIndex]);

        // If no cells make it through the filter, 
        // the move is invalid. Stop execution.
        if (!availableCells.length) return;

        // Otherwise, I have a valid cell
        board[rowIndex][columnIndex].getChoice(player);
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
** 1: Player One's token,
** 2: Player 2's token
*/

function Cell() {
    let value = 0;

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

function Player(name, token) {
    this.name = name;
    this.token = token;
}

function displayController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
        const board = GameBoard();

        const players = [
            new Player(playerOneName, 1),
            new Player(playerTwoName, 2)
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

        
};


const game = displayController();