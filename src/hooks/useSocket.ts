'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket(gameId: string | null) {
  const socket = useRef<Socket | null>(null)

  useEffect(() => {
    if (gameId) {
      // Initialize socket connection
      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        transports: ['websocket'],
      })

      // Join the game room
      socket.current.emit('joinGame', gameId)

      return () => {
        if (socket.current) {
          socket.current.disconnect()
          socket.current = null
        }
      }
    }
  }, [gameId])

  return socket.current
}
