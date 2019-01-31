import * as io from 'socket.io-client';

export module Sockets
{
    let socket: SocketIOClient.Socket;

    const SERVER_LINK = "http://localhost:3002/";

    export function getSocket(): SocketIOClient.Socket
    {
        return socket;
    }

   export function connect(server?: string): SocketIOClient.Socket
    {
        socket = io.connect(server || SERVER_LINK);
        return socket;
    }

    export function addEventHandler(eventName: string, handler: (...data: any[]) => void)
    {
        if (socket)
        {
            socket.on(eventName, handler);
        }
    }

    export function userConnect(player: {username: string, password: string})
    {
        if (socket)
        {
            socket.emit('userConnect', player);
            setPing();
        }
    }

    export function setPing()
    {
        setInterval(() => {
            socket.emit('allo');
        }, 1000);
    }

    export function userDisconnect()
    {
        if (socket)
        {
            socket.disconnect();
        }
    }

    export function sendMessage(message: string)
    {
        if (socket)
        {
            socket.emit('message', message);
        }
    }

    export function sendCommand(command: string)
    {
        if (socket)
        {
            socket.emit('command', command);
        }
    }

    export function enterRoom(room: number)
    {
        if (socket)
        {
            socket.emit('enterRoom', room);
        }
    }

    export function leaveRoom()
    {
        if (socket)
        {
            socket.emit('leaveRoom');
        }
    }
}
