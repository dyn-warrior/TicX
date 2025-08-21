'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'

interface PlayerStatsProps {
  userId: string
}

interface Stats {
  totalGames: number
  wins: number
  losses: number
  draws: number
  winRate: number
}

export function PlayerStats({ userId }: PlayerStatsProps) {
  const [stats, setStats] = useState<Stats>({
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/stats`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch player stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Player Stats</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </Card>
    )
  }

  const statItems = [
    { label: 'Total Games', value: stats.totalGames, color: 'text-gray-900' },
    { label: 'Wins', value: stats.wins, color: 'text-green-600' },
    { label: 'Losses', value: stats.losses, color: 'text-red-600' },
    { label: 'Draws', value: stats.draws, color: 'text-yellow-600' },
    { label: 'Win Rate', value: `${stats.winRate.toFixed(1)}%`, color: 'text-blue-600' }
  ]

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Player Stats</h3>
      <div className="space-y-3">
        {statItems.map((item) => (
          <div key={item.label} className="flex justify-between items-center">
            <span className="text-gray-600">{item.label}:</span>
            <span className={`font-semibold ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
