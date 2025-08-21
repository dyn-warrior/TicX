'use client'

import { useState } from 'react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GameBoard } from '@/components/game/board'
import { PlayerStats } from '@/components/game/player-stats'
import { GameHistory } from '@/components/game/game-history'

interface GameDashboardProps {
  user: User
}

export function GameDashboard({ user }: GameDashboardProps) {
  const [gameMode, setGameMode] = useState<'menu' | 'playing' | 'multiplayer'>('menu')
  const [currentGame, setCurrentGame] = useState<string | null>(null)

  const handleStartSinglePlayer = () => {
    setGameMode('playing')
    setCurrentGame('single-player')
  }

  const handleStartMultiplayer = () => {
    setGameMode('multiplayer')
    setCurrentGame('multiplayer')
  }

  const handleBackToMenu = () => {
    setGameMode('menu')
    setCurrentGame(null)
  }

  if (gameMode === 'playing' || gameMode === 'multiplayer') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {gameMode === 'playing' ? 'Single Player' : 'Multiplayer'} Game
          </h1>
          <Button 
            variant="outline" 
            onClick={handleBackToMenu}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Menu
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GameBoard 
              gameId={currentGame} 
              isMultiplayer={gameMode === 'multiplayer'}
              onGameEnd={handleBackToMenu}
            />
          </div>
          
          <div className="space-y-6">
            <PlayerStats userId={user.id!} />
            <GameHistory userId={user.id!} limit={5} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-xl text-gray-600">
          Ready for a game of TicX?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Single Player</h3>
          <p className="text-gray-600 mb-4">
            Play against our AI opponent and improve your skills.
          </p>
          <Button onClick={handleStartSinglePlayer} className="w-full">
            Start Game
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Multiplayer</h3>
          <p className="text-gray-600 mb-4">
            Challenge other players online in real-time matches.
          </p>
          <Button onClick={handleStartMultiplayer} className="w-full">
            Find Match
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Tournament</h3>
          <p className="text-gray-600 mb-4">
            Join competitive tournaments and climb the leaderboard.
          </p>
          <Button variant="outline" className="w-full" disabled>
            Coming Soon
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PlayerStats userId={user.id!} />
        <GameHistory userId={user.id!} />
      </div>
    </div>
  )
}
