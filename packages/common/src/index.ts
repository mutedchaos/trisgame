export { default as Shape } from './Shape'
export * from './GameState'

export enum SocketMessage {
  HELLO = 'HELLO',
  START = 'START',
  ADD = 'ADD',
  RESTART = 'RESTART',
  GIVE_UP = 'GIVE_UP',
}
