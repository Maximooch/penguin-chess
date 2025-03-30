// Chess Pieces Movement Logic
// Extends the ChessGame class with piece-specific move generation

// Pawn moves
ChessGame.prototype.getPawnMoves = function(row, col, color) {
    const moves = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    
    // Forward move
    if (!this.getPiece(row + direction, col)) {
        moves.push({ row: row + direction, col: col });
        
        // Double forward move from starting position
        if (row === startRow && !this.getPiece(row + 2 * direction, col)) {
            moves.push({ row: row + 2 * direction, col: col });
        }
    }
    
    // Captures
    for (let i of [-1, 1]) {
        const newCol = col + i;
        if (newCol >= 0 && newCol <= 7) {
            const target = this.getPiece(row + direction, newCol);
            // Normal capture
            if (target && target.color !== color) {
                moves.push({ row: row + direction, col: newCol });
            }
            
            // En passant capture
            if (this.enPassantTarget && 
                this.enPassantTarget.row === row + direction && 
                this.enPassantTarget.col === newCol) {
                moves.push({ 
                    row: row + direction, 
                    col: newCol,
                    isEnPassant: true
                });
            }
        }
    }
    
    return moves;
};

// Rook moves
ChessGame.prototype.getRookMoves = function(row, col, color) {
    const moves = [];
    const directions = [
        { dr: -1, dc: 0 }, // up
        { dr: 1, dc: 0 },  // down
        { dr: 0, dc: -1 }, // left
        { dr: 0, dc: 1 }   // right
    ];
    
    for (const dir of directions) {
        let r = row + dir.dr;
        let c = col + dir.dc;
        
        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            const piece = this.getPiece(r, c);
            
            if (!piece) {
                moves.push({ row: r, col: c });
            } else {
                if (piece.color !== color) {
                    moves.push({ row: r, col: c });
                }
                break;
            }
            
            r += dir.dr;
            c += dir.dc;
        }
    }
    
    return moves;
};

// Knight moves
ChessGame.prototype.getKnightMoves = function(row, col, color) {
    const moves = [];
    const knightMoves = [
        { dr: -2, dc: -1 }, { dr: -2, dc: 1 },
        { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
        { dr: 1, dc: -2 }, { dr: 1, dc: 2 },
        { dr: 2, dc: -1 }, { dr: 2, dc: 1 }
    ];
    
    for (const move of knightMoves) {
        const r = row + move.dr;
        const c = col + move.dc;
        
        if (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            const piece = this.getPiece(r, c);
            if (!piece || piece.color !== color) {
                moves.push({ row: r, col: c });
            }
        }
    }
    
    return moves;
};

// Bishop moves
ChessGame.prototype.getBishopMoves = function(row, col, color) {
    const moves = [];
    const directions = [
        { dr: -1, dc: -1 }, // up-left
        { dr: -1, dc: 1 },  // up-right
        { dr: 1, dc: -1 },  // down-left
        { dr: 1, dc: 1 }    // down-right
    ];
    
    for (const dir of directions) {
        let r = row + dir.dr;
        let c = col + dir.dc;
        
        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            const piece = this.getPiece(r, c);
            
            if (!piece) {
                moves.push({ row: r, col: c });
            } else {
                if (piece.color !== color) {
                    moves.push({ row: r, col: c });
                }
                break;
            }
            
            r += dir.dr;
            c += dir.dc;
        }
    }
    
    return moves;
};

// Queen moves
ChessGame.prototype.getQueenMoves = function(row, col, color) {
    // Queen moves like a rook and bishop combined
    return [
        ...this.getRookMoves(row, col, color),
        ...this.getBishopMoves(row, col, color)
    ];
};

// King moves
ChessGame.prototype.getKingMoves = function(row, col, color) {
    const moves = [];
    const kingMoves = [
        { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
        { dr: 0, dc: -1 },                     { dr: 0, dc: 1 },
        { dr: 1, dc: -1 },  { dr: 1, dc: 0 },  { dr: 1, dc: 1 }
    ];
    
    // Regular king moves
    for (const move of kingMoves) {
        const r = row + move.dr;
        const c = col + move.dc;
        
        if (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            const piece = this.getPiece(r, c);
            if (!piece || piece.color !== color) {
                moves.push({ row: r, col: c });
            }
        }
    }
    
    // Castling
    if (color === 'white') {
        // King-side castling
        if (this.castlingRights.whiteKingSide && 
            !this.getPiece(7, 5) && !this.getPiece(7, 6) &&
            !this.isSquareAttacked(7, 4, 'black') &&
            !this.isSquareAttacked(7, 5, 'black') &&
            !this.isSquareAttacked(7, 6, 'black')) {
            moves.push({ row: 7, col: 6, isCastling: 'kingside' });
        }
        
        // Queen-side castling
        if (this.castlingRights.whiteQueenSide && 
            !this.getPiece(7, 3) && !this.getPiece(7, 2) && !this.getPiece(7, 1) &&
            !this.isSquareAttacked(7, 4, 'black') &&
            !this.isSquareAttacked(7, 3, 'black') &&
            !this.isSquareAttacked(7, 2, 'black')) {
            moves.push({ row: 7, col: 2, isCastling: 'queenside' });
        }
    } else {
        // King-side castling
        if (this.castlingRights.blackKingSide && 
            !this.getPiece(0, 5) && !this.getPiece(0, 6) &&
            !this.isSquareAttacked(0, 4, 'white') &&
            !this.isSquareAttacked(0, 5, 'white') &&
            !this.isSquareAttacked(0, 6, 'white')) {
            moves.push({ row: 0, col: 6, isCastling: 'kingside' });
        }
        
        // Queen-side castling
        if (this.castlingRights.blackQueenSide && 
            !this.getPiece(0, 3) && !this.getPiece(0, 2) && !this.getPiece(0, 1) &&
            !this.isSquareAttacked(0, 4, 'white') &&
            !this.isSquareAttacked(0, 3, 'white') &&
            !this.isSquareAttacked(0, 2, 'white')) {
            moves.push({ row: 0, col: 2, isCastling: 'queenside' });
        }
    }
    
    return moves;
};
