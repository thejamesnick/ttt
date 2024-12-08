//JavaScript code for the Tic Tac Toe game

const Gameboard = () => {
    let board = Array(9).fill(null);

    const getBoard = () => board;

    const placeMark = (index, mark) => {
        if (board[index] === null) {
            board[index] = mark;
            return true;
        } else {
            return false;
        }
    };

    const checkWin = () => {
        const winCombo = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonal
        ];

        for (const combination of winCombo) {
            if (
                board[combination[0]] &&
                board[combination[0]] === board[combination[1]] &&
                board[combination[0]] === board[combination[2]]
            ) {
                return board[combination[0]];
            }
        }
        return null;
    };

    const checkTie = () => {
        return board.every(cell => cell !== null);
    };

    const resetBoard = () => {
        board = Array(9).fill(null);
    };

    return { getBoard, placeMark, checkWin, checkTie, resetBoard };
};

// Player class
class Player {
    constructor(name, marker) {
        this.name = name;
        this.marker = marker;
    }
}

// Game controller module
const game = (() => {
    const board = Gameboard();
    let currentPlayer;
    let player1, player2;

    const playerTurnElement = document.getElementById("player-turn");
    const getResultElement = document.getElementById('game-result');
    const restartButton = document.getElementById('restart-btn');

    const startGame = (p1, p2) => {
        player1 = p1;
        player2 = p2;
        currentPlayer = player1;
        playerTurnElement.textContent = `${currentPlayer.name}'s turn`;
        getResultElement.textContent = '';
        board.resetBoard();
        renderGameBoard();
    };

    const handleCellClick = (index) => {
        const winner = board.checkWin();
        if (winner || board.checkTie()) {
            return;
        }

        if (board.placeMark(index, currentPlayer.marker)) {
            renderGameBoard();

            // Check for win
            const winningMark = board.checkWin();
            if (winningMark){
                getResultElement.textContent = `${currentPlayer.name} wins!`;
                return;
            }

            // Check for tie
            if (board.checkTie()) {
                getResultElement.textContent = "It's a tie!";
                return;
            }

            // Switch Players
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            playerTurnElement.textContent = `${currentPlayer.name}'s turn`;
        }
    };

    const renderGameBoard = () => {
        const gameboardElement = document.getElementById('gameboard');
        const cells = gameboardElement.querySelectorAll('.cell');
        const boardData = board.getBoard();

        cells.forEach((cell, index) => {
            cell.textContent = boardData[index] || ' ';
        });
    };

    // Initializing Event Listeners
    const initEventListeners = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const index = parseInt(cell.getAttribute('data-index'));
                game.handleCellClick(index);
            });
        });

        restartButton.addEventListener('click', () => {
            board.resetBoard();
            game.startGame(player1, player2);
            renderGameBoard();
        });
    };

    return { startGame, handleCellClick, initEventListeners };
})();

// Game initialization
const player1 = new Player('Player 1', 'X');
const player2 = new Player('Player 2', 'O');

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');

    if (startButton) {
        startButton.addEventListener('click', () => {
            game.initEventListeners();
            game.startGame(player1, player2);
        });
    } else {
        console.log("Start button element not found!");
    }
});

