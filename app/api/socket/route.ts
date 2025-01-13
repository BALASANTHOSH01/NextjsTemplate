import { Server } from 'socket.io'
import { NextApiResponseServerIO } from '@/types/next'

export function GET(req: Request, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.on('join-room', (roomId: string) => {
        socket.join(roomId)
      })

      socket.on('leave-room', (roomId: string) => {
        socket.leave(roomId)
      })

      socket.on('send-message', (message: { roomId: string, content: string }) => {
        io.to(message.roomId).emit('new-message', message)
      })
    })
  }
  return new Response('Socket initialized')
}

