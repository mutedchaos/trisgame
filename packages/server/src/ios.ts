import { Server } from 'socket.io'

let server: Server | null

export function setIOS(ios: Server) {
  server = ios
}

export function getIOS() {
  if (!server) throw new Error('Server not set up')
  return server
}
