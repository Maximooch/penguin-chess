// Chess Logic Module
class ChessGame {
    constructor() {
        this.initialize();
    }

    initialize() {
        // Initialize the board (8x8 grid)
        this.board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Set up the initial piece positions
        this.setupPieces();
        
        // Game state
        this.currentPlayer = 'white';
        this.gameOver = false;
        this.moveHistory = [];
        this.capturedPieces = {
            white: [],
            black: []
        };
        
        // Castling rights
        this.castlingRights = {
            whiteKingSide: true,
            whiteQueenSide: true,
            blackKingSide: true,
            blackQueenSide: true
        };
        
        // En passant target square
        this.enPassantTarget = null;
        
        // Check and checkmate state
        this.inCheck = false;
        this.checkmate = false;
        this.stalemate = false;
    }

    setupPieces() {
        // Set up pawns
        for (let i = 0; i < 8; i++) {
            this.board[1][i] = { type: 'pawn', color: 'black' };
            this.board[6][i] = { type: 'pawn', color: 'white' };
        }
        
        // Set up rooks
        this.board[0][0] = { type: 'rook', color: 'black' };
        this.board[0][7] = { type: 'rook', color: 'black' };
        this.board[7][0] = { type: 'rook', color: 'white' };
        this.board[7][7] = { type: 'rook', color: 'white' };
        
        // Set up knights
        this.board[0][1] = { type: 'knight', color: 'black' };
        this.board[0][6] = { type: 'knight', color: 'black' };
        this.board[7][1] = { type: 'knight', color: 'white' };
        this.board[7][6] = { type: 'knight', color: 'white' };
        
        // Set up bishops
        this.board[0][2] = { type: 'bishop', color: 'black' };
        this.board[0][5] = { type: 'bishop', color: 'black' };
        this.board[7][2] = { type: 'bishop', color: 'white' };
        this.board[7][5] = { type: 'bishop', color: 'white' };
        
        // Set up queens
        this.board[0][3] = { type: 'queen', color: 'black' };
        this.board[7][3] = { type: 'queen', color: 'white' };
        
        // Set up kings
        this.board[0][4] = { type: 'king', color: 'black' };
        this.board[7][4] = { type: 'king', color: 'white' };
    }

    getPiece(row, col) {
        if (row < 0 || row > 7 || col < 0 || col > 7) {
            return null;
        }
        return this.board[row][col];
    }

    // Returns all valid moves for a piece at the given position
    getValidMoves(row, col) {
        const piece = this.getPiece(row, col);
        if (!piece || piece.color !== this.currentPlayer) {
            return [];
        }

        let moves = [];
        
        switch (piece.type) {
            case 'pawn':
                moves = this.getPawnMoves(row, col, piece.color);
                break;
            case 'rook':
                moves = this.getRookMoves(row, col, piece.color);
                break;
            case 'knight':
                moves = this.getKnightMoves(row, col, piece.color);
                break;
            case 'bishop':
                moves = this.getBishopMoves(row, col, piece.color);
                break;
            case 'queen':
                moves = this.getQueenMoves(row, col, piece.color);
                break;
            case 'king':
                moves = this.getKingMoves(row, col, piece.color);
                break;
        }
        
        // Filter out moves that would put the king in check
        return moves.filter(move => !this.wouldBeInCheck(row, col, move.row, move.col, piece.color));
    }

    // Move piece implementation
    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.getPiece(fromRow, fromCol);
        if (!piece) return false;
        
        // Check if the move is valid
        const validMoves = this.getValidMoves(fromRow, fromCol);
        const targetMove = validMoves.find(move => move.row === toRow && move.col === toCol);
        
        if (!targetMove) return false;
        
        // Store the move for history
        const capturedPiece = this.getPiece(toRow, toCol);
        this.moveHistory.push({
            piece: { ...piece },
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            captured: capturedPiece ? { ...capturedPiece } : null,
            enPassant: targetMove.isEnPassant || false,
            castling: targetMove.isCastling || null,
            check: false,
            checkmate: false
        });
        
        // Handle captured pieces
        if (capturedPiece) {
            this.capturedPieces[piece.color].push({ ...capturedPiece });
        }
        
