/**
 * Game engine utilities for Tic-Tac-Toe
 */

export type Symbol = 'X' | 'O';
export type Cell = Symbol | '_';
export type Board = string; // 9 characters: X, O, or _

export interface GameState {
  board: Board;
  turn: Symbol;
  winner?: Symbol;
  isDraw: boolean;
  isGameOver: boolean;
}

/**
 * Check if a symbol has won the game
 */
export function isWinning(board: Board, symbol: Symbol): boolean {
  const winningPositions = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal top-left to bottom-right
    [2, 4, 6], // diagonal top-right to bottom-left
  ];

  return winningPositions.some(positions =>
    positions.every(pos => board[pos] === symbol)
  );
}

/**
 * Check if the game is a draw (board full, no winner)
 */
export function isDraw(board: Board): boolean {
  return !board.includes('_') && !isWinning(board, 'X') && !isWinning(board, 'O');
}

/**
 * Apply a move to the board
 */
export function applyMove(board: Board, index: number, symbol: Symbol): Board {
  if (index < 0 || index > 8) {
    throw new Error('Invalid move: index must be between 0 and 8');
  }
  
  if (board[index] !== '_') {
    throw new Error('Invalid move: cell is already occupied');
  }

  const newBoard = board.split('');
  newBoard[index] = symbol;
  return newBoard.join('');
}

/**
 * Get the current game state
 */
export function getGameState(board: Board, currentTurn: Symbol): GameState {
  const xWins = isWinning(board, 'X');
  const oWins = isWinning(board, 'O');
  const draw = isDraw(board);
  
  return {
    board,
    turn: currentTurn,
    winner: xWins ? 'X' : oWins ? 'O' : undefined,
    isDraw: draw,
    isGameOver: xWins || oWins || draw,
  };
}

/**
 * Get the next turn
 */
export function getNextTurn(currentTurn: Symbol): Symbol {
  return currentTurn === 'X' ? 'O' : 'X';
}

/**
 * Validate a move
 */
export function isValidMove(
  board: Board,
  index: number,
  symbol: Symbol,
  expectedTurn: Symbol
): { valid: boolean; error?: string } {
  if (symbol !== expectedTurn) {
    return { valid: false, error: 'Not your turn' };
  }

  if (index < 0 || index > 8) {
    return { valid: false, error: 'Invalid position' };
  }

  if (board[index] !== '_') {
    return { valid: false, error: 'Cell already occupied' };
  }

  const gameState = getGameState(board, symbol);
  if (gameState.isGameOver) {
    return { valid: false, error: 'Game is already over' };
  }

  return { valid: true };
}

/**
 * Get empty cells on the board
 */
export function getEmptyCells(board: Board): number[] {
  const emptyCells: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === '_') {
      emptyCells.push(i);
    }
  }
  return emptyCells;
}

/**
 * Convert board index to row/col coordinates
 */
export function indexToCoords(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / 3),
    col: index % 3,
  };
}

/**
 * Convert row/col coordinates to board index
 */
export function coordsToIndex(row: number, col: number): number {
  return row * 3 + col;
}

/**
 * AI engine using minimax algorithm
 */
export function minimax(board: Board, depth: number, isMaximizing: boolean): number {
  const gameState = getGameState(board, isMaximizing ? 'O' : 'X');
  
  if (gameState.winner === 'O') return 10 - depth;
  if (gameState.winner === 'X') return depth - 10;
  if (gameState.isDraw) return 0;

  const emptyCells = getEmptyCells(board);
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const cell of emptyCells) {
      const newBoard = applyMove(board, cell, 'O');
      const score = minimax(newBoard, depth + 1, false);
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const cell of emptyCells) {
      const newBoard = applyMove(board, cell, 'X');
      const score = minimax(newBoard, depth + 1, true);
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
}

/**
 * Get best move for AI
 */
export function getBestMove(board: Board): number {
  let bestScore = -Infinity;
  let bestMove = -1;
  
  const emptyCells = getEmptyCells(board);
  
  for (const cell of emptyCells) {
    const newBoard = applyMove(board, cell, 'O');
    const score = minimax(newBoard, 0, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = cell;
    }
  }
  
  return bestMove;
}

/**
 * Game Engine class for managing game state
 */
export class GameEngine {
  private board: string[]
  private currentPlayer: Symbol
  private gameHistory: number[]
  private winner: Symbol | null
  private isDraw: boolean
  private winningLine: number[] | null

  constructor() {
    this.board = Array(9).fill(null)
    this.currentPlayer = 'X'
    this.gameHistory = []
    this.winner = null
    this.isDraw = false
    this.winningLine = null
  }

  makeMove(index: number): boolean {
    if (this.board[index] !== null || this.winner || this.isDraw) {
      return false
    }

    this.board[index] = this.currentPlayer
    this.gameHistory.push(index)
    
    this.checkForWinner()
    this.checkForDraw()
    
    if (!this.winner && !this.isDraw) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'
    }

    return true
  }

  private checkForWinner(): void {
    const winningPositions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    for (const positions of winningPositions) {
      const [a, b, c] = positions
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        this.winner = this.board[a] as Symbol
        this.winningLine = positions
        return
      }
    }
  }

  private checkForDraw(): void {
    if (!this.winner && this.board.every(cell => cell !== null)) {
      this.isDraw = true
    }
  }

  getBestMove(): number {
    const emptyCells = this.board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null) as number[]

    if (emptyCells.length === 0) return -1

    // Simple AI: try to win, block opponent, or take center/corners
    const boardString = this.board.map(cell => cell || '_').join('')
    
    // Try to win
    for (const cell of emptyCells) {
      const testBoard = [...this.board]
      testBoard[cell] = 'O'
      const testBoardString = testBoard.map(c => c || '_').join('')
      if (isWinning(testBoardString, 'O')) {
        return cell
      }
    }

    // Block opponent from winning
    for (const cell of emptyCells) {
      const testBoard = [...this.board]
      testBoard[cell] = 'X'
      const testBoardString = testBoard.map(c => c || '_').join('')
      if (isWinning(testBoardString, 'X')) {
        return cell
      }
    }

    // Take center if available
    if (emptyCells.includes(4)) return 4

    // Take corners
    const corners = [0, 2, 6, 8].filter(corner => emptyCells.includes(corner))
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)]
    }

    // Take any available cell
    return emptyCells[Math.floor(Math.random() * emptyCells.length)]
  }

  getState() {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      winner: this.winner,
      isDraw: this.isDraw,
      moves: this.gameHistory.length,
      winningLine: this.winningLine
    }
  }

  setState(state: any): void {
    this.board = state.board
    this.currentPlayer = state.currentPlayer
    this.winner = state.winner
    this.isDraw = state.isDraw
    this.winningLine = state.winningLine
    this.gameHistory = state.gameHistory || []
  }

  reset(): void {
    this.board = Array(9).fill(null)
    this.currentPlayer = 'X'
    this.gameHistory = []
    this.winner = null
    this.isDraw = false
    this.winningLine = null
  }
}
