# Project 01 — Tic-Tac-Toe with Minimax AI

Two-player tic-tac-toe with an optional AI opponent using minimax with
alpha-beta pruning. Full test coverage of game logic and AI move selection.

## API

```js
const game = createGame({ ai: 'O', depth: 9 })
game.move(0)                     // place X at index 0
game.state                       // { board, currentPlayer, winner, isDraw }
game.aiMove()                    // returns the AI's chosen index
game.reset()
```

## Acceptance criteria

- 3x3 board indexed 0..8 (row-major).
- Detects wins on all 8 lines; detects draws.
- AI never loses when playing optimally (test against a known optimal move set).
- Pure game logic separated from DOM.

Run: `node --test 13-advanced-projects/project-01-tic-tac-toe/tests/`.
