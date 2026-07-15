import { test } from 'node:test'
import assert from 'node:assert/strict'

import { winnerOf, bestMove } from '../src/game.js'

test('winnerOf identifies rows', { skip: 'implement first' }, () => {
  const board = ['X','X','X', null,null,null, null,null,null]
  assert.equal(winnerOf(board), 'X')
})

test('AI blocks immediate loss', { skip: 'implement first' }, () => {
  // Two Xs on top row; O must block at index 2.
  const board = ['X','X',null, null,'O',null, null,null,null]
  assert.equal(bestMove(board, 'O'), 2)
})
