'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GameEngine } from '@/lib/game-engine'
import { useSocket } from '@/hooks/useSocket'

interface GameBoardProps {
  gameId: string | null
  isMultiplayer?: boolean
  onGameEnd?: () => void
}

export function GameBoard({ gameId, isMultiplayer = false, onGameEnd }: GameBoardProps) {
  const { data: session } = useSession()
  const [game, setGame] = useState(() => new GameEngine())
  const [gameState, setGameState] = useState(game.getState())
  const [waitingForPlayer, setWaitingForPlayer] = useState(isMultiplayer)
  const socket = useSocket(isMultiplayer ? gameId : null)

  useEffect(() => {
    if (socket && isMultiplayer) {
      socket.on('gameUpdate', (newState) => {
        const newGame = new GameEngine()
        newGame.setState(newState)
        setGame(newGame)
        setGameState(newState)
      })

      socket.on('playerJoined', () => {
        setWaitingForPlayer(false)
      })

      socket.on('playerLeft', () => {
        setWaitingForPlayer(true)
      })

      return () => {
        socket.off('gameUpdate')
        socket.off('playerJoined')
        socket.off('playerLeft')
      }
    }
  }, [socket, isMultiplayer])

  const handleCellClick = async (index: number) => {
    if (waitingForPlayer || gameState.winner || gameState.isDraw) return

    const success = game.makeMove(index)
    if (!success) return

    const newState = game.getState()
    setGameState(newState)

    if (isMultiplayer && socket) {
      socket.emit('makeMove', { gameId, move: index, state: newState })
    } else if (!isMultiplayer && !newState.winner && !newState.isDraw) {
      // AI move for single player
      setTimeout(() => {
        const aiMove = game.getBestMove()
        if (aiMove !== -1) {
          game.makeMove(aiMove)
          const aiState = game.getState()
          setGameState(aiState)
          
          if (aiState.winner || aiState.isDraw) {
            saveGameResult(aiState)
          }
        }
      }, 500)
    }

    if (newState.winner || newState.isDraw) {
      saveGameResult(newState)
    }
  }

  const saveGameResult = async (finalState: any) => {
    if (!session?.user?.id) return

    try {
      await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winner: finalState.winner,
          isDraw: finalState.isDraw,
          moves: finalState.moves,
          gameType: isMultiplayer ? 'multiplayer' : 'single-player'
        })
      })
    } catch (error) {
      console.error('Failed to save game result:', error)
    }
  }

  const handleRestart = () => {
    const newGame = new GameEngine()
    setGame(newGame)
    setGameState(newGame.getState())

    if (isMultiplayer && socket) {
      socket.emit('restartGame', { gameId })
    }
  }

  const renderCell = (index: number) => {
    const value = gameState.board[index]
    const isWinningCell = gameState.winningLine?.includes(index)
    
    return (
      <button
        key={index}
        onClick={() => handleCellClick(index)}
        disabled={!!value || !!gameState.winner || gameState.isDraw || waitingForPlayer}
        className={`
          aspect-square bg-white border-2 border-gray-300 rounded-lg
          flex items-center justify-center text-4xl font-bold
          transition-all duration-200 hover:bg-gray-50
          ${isWinningCell ? 'bg-green-100 border-green-500' : ''}
          ${!value && !gameState.winner && !gameState.isDraw && !waitingForPlayer 
            ? 'hover:border-blue-500 cursor-pointer' 
            : 'cursor-not-allowed'
          }
        `}
      >
        {value && (
          <span className={value === 'X' ? 'text-blue-600' : 'text-red-600'}>
            {value}
          </span>
        )}
      </button>
    )
  }

  const getStatusMessage = () => {
    if (waitingForPlayer) {
      return 'Waiting for another player to join...'
    }
    if (gameState.winner) {
      if (isMultiplayer) {
        return `Player ${gameState.winner} wins!`
      }
      return gameState.winner === 'X' ? 'You win!' : 'AI wins!'
    }
    if (gameState.isDraw) {
      return "It's a draw!"
    }
    if (isMultiplayer) {
      return `Player ${gameState.currentPlayer}'s turn`
    }
    return gameState.currentPlayer === 'X' ? 'Your turn' : "AI's turn"
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isMultiplayer ? 'Multiplayer Game' : 'Single Player Game'}
        </h2>
        <p className="text-lg text-gray-600">
          {getStatusMessage()}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
        {Array.from({ length: 9 }, (_, i) => renderCell(i))}
      </div>

      {(gameState.winner || gameState.isDraw) && (
        <div className="flex justify-center space-x-4">
          <Button onClick={handleRestart}>
            Play Again
          </Button>
          {onGameEnd && (
            <Button variant="outline" onClick={onGameEnd}>
              Back to Menu
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
