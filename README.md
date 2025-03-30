# Browser Chess Game

A simple chess game that runs in the browser. Play against a friend on the same device.

This was made 100% by [Penguin](https://github.com/Maximooch/penguin). You can see the [conversation](session_20250330_002611_33441eef.json) log file for how 

## Features

- Full chess rules implementation
- Move validation
- Check and checkmate detection
- Special moves: castling, en passant, pawn promotion
- Move history with undo functionality
- Captured pieces display
- Responsive design

## How to Play

1. Open `index.html` in your web browser
2. Click on a piece to select it
3. Click on a highlighted square to move the piece
4. Take turns playing as white and black

## Controls

- **New Game**: Resets the board to the starting position
- **Undo Move**: Takes back the last move made

## Game Rules

- Standard chess rules apply
- Pawns automatically promote to queens when reaching the opposite end of the board
- Game ends on checkmate or stalemate

## Technical Details

This game is built with vanilla JavaScript, HTML, and CSS. No external libraries or frameworks are used.

The code is organized into several modules:
- `chess-logic.js`: Core game state and initialization
- `chess-pieces.js`: Movement rules for each piece type
- `chess-mechanics.js`: Game mechanics like check detection
- `ui.js`: User interface and interaction handling
- `app.js`: Main application entry point
# penguin-chess
