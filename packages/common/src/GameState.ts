export enum GamePhase {
  WaitingForPlayers,
  PlacingStartingTiles,
  RegularGame,
  GameOver,
}

export enum CellData {
  EMPTY,
  INVALID,
  SEMIVALID,
  VALID,
  FILLED,
  CENTER,
  BONUS,
}

export type Cell = {
  data: CellData
  color?: string
}

export interface GameState {
  phase: GamePhase
  tileOptions: string[]
  width: number
  height: number
  players: Array<{
    id: string
    name: string
    initialTile: string
    awaitingTile: boolean
    gameOver: boolean
    cells: Cell[]
  }>
}
