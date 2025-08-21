import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MatchmakingQueue } from '@/lib/redis'
import { joinQueueSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { baseEntry, leverage } = joinQueueSchema.parse(body)
    
    const finalEntry = baseEntry * leverage

    // Check user's wallet balance and ensure they're not banned
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { wallet: true },
    })

    if (!user || user.banned) {
      return NextResponse.json(
        { error: 'User not found or banned' },
        { status: 403 }
      )
    }

    if (!user.wallet || user.wallet.balance < finalEntry) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Check if user is already in an active match
    const activeMatch = await prisma.match.findFirst({
      where: {
        status: { in: ['WAITING', 'ACTIVE'] },
        participants: {
          some: { userId: session.user.id }
        }
      }
    })

    if (activeMatch) {
      return NextResponse.json(
        { error: 'Already in an active match' },
        { status: 400 }
      )
    }

    // Hold the entry amount in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { userId: session.user.id },
        data: {
          balance: { decrement: finalEntry },
          locked: { increment: finalEntry },
        },
      })

      await tx.walletTransaction.create({
        data: {
          userId: session.user.id,
          walletId: user.wallet!.id,
          type: 'ENTRY_HOLD',
          amount: -finalEntry,
          status: 'SUCCESS',
          ref: `Queue entry hold - ${baseEntry} x ${leverage}`,
        },
      })
    })

    // Add to matchmaking queue
    await MatchmakingQueue.joinQueue(finalEntry, session.user.id, leverage)

    return NextResponse.json({
      success: true,
      data: {
        entryAmount: finalEntry,
        leverage,
        message: 'Successfully joined queue',
      },
    })

  } catch (error) {
    console.error('Queue join error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
