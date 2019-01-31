
import * as socketio from 'socket.io';
import * as http from 'http';
import { Queues } from './queues';

export module Sockets{

    let sockets: SocketIO.Socket[] = [];
    let io: SocketIO.Server = socketio();

    export function init(server: http.Server): void
    {
        io.attach(server);
        io.serveClient(true);
        io.on('connection', (lsocket: SocketIO.Socket) => {
            sockets.push(lsocket);
            lsocket.emit('success', "connection établie");
            let send: { easy: number, hard: number } =
                      { "easy": Queues.easySudokuQueue.getSize(), "hard": Queues.hardSudokuQueue.getSize() };
            lsocket.emit( 'QueueSize', JSON.stringify(send) );
        });
        io.on('disconnect', (lsocket: SocketIO.Socket) => {
            let index: number = sockets.indexOf(lsocket);
            if (index >= 0)
            {
                sockets.splice(index, 1);
            }
            console.log("ALLO");
        });
    }

    export function update(): void
    {
        if (Queues.easySudokuQueue !== undefined && Queues.hardSudokuQueue !== undefined)
        {
            let send: {easy: number, hard: number} =
                      {"easy": Queues.easySudokuQueue.getSize(), "hard": Queues.hardSudokuQueue.getSize() };
            emit(JSON.stringify(send), 'QueueSize');
        }
    }

    export function emit(data: string, message?: string): void
    {
        for (let s of sockets)
        {
            s.emit(message || "message", data);
        }
    }

}
