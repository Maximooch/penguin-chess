// Chess UI Component
class ChessUI {
    constructor(game, boardElement, statusElement) {
        this.game = game;
        this.boardElement = boardElement;
        this.statusElement = statusElement;
        this.selectedSquare = null;
        this.possibleMoves = [];
        
        // Unicode chess symbols
        this.pieceSymbols = {
            'white': {
                'pawn': '♙',
                'rook': '♖',
                'knight': '♘',
                'bishop': '♗',
                'queen': '♕',
                'king': '♔'
            },
            'black': {
                'pawn': '♟',
                'rook': '♜',
                'knight': '♞',
                'bishop': '♝',
                'queen': '♛',
                'king': '♚'
            }
        };
        
        // Initialize board
        this.createBoard();
        
        // Update display
        this.updateBoard();
        this.updateStatus();
    }
    
    createBoard() {
        this.boardElement.innerHTML = '';
        
        // Create squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Add click event
                square.addEventListener('click', () => this.handleSquareClick(row, col));
                
                this.boardElement.appendChild(square);
            }
        }
    }
    
    updateBoard() {
        // Clear all pieces
        const squares = this.boardElement.querySelectorAll('.square');
        squares.forEach(square => {
            square.innerHTML = '';
            square.classList.remove('highlight', 'possible-move', 'possible-capture');
        });
        
        // Add pieces based on game state
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.game.getPiece(row, col);
                if (piece) {
                    const square = this.getSquareElement(row, col);
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `piece ${piece.color}`;
                    pieceElement.textContent = this.pieceSymbols[piece.color][piece.type];
                    
                    square.appendChild(pieceElement);
                }
            }
        }
        
        // Highlight selected square and possible moves
        if (this.selectedSquare) {
            const square = this.getSquareElement(this.selectedSquare.row, this.selectedSquare.col);
            square.classList.add('highlight');
            
            // Highlight possible moves
            this.possibleMoves.forEach(move => {
                const moveSquare = this.getSquareElement(move.row, move.col);
                if (this.game.getPiece(move.row, move.col)) {
                    moveSquare.classList.add('possible-capture');
                } else {
                    moveSquare.classList.add('possible-move');
                }
            });
        }
    }
    
    updateStatus() {
        if (this.statusElement) {
            this.statusElement.textContent = this.game.getGameStatus();
        }
    }
    
    handleSquareClick(row, col) {
        const piece = this.game.getPiece(row, col);
        
        // If a square is already selected
        if (this.selectedSquare) {
            // If clicking on a possible move square
            const moveIndex = this.possibleMoves.findIndex(
                move => move.row === row && move.col === col
            );
            
            if (moveIndex !== -1) {
                // Make the move
                this.game.movePiece(
                    this.selectedSquare.row, 
                    this.selectedSquare.col, 
                    row, 
                    col
                );
                
                // Reset selection
                this.selectedSquare = null;
                this.possibleMoves = [];
                
                // Update display
                this.updateBoard();
                this.updateStatus();
                
                return;
            }
            
            // If clicking on the same square, deselect it
            if (this.selectedSquare.row === row && this.selectedSquare.col === col) {
                this.selectedSquare = null;
                this.possibleMoves = [];
                this.updateBoard();
                return;
            }
            
            // If clicking on another piece of the same color, select it instead
            if (piece && piece.color === this.game.currentPlayer) {
                this.selectedSquare = { row, col };
                this.possibleMoves = this.game.getValidMoves(row, col);
                this.updateBoard();
                return;
            }
            
            // Otherwise, deselect
            this.selectedSquare = null;
            this.possibleMoves = [];
            this.updateBoard();
            return;
        }
        
        // If no square is selected yet, select if it's a piece of the current player
        if (piece && piece.color === this.game.currentPlayer) {
            this.selectedSquare = { row, col };
            this.possibleMoves = this.game.getValidMoves(row, col);
            this.updateBoard();
        }
    }
    
    getSquareElement(row, col) {
        return this.boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }
    
    // Add a method to handle the reset button
    resetGame() {
        this.game.initialize();
        this.selectedSquare = null;
        this.possibleMoves = [];
        this.updateBoard();
        this.updateStatus();
    }
    
    // Add a method to handle the undo button
    undoMove() {
        if (this.game.undoLastMove()) {
            this.selectedSquare = null;
            this.possibleMoves = [];
            this.updateBoard();
            this.updateStatus();
        }
    }
    
    // Add method to update the captured pieces display
    updateCapturedPieces(whiteCapturedElement, blackCapturedElement) {
        if (whiteCapturedElement) {
            whiteCapturedElement.innerHTML = '';
            this.game.capturedPieces.white.forEach(piece => {
                const pieceElement = document.createElement('div');
                pieceElement.className = 'captured-piece black';
                pieceElement.textContent = this.pieceSymbols.black[piece.type]; // Black pieces captured by white
                whiteCapturedElement.appendChild(pieceElement);
            });
        }
        
        if (blackCapturedElement) {
            blackCapturedElement.innerHTML = '';
            this.game.capturedPieces.black.forEach(piece => {
                const pieceElement = document.createElement('div');
                pieceElement.className = 'captured-piece white';
                pieceElement.textContent = this.pieceSymbols.white[piece.type]; // White pieces captured by black
                blackCapturedElement.appendChild(pieceElement);
            });
        }
    }
}
