// Chess Game Mechanics
// Extends the ChessGame class with game mechanics

// Check if a square is attacked by any piece of the given color
ChessGame.prototype.isSquareAttacked = function(row, col, byColor) {
    // Check if a square is attacked by any piece of the given color
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = this.getPiece(r, c);
            if (piece && piece.color === byColor) {
                // Temporarily change the current player to get moves
                const savedPlayer = this.currentPlayer;
                this.currentPlayer = byColor;
                
                let moves = [];
                switch (piece.type) {
                    case 'pawn':
                        // For pawns, we need to check diagonal attacks specifically
                        const direction = byColor === 'white' ? -1 : 1;
                        if ((r + direction === row) && (c - 1 === col || c + 1 === col)) {
                            moves.push({ row, col });
                        }
                        break;
                    case 'king':
                        // For kings, we need to exclude castling moves
                        moves = this.getKingMoves(r, c, byColor)
                            .filter(move => !move.isCastling);
                        break;
                    default:
                        // For other pieces, use normal move generation
                        if (piece.type === 'rook') {
                            moves = this.getRookMoves(r, c, byColor);
                        } else if (piece.type === 'knight') {
                            moves = this.getKnightMoves(r, c, byColor);
                        } else if (piece.type === 'bishop') {
                            moves = this.getBishopMoves(r, c, byColor);
                        } else if (piece.type === 'queen') {
                            moves = this.getQueenMoves(r, c, byColor);
                        }
                        break;
                }
                
                this.currentPlayer = savedPlayer;
                
                // Check if any of the moves target the square we're checking
                if (moves.some(move => move.row === row && move.col === col)) {
                    return true;
                }
            }
        }
    }
    return false;
};

// Check if a move would put the king in check
ChessGame.prototype.wouldBeInCheck = function(fromRow, fromCol, toRow, toCol, color) {
    // Simulate the move and check if the king would be in check
    const savedBoard = JSON.parse(JSON.stringify(this.board));
    const movingPiece = this.board[fromRow][fromCol];
    
    // Make the move temporarily
    this.board[toRow][toCol] = movingPiece;
    this.board[fromRow][fromCol] = null;
    
    // Find the king's position
    let kingRow, kingCol;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = this.board[r][c];
            if (piece && piece.type === 'king' && piece.color === color) {
                kingRow = r;
                kingCol = c;
                break;
            }
        }
        if (kingRow !== undefined) break;
    }
    
    // Check if the king is in check
    const inCheck = this.isSquareAttacked(kingRow, kingCol, color === 'white' ? 'black' : 'white');
    
    // Restore the board
    this.board = savedBoard;
    
    return inCheck;
};

// Update castling rights when a king or rook moves
ChessGame.prototype.updateCastlingRights = function(row, col, piece) {
    if (piece.type === 'king') {
        if (piece.color === 'white') {
            this.castlingRights.whiteKingSide = false;
            this.castlingRights.whiteQueenSide = false;
        } else {
            this.castlingRights.blackKingSide = false;
            this.castlingRights.blackQueenSide = false;
        }
    } else if (piece.type === 'rook') {
        if (piece.color === 'white') {
            if (row === 7 && col === 0) {
                this.castlingRights.whiteQueenSide = false;
            } else if (row === 7 && col === 7) {
                this.castlingRights.whiteKingSide = false;
            }
        } else {
            if (row === 0 && col === 0) {
                this.castlingRights.blackQueenSide = false;
            } else if (row === 0 && col === 7) {
                this.castlingRights.blackKingSide = false;
            }
        }
    }
};

// Set en passant target after a pawn's double move
ChessGame.prototype.setEnPassantTarget = function(fromRow, fromCol, toRow, toCol, piece) {
    // Reset en passant target
    this.enPassantTarget = null;
    
    // Set new en passant target if a pawn moved two squares
    if (piece.type === 'pawn' && Math.abs(fromRow - toRow) === 2) {
        const direction = piece.color === 'white' ? -1 : 1;
        this.enPassantTarget = { row: fromRow + direction, col: fromCol };
    }
};

// Undo the last move
ChessGame.prototype.undoLastMove = function() {
    if (this.moveHistory.length === 0) {
        return false;
    }
    
    // Get the last move
    const lastMove = this.moveHistory.pop();
    
    // Restore the piece to its original position
    this.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
    
    // Restore the captured piece if any
    if (lastMove.captured) {
        this.board[lastMove.to.row][lastMove.to.col] = lastMove.captured;
        
        // Remove from captured pieces
        const capturedPieces = this.capturedPieces[lastMove.piece.color];
        const index = capturedPieces.findIndex(p => 
            p.type === lastMove.captured.type && p.color === lastMove.captured.color
        );
        if (index !== -1) {
            capturedPieces.splice(index, 1);
        }
    } else {
        this.board[lastMove.to.row][lastMove.to.col] = null;
    }
    
    // Handle special moves
    if (lastMove.enPassant) {
        // Restore the captured pawn
        const direction = lastMove.piece.color === 'white' ? 1 : -1;
        this.board[lastMove.to.row + direction][lastMove.to.col] = {
            type: 'pawn',
            color: lastMove.piece.color === 'white' ? 'black' : 'white'
        };
    } else if (lastMove.castling) {
        // Restore the rook
        const rookRow = lastMove.from.row;
        let rookFromCol, rookToCol;
        
        if (lastMove.castling === 'kingside') {
            rookFromCol = 7;
            rookToCol = 5;
        } else { // queenside
            rookFromCol = 0;
            rookToCol = 3;
        }
        
        this.board[rookRow][rookFromCol] = this.board[rookRow][rookToCol];
        this.board[rookRow][rookToCol] = null;
    }
    
    // Restore castling rights and en passant target
    // (this is simplified - for a complete implementation, these would need to be stored in move history)
    
    // Switch back to the previous player
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    
    // Reset game state
    this.inCheck = false;
    this.checkmate = false;
    this.stalemate = false;
    this.gameOver = false;
    
    return true;
};

// Get game status as a string
ChessGame.prototype.getGameStatus = function() {
    if (this.checkmate) {
        const winner = this.currentPlayer === 'white' ? 'Black' : 'White';
        return `${winner} wins by checkmate!`;
    } else if (this.stalemate) {
        return 'Game drawn by stalemate!';
    } else if (this.inCheck) {
        return `${this.currentPlayer === 'white' ? 'White' : 'Black'} is in check!`;
    } else {
        return `${this.currentPlayer === 'white' ? 'White' : 'Black'} to move`;
    }
};
