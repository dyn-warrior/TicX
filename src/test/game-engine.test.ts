import { describe, it, expect } from 'vitest'
import {
  isWinning,
  isDraw,
  applyMove,
  getGameState,
  getNextTurn,
  isValidMove,
  getEmptyCells,
  indexToCoords,
  coordsToIndex,
} from '@/lib/game-engine'

describe('Game Engine', () => {
  describe('isWinning', () => {
    it('detects horizontal wins', () => {
      expect(isWinning('XXX______', 'X')).toBe(true)
      expect(isWinning('___XXX___', 'X')).toBe(true)
      expect(isWinning('______XXX', 'X')).toBe(true)
    })

    it('detects vertical wins', () => {
      expect(isWinning('X__X__X__', 'X')).toBe(true)
      expect(isWinning('_X__X__X_', 'X')).toBe(true)
      expect(isWinning('__X__X__X', 'X')).toBe(true)
    })

    it('detects diagonal wins', () => {
      expect(isWinning('X___X___X', 'X')).toBe(true)
      expect(isWinning('__X_X_X__', 'X')).toBe(true)
    })

    it('returns false for no win', () => {
      expect(isWinning('X_X_O_O_X', 'X')).toBe(false)
      expect(isWinning('_________', 'X')).toBe(false)
    })
  })

  describe('isDraw', () => {
    it('detects draw when board is full with no winner', () => {
      expect(isDraw('XOXOXOXOX')).toBe(true)
      expect(isDraw('OXOXOXOXO')).toBe(true)
    })

    it('returns false when board has empty spaces', () => {
      expect(isDraw('XOXOXO_OX')).toBe(false)
      expect(isDraw('_________')).toBe(false)
    })

    it('returns false when there is a winner', () => {
      expect(isDraw('XXXOXOXOO')).toBe(false)
    })
  })

  describe('applyMove', () => {
    it('applies move to empty cell', () => {
      expect(applyMove('_________', 0, 'X')).toBe('X________')
      expect(applyMove('_________', 4, 'O')).toBe('____O____')
      expect(applyMove('_________', 8, 'X')).toBe('________X')
    })

    it('throws error for occupied cell', () => {
      expect(() => applyMove('X________', 0, 'O')).toThrow('Invalid move: cell is already occupied')
    })

    it('throws error for invalid index', () => {
      expect(() => applyMove('_________', -1, 'X')).toThrow('Invalid move: index must be between 0 and 8')
      expect(() => applyMove('_________', 9, 'X')).toThrow('Invalid move: index must be between 0 and 8')
    })
  })

  describe('getGameState', () => {
    it('returns correct state for ongoing game', () => {
      const state = getGameState('X_O______', 'O')
      expect(state.board).toBe('X_O______')
      expect(state.turn).toBe('O')
      expect(state.winner).toBeUndefined()
      expect(state.isDraw).toBe(false)
      expect(state.isGameOver).toBe(false)
    })

    it('returns correct state for won game', () => {
      const state = getGameState('XXXOO____', 'O')
      expect(state.winner).toBe('X')
      expect(state.isGameOver).toBe(true)
      expect(state.isDraw).toBe(false)
    })

    it('returns correct state for draw', () => {
      const state = getGameState('XOXOXOXOX', 'X')
      expect(state.winner).toBeUndefined()
      expect(state.isDraw).toBe(true)
      expect(state.isGameOver).toBe(true)
    })
  })

  describe('getNextTurn', () => {
    it('alternates turns correctly', () => {
      expect(getNextTurn('X')).toBe('O')
      expect(getNextTurn('O')).toBe('X')
    })
  })

  describe('isValidMove', () => {
    it('validates correct moves', () => {
      const result = isValidMove('X_O______', 1, 'O', 'O')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('rejects wrong turn', () => {
      const result = isValidMove('X_O______', 1, 'X', 'O')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Not your turn')
    })

    it('rejects occupied cell', () => {
      const result = isValidMove('X_O______', 0, 'O', 'O')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Cell already occupied')
    })

    it('rejects invalid position', () => {
      const result = isValidMove('X_O______', 9, 'O', 'O')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Invalid position')
    })

    it('rejects move on finished game', () => {
      const result = isValidMove('XXXOO____', 5, 'O', 'O')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Game is already over')
    })
  })

  describe('getEmptyCells', () => {
    it('returns all empty cell indices', () => {
      expect(getEmptyCells('_________')).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
      expect(getEmptyCells('X_O______')).toEqual([1, 3, 4, 5, 6, 7, 8])
      expect(getEmptyCells('XOXOXOXOX')).toEqual([])
    })
  })

  describe('coordinate conversion', () => {
    it('converts index to coordinates', () => {
      expect(indexToCoords(0)).toEqual({ row: 0, col: 0 })
      expect(indexToCoords(4)).toEqual({ row: 1, col: 1 })
      expect(indexToCoords(8)).toEqual({ row: 2, col: 2 })
    })

    it('converts coordinates to index', () => {
      expect(coordsToIndex(0, 0)).toBe(0)
      expect(coordsToIndex(1, 1)).toBe(4)
      expect(coordsToIndex(2, 2)).toBe(8)
    })
  })
})
