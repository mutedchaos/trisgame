import { GameState, SocketMessage } from '@tris/common'
import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from 'react'

import ioclient from 'socket.io-client'
import { playerIdContext } from './PlayerIdContext'

interface Ctx {
  subscribe(handler: (gameState: GameState) => void): () => void
  sendMessage(msgType: SocketMessage, data?: any): void
}

export const socketContext = React.createContext<Ctx>(null as any)

interface Props {
  children: ReactNode
  fallback: ReactNode
}

export function SocketProvider({ children, fallback }: Props) {
  const handlers = useRef<Array<(gameState: GameState) => void>>([])
  const version = useRef(-1)
  const playerId = useContext(playerIdContext)
  const client = useMemo(
    () =>
      ioclient.io({
        query: { playerId },
      }),
    [playerId]
  )

  useEffect(() => {
    client.on('game-state', (e: GameState) => {
      if (e.v < version.current) return
      version.current = e.v
      for (const handler of handlers.current) {
        handler(e)
      }
    })
  }, [client])

  const subscribe = useCallback<Ctx['subscribe']>(handler => {
    handlers.current.push(handler)
    return () => {
      const index = handlers.current.indexOf(handler)
      if (index > -1) {
        handlers.current.splice(index, 1)
      }
    }
  }, [])

  const sendMessage = useCallback<Ctx['sendMessage']>(
    (msg, data) => {
      client.emit(msg, data)
    },
    [client]
  )

  const value = useMemo<Ctx>(
    () => ({
      subscribe,
      sendMessage,
    }),
    [sendMessage, subscribe]
  )
  if (!playerId) return <>{fallback}</>
  return <socketContext.Provider value={value}>{children}</socketContext.Provider>
}
