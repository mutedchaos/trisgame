import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import produce from 'immer'
import { Cell, CellData, GameState } from '@tris/common'
import { playerIdContext } from './PlayerIdContext'
import { gameStateContext } from './GameStateContext'
import { selectedShapeContext } from './selectedShapeContext'

type MyBoardType = GameState['players'][number] & {
  hover(index: number): void
  click(index: number): void
}

export const myBoardContext = React.createContext<MyBoardType>(null as any)

interface Props {
  children: ReactNode
}
export function MyBoardProvider({ children }: Props) {
  const [cells, setCells] = useState<Cell[]>([])
  const [hovered, setHovered] = useState(-1)
  const playerId = useContext(playerIdContext)
  const { players, width } = useContext(gameStateContext)
  const { shape: selectedShape, offsetX, offsetY } = useContext(selectedShapeContext)
  const playerInfo = players.find(p => p.id === playerId)
  if (!playerInfo) throw new Error('Player info not found')
  const extraOffset = -(offsetY - 1) * width - offsetX + 1

  console.log(extraOffset)
  useEffect(() => {
    setCells(
      produce(playerInfo.cells, t => {
        if (!playerInfo.awaitingTile) return t
        const offsets = selectedShape?.getOffsets(width) ?? []
        const adjustedOffsets = offsets.map(o => o + hovered + extraOffset)
        const cells = adjustedOffsets.map(i => t[i])
        const valid =
          cells.every(c => c && (c.data === CellData.EMPTY || c.data === CellData.CENTER)) &&
          !(adjustedOffsets.some(o => o % width === 0) && adjustedOffsets.some(o => o % width === width - 1))
        for (const offset of adjustedOffsets) {
          if (!t[offset]) continue
          t[offset].data = valid
            ? CellData.VALID
            : t[offset].data === CellData.EMPTY
            ? CellData.SEMIVALID
            : CellData.INVALID
        }
      })
    )
  }, [extraOffset, hovered, playerInfo.awaitingTile, playerInfo.cells, selectedShape, width])

  const handleClick = useCallback(() => {}, [])

  const value = useMemo<MyBoardType>(() => ({ ...playerInfo, cells, hover: setHovered, click: handleClick }), [
    playerInfo,
    cells,
    handleClick,
  ])

  if (!value.cells.length) return null

  return <myBoardContext.Provider value={value}>{children}</myBoardContext.Provider>
}
