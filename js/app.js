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
    const moveListElement = document.getElementById('move-list');
    const blackCapturedElement = document.getElementById('captured-black');
    
    // Initialize UI and sounds
    const ui = new ChessUI(game, boardElement, statusElement);
    const sounds = new ChessSounds();
    let audioInitialized = false;
    
    // Initialize audio on first user interaction (browser requirement)
    const initAudio = () => {
        if (!audioInitialized) {
            sounds.init();
            audioInitialized = true;
        }
    };
    document.addEventListener('click', initAudio, { once: true });
    
    // Add event listeners for buttons
    resetButton.addEventListener('click', () => {
        ui.resetGame();
        ui.updateMoveHistory(moveListElement);
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
            
            // Play sound based on move type
            const lastMove = game.moveHistory[game.moveHistory.length - 1];
            if (lastMove) {
                if (lastMove.checkmate) {
                    sounds.playCheckmate();
                } else if (lastMove.check) {
                    sounds.playCheck();
                } else if (lastMove.captured) {
                    sounds.playCapture();
                } else if (lastMove.castling) {
                    sounds.playCastle();
                } else {
                    sounds.playMove();
                }
            }
            
            // Check if promotion is needed
            const pendingPromotion = game.getPendingPromotion();
            if (pendingPromotion) {
                ui.showPromotionModal((pieceType) => {
                    game.promotePawn(pieceType);
                    ui.updateMoveHistory(moveListElement);
                });
            } else {
                ui.updateMoveHistory(moveListElement);
            }
        }
        return result;
    };
    

    // Settings panel functionality
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const soundToggle = document.getElementById('sound-toggle');
    const themeSelect = document.getElementById('theme-select');
    
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });
    
    closeSettings.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });
    
    soundToggle.addEventListener('change', (e) => {
        sounds.setEnabled(e.target.checked);
    });
    
    themeSelect.addEventListener('change', (e) => {
        document.body.className = e.target.value;
    });

    
        // Initial update of captured pieces display
    ui.updateMoveHistory(moveListElement);
    ui.updateCapturedPieces(whiteCapturedElement, blackCapturedElement);
});
