import React, { useContext, useMemo } from 'react'
import { gameStateContext } from './GameStateContext'
import { myBoardContext } from './MyBoardContext'
import { Shape } from '@tris/common'
import ShapeOption from './ShapeOption'
import './Shapes.css'

export default function ShapeOptions() {
  const gameState = useContext(gameStateContext)
  const myBoard = useContext(myBoardContext)

  const relevantShapeSets = useMemo(() => {
    if (!myBoard.awaitingTile) return []

    return (myBoard.personalTiles || gameState.tileOptions).map(option => Shape.from(option))
  }, [gameState.tileOptions, myBoard.awaitingTile, myBoard.personalTiles])
  return (
    <div>
      {relevantShapeSets.map((set, i) => (
        <div className={'shape-set'} key={i}>
          {set.map((shape, i2) => (
            <ShapeOption key={i2} shape={shape} />
          ))}
        </div>
      ))}
    </div>
  )
}
