import React, { useContext, useMemo } from 'react'
import { gameStateContext } from './GameStateContext'
import { myBoardContext } from './MyBoardContext'
import { Shape } from '@tris/common'
import ShapeOption from './ShapeOption'
import './Shapes.css'
import flatten from 'lodash/flatten'

export default function ShapeOptions() {
  const gameState = useContext(gameStateContext)
  const myBoard = useContext(myBoardContext)

  const relevantShapeSets = useMemo(() => {
    if (!myBoard.awaitingTile) return []

    return flatten((myBoard.personalTiles || gameState.tileOptions).map(option => Shape.from(option)))
  }, [gameState.tileOptions, myBoard.awaitingTile, myBoard.personalTiles])
  return (
    <div className={'shape-options'}>
      {relevantShapeSets.map((shape, i) => (
        <ShapeOption key={i} shape={shape} />
      ))}
    </div>
  )
}
