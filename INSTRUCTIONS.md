# Chess Game Instructions

## How to Run the Game

### Method 1: Direct File Open
1. Navigate to the chess-game folder
2. Double-click on `index.html` to open it in your default web browser

### Method 2: Using Python Server (recommended)
1. Make sure you have Python installed on your computer
2. Open a terminal/command prompt
3. Navigate to the chess-game folder
4. Run `python server.py` (or `python3 server.py` on some systems)
5. The game should automatically open in your default web browser
6. If it doesn't open automatically, go to http://localhost:8000 in your browser

## How to Play

1. The game starts with White to move
2. Click on a piece to select it
   - Valid move destinations will be highlighted
3. Click on a highlighted square to move your piece there
4. Players take turns moving pieces (White, then Black, and so on)
5. Follow standard chess rules:
   - Capture opponent pieces by moving onto their square
   - Check occurs when a king is under threat
   - Checkmate occurs when a king is in check and cannot escape
   - Stalemate occurs when a player has no legal moves but is not in check

## Special Moves

- **Castling**: Select the king and click on the destination square (two squares to either side)
- **En Passant**: When available, the capturing square will be highlighted
- **Pawn Promotion**: Pawns automatically promote to queens when they reach the opposite end of the board

## Game Controls

- **New Game**: Resets the board to the starting position
- **Undo Move**: Takes back the last move made

Enjoy playing!
