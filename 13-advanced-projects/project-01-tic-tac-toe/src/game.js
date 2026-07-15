export function createGame(_options = {}) {
  throw new Error('TODO: createGame — returns { move, aiMove, reset, state }')
}

export function winnerOf(_board) {
  throw new Error('TODO: winnerOf — return X/O/null')
}

export function bestMove(_board, _player, _depth = 9) {
  throw new Error('TODO: minimax with alpha-beta pruning')
}
