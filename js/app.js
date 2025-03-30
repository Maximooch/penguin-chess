// Main Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game
    const game = new ChessGame();
    
    // Get DOM elements
    const boardElement = document.getElementById('chessboard');
    const statusElement = document.getElementById('status');
    const resetButton = document.getElementById('reset-btn');
    const undoButton = document.getElementById('undo-btn');
    const whiteCapturedElement = document.getElementById('captured-white');
    const blackCapturedElement = document.getElementById('captured-black');
    
    // Initialize UI
    const ui = new ChessUI(game, boardElement, statusElement);
    
    // Add event listeners for buttons
    resetButton.addEventListener('click', () => {
        ui.resetGame();
        ui.updateCapturedPieces(whiteCapturedElement, blackCapturedElement);
    });
    
    undoButton.addEventListener('click', () => {
        ui.undoMove();
        ui.updateCapturedPieces(whiteCapturedElement, blackCapturedElement);
    });
    
    // Update the captured pieces display when a move is made
    const originalMovePiece = game.movePiece;
    game.movePiece = function(...args) {
        const result = originalMovePiece.apply(this, args);
        if (result) {
            ui.updateCapturedPieces(whiteCapturedElement, blackCapturedElement);
        }
        return result;
    };
    
    // Initial update of captured pieces display
    ui.updateCapturedPieces(whiteCapturedElement, blackCapturedElement);
});
