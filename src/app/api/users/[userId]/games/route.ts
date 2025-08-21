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

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')

    const matches = await prisma.match.findMany({
      where: {
        participants: {
          some: {
            userId: params.userId
          }
        }
      },
      include: {
        participants: true,
        moves: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    const formattedGames = matches.map((match: any) => ({
      id: match.id,
      winner: match.winnerId === params.userId ? 'X' : match.winnerId ? 'O' : null,
      isDraw: match.reason === 'DRAW',
      gameType: 'single-player', // For now, all games are single player
      createdAt: match.createdAt.toISOString(),
      moves: match.moves.length
    }))

    return NextResponse.json(formattedGames)

  } catch (error) {
    console.error('Error fetching user games:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
