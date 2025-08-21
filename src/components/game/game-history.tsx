'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'

interface GameHistoryProps {
  userId: string
  limit?: number
}

interface GameRecord {
  id: string
  winner: string | null
  isDraw: boolean
  gameType: string
  createdAt: string
  moves: number
}

export function GameHistory({ userId, limit = 10 }: GameHistoryProps) {
  const [games, setGames] = useState<GameRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/games?limit=${limit}`)
        if (response.ok) {
          const data = await response.json()
          setGames(data)
        }
      } catch (error) {
        console.error('Failed to fetch game history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGameHistory()
  }, [userId, limit])

  const getResultText = (game: GameRecord) => {
    if (game.isDraw) return 'Draw'
    if (game.winner === 'X') return 'Win'
    return 'Loss'
  }

  const getResultColor = (game: GameRecord) => {
    if (game.isDraw) return 'text-yellow-600'
    if (game.winner === 'X') return 'text-green-600'
    return 'text-red-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Games</h3>
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    )
  }

  if (games.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Games</h3>
        <p className="text-gray-500 text-center py-8">
          No games played yet. Start your first game!
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Recent Games</h3>
      <div className="space-y-3">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${getResultColor(game)}`}>
                  {getResultText(game)}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-600 capitalize">
                  {game.gameType.replace('-', ' ')}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(game.createdAt)} • {game.moves} moves
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