        // Special move: En Passant
        if (targetMove.isEnPassant) {
            // Remove the pawn that was captured via en passant
            const direction = piece.color === 'white' ? 1 : -1;
            const capturedPawnRow = toRow + direction;
            const capturedPawn = this.getPiece(capturedPawnRow, toCol);
            
            if (capturedPawn && capturedPawn.type === 'pawn') {
                this.capturedPieces[piece.color].push({ ...capturedPawn });
                this.board[capturedPawnRow][toCol] = null;
            }
        }
        
        // Special move: Castling
        if (targetMove.isCastling) {
            const rookRow = fromRow;
            let rookFromCol, rookToCol;
            
            if (targetMove.isCastling === 'kingside') {
                rookFromCol = 7;
                rookToCol = 5;
            } else { // queenside
                rookFromCol = 0;
                rookToCol = 3;
            }
            
            // Move the rook
            this.board[rookRow][rookToCol] = this.board[rookRow][rookFromCol];
            this.board[rookRow][rookFromCol] = null;
        }
        
        // Update castling rights
        this.updateCastlingRights(fromRow, fromCol, piece);
        
        // Set en passant target for the next move
        this.setEnPassantTarget(fromRow, fromCol, toRow, toCol, piece);
        
        // Make the move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Pawn promotion (automatically to queen for simplicity)
        if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
            this.board[toRow][toCol] = { type: 'queen', color: piece.color };
        }
        
        // Switch player
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        // Check for check, checkmate, or stalemate
        this.updateGameState();
        
        return true;
    }

    // Update the game state (check, checkmate, stalemate)
    updateGameState() {
        // Check if the current player is in check
        this.inCheck = this.isInCheck(this.currentPlayer);
        
        // Check if there are any valid moves for the current player
        let hasValidMove = false;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.color === this.currentPlayer) {
                    const moves = this.getValidMoves(row, col);
                    if (moves.length > 0) {
                        hasValidMove = true;
                        break;
                    }
                }
            }
            if (hasValidMove) break;
        }
        
        // Update checkmate or stalemate
        if (!hasValidMove) {
            if (this.inCheck) {
                this.checkmate = true;
                this.gameOver = true;
                // Update the last move in history
                if (this.moveHistory.length > 0) {
                    this.moveHistory[this.moveHistory.length - 1].checkmate = true;
                }
            } else {
                this.stalemate = true;
                this.gameOver = true;
            }
        }
        
        // Update the last move in history if in check
        if (this.inCheck && this.moveHistory.length > 0) {
            this.moveHistory[this.moveHistory.length - 1].check = true;
        }
    }

    // Check if a king is in check
    isInCheck(color) {
        // Find the king's position
        let kingRow, kingCol;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.type === 'king' && piece.color === color) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
            if (kingRow !== undefined) break;
        }
        
        // Check if the king's square is attacked by any opponent piece
        return this.isSquareAttacked(kingRow, kingCol, color === 'white' ? 'black' : 'white');
    }

    // Helper methods for specific piece moves
    getPawnMoves(row, col, color) {
        // Implementation in chess-pieces.js
        return [];
    }

    getRookMoves(row, col, color) {
        // Implementation in chess-pieces.js
        return [];
    }

    getKnightMoves(row, col, color) {
        // Implementation in chess-pieces.js
        return [];
    }

    getBishopMoves(row, col, color) {
        // Implementation in chess-pieces.js
        return [];
    }

    getQueenMoves(row, col, color) {
        // Implementation in chess-pieces.js
        return [];
    }

    getKingMoves(row, col, color) {
        // Implementation in chess-pieces.js
        return [];
    }

    // Helper methods for game mechanics
    isSquareAttacked(row, col, byColor) {
        // Implementation in chess-mechanics.js
        return false;
    }

    wouldBeInCheck(fromRow, fromCol, toRow, toCol, color) {
        // Implementation in chess-mechanics.js
        return false;
    }

    updateCastlingRights(row, col, piece) {
        // Implementation in chess-mechanics.js
    }

    setEnPassantTarget(fromRow, fromCol, toRow, toCol, piece) {
        // Implementation in chess-mechanics.js
    }

    undoLastMove() {
        // Implementation in chess-mechanics.js
        return false;
    }
}
