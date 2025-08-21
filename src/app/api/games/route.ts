import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { winner, isDraw, moves, gameType = 'single-player' } = body

    let winnerId = null
    if (winner === 'X') {
      winnerId = session.user.id // User won
    }

    // Create a match record for single player games
    const match = await prisma.match.create({
      data: {
        status: 'COMPLETED',
        entryFinalE: 0, // Single player has no entry fee
        leverage: 1,
        board: moves ? moves.map((m: any) => m || '_').join('') : '_________',
        turn: 'X',
        winnerId,
        reason: isDraw ? 'DRAW' : winner ? 'WIN' : 'LOSS',
        startedAt: new Date(),
        endedAt: new Date(),
        participants: {
          create: [
            {
              userId: session.user.id,
              symbol: 'X'
            }
          ]
        }
      }
    })

    return NextResponse.json({
      success: true,
      game: {
        id: match.id,
        winnerId: match.winnerId,
        isDraw: match.reason === 'DRAW',
        gameType: 'single-player'
      }
    })

  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
