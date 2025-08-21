import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.id !== params.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const matches = await prisma.match.findMany({
      where: {
        participants: {
          some: {
            userId: params.userId
          }
        }
      },
      include: {
        participants: true
      }
    })

    const totalGames = matches.length
    let wins = 0
    let losses = 0
    let draws = 0

    matches.forEach((match: any) => {
      if (match.reason === 'DRAW') {
        draws++
      } else if (match.winnerId === params.userId) {
        wins++
      } else {
        losses++
      }
    })

    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0

    return NextResponse.json({
      totalGames,
      wins,
      losses,
      draws,
      winRate
    })

  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
