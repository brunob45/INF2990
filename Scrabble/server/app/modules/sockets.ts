import * as socketio from 'socket.io';
import * as http from 'http';
import { Database } from './database';
import { GameList } from './gameList';
import { Player } from './player';
import { Properties } from './properties';

export module Sockets
{
    let io: SocketIO.Server = socketio();

    export function init(server: http.Server): void
    {
        io.attach(server);
        io.serveClient(true);
        io.on(Properties.socketEvent.aNewClientIsConnected, (lsocket: SocketIO.Socket) =>
        {
            let player: Player;

            lsocket.emit(Properties.socketEvent.theClientHasSuccefullyConnected, true);

            lsocket.on(Properties.socketEvent.aNewPlayerIsConnected,
                (credidentials: {username: string, password: string}) =>
            {
                Database.importUser(credidentials)
                .then((usr) =>
                {
                    if (usr)
                    {
                        if (!GameList.playerExist(usr.getName()))
                        {
                            player = new Player(lsocket, credidentials.username);
                            GameList.addPlayer(player);
                        }
                        console.log(player.getName() + " connected.");
                    }
                });
            });

            lsocket.on(Properties.socketEvent.thePlayerChoosesAWaitingRoom, (room: number) =>
            {
                if (player)
                {
                    console.log(player.getName() + " enters room " + room);
                    GameList.enterRoom(player, room);
                }
            });

            lsocket.on(Properties.socketEvent.thePlayerLeavesTheWaitingRoom, () =>
            {
                if (player)
                {
                    console.log(player.getName() + " leaves room.");
                    GameList.leaveRoom(player);
                }
            });

            lsocket.on(Properties.socketEvent.thePlayerDisconnected, () =>
            {
                if (player)
                {
                    console.log(player.getName() + " disconnected.");
                    GameList.removePlayer(player);
                    player = null;
                }
            });

            lsocket.on(Properties.socketEvent.ping, () =>
            {
                if (player)
                {
                    player.ping();
                }
            });

            lsocket.on(Properties.socketEvent.messageFromClient, (data: string) =>
            {
                let list = GameList.findListThatContainsPlayer(player);
                if (list)
                {
                    list.broadcast(Properties.socketEvent.messageToClient, data);
                }
            });

            lsocket.on(Properties.socketEvent.commandFromClient, (data: string) =>
            {
                let game = GameList.findGameThatContainsPlayer(player);
                if (game)
                {
                    game.command(player, data);
                }
            });
        });
    }
}
