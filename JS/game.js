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

// Confetti and Sound Celebration Module
const Celebration = (() => {
    // Confetti options
    const confettiOptions = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    };

    // Sound effect for winning
    const winSound = new Audio('https://www.soundjay.com/misc/sounds/success-celebration-01.mp3');

    // Create a function to trigger celebration
    const celebrate = (winner) => {
        // Play winning sound
        winSound.play();

        // Trigger confetti
        confetti(confettiOptions);

        // Create a celebration banner
        createCelebrationBanner(winner);
    };

    // Create a dynamic celebration banner
    const createCelebrationBanner = (winner) => {
        // Remove any existing banners
        const existingBanner = document.getElementById('celebration-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        // Create new banner
        const banner = document.createElement('div');
        banner.id = 'celebration-banner';
        banner.style.position = 'fixed';
        banner.style.top = '50%';
        banner.style.left = '50%';
        banner.style.transform = 'translate(-50%, -50%)';
        banner.style.backgroundColor = '#4caf50';
        banner.style.color = 'white';
        banner.style.padding = '20px';
        banner.style.borderRadius = '10px';
        banner.style.zIndex = '1000';
        banner.style.fontSize = '2rem';
        banner.textContent = `${winner} Wins!`;

        // Add to body
        document.body.appendChild(banner);

        // Remove banner after 3 seconds
        setTimeout(() => {
            banner.remove();
        }, 3000);
    };

    return { celebrate };
})();


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

        const existingBanner = document.getElementById('celebration-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
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
                Celebration.celebrate(currentPlayer.name);
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

    const confettiScript = document.createElement('script');
    confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
    document.head.appendChild(confettiScript);

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



