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

export enum Borders {
  Top = 1,
  Right = 2,
  Bottom = 4,
  Left = 8,
}

export type Cell = {
  data: CellData
  color?: string
  borders?: number
}

export interface GameState {
  id: string
  v: number
  turn: number
  code: string
  phase: GamePhase
  tileOptions: string[]
  width: number
  height: number
  players: Array<{
    id: string
    name: string
    personalTiles: string[] | null
    awaitingTile: boolean
    gameOver: boolean
    cells: Cell[]
  }>
  secrets?: {
    remainingTiles: string[]
  }
}
