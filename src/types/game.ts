export interface GameState {
  board: string
  turn: 'X' | 'O'
  winner?: 'X' | 'O'
  isDraw: boolean
  isGameOver: boolean
}

export interface MatchData {
  id: string
  status: 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  board: string
  turn: 'X' | 'O'
  entryFinalE: number
  leverage: number
  participants: MatchParticipant[]
  moves: Move[]
  winnerId?: string
  reason?: 'WIN' | 'LOSS' | 'DRAW' | 'FORFEIT' | 'CANCELLED'
  createdAt: Date
  startedAt?: Date
  endedAt?: Date
}

export interface MatchParticipant {
  id: string
  userId: string
  symbol: 'X' | 'O'
  isWinner: boolean
  user: {
    username: string
    rating: number
  }
}

export interface Move {
  id: string
  index0to8: number
  symbol: 'X' | 'O'
  moveNo: number
  createdAt: Date
  userId: string
}

export interface WalletData {
  balance: number
  locked: number
}

export interface QueueEntry {
  userId: string
  entryAmount: number
  leverage: number
  timestamp: number
}

export interface SocketEvents {
  'match.found': {
    matchId: string
    symbol: 'X' | 'O'
    entryAmount: number
    opponent: {
      username: string
      rating: number
    }
  }
  'match.state': {
    board: string
    turn: 'X' | 'O'
    moveNo: number
    remainingMs: number
  }
  'move.submit': {
    matchId: string
    index0to8: number
  }
  'move.accepted': {
    moveNo: number
    index0to8: number
    symbol: 'X' | 'O'
  }
  'match.end': {
    outcome: 'WIN' | 'LOSS' | 'DRAW' | 'FORFEIT'
    winnerId?: string
    reason: string
  }
  error: {
    code: string
    message: string
  }
}
