import { Game } from './game';
import { Player } from './player';
import { ListOfPlayers } from './ListOfPlayer';
import { Properties } from './properties';

export module GameList
{
    let list: Game[] = [];

    // rooms : 1 is for players in neither rooms
    let playerQueues: ListOfPlayers[] = [];

    export function addPlayer(p: Player)
    {
        if (!playerQueues[1])
        {
            playerQueues[1] = new ListOfPlayers();
        }

        playerQueues[1].addPlayer(p);
    }

    export function playerExist(playerToFind: string): boolean
    {
        for (let g of list)
        {
            if (g.list.findByName(playerToFind))
            {
                // player exists
                return true;
            }
        }

        for ( let q of playerQueues)
        {
            if (q)
            {
                if (q.findByName(playerToFind))
                {
                    // player exists
                    return true;
                }
            }
        }
        // player was not found, therefore does not exist
        return false;
    }

    export function findListThatContainsPlayer(playerToFind: Player): ListOfPlayers
    {
        // scan queues of waiting players
        for (let q of playerQueues)
        {
            if (q && q.contains(playerToFind))
            {
                // if player is found, return list
                return q;
            }
        }

        // scan created games
        let game = findGameThatContainsPlayer(playerToFind);
        return game ? game.list : null;
    }

    export function findGameThatContainsPlayer(playerToFind: Player): Game
    {
        for (let g of list)
        {
            if (g.list.contains(playerToFind))
            {
                return g;
            }
        }
        return null;
    }

    export function removePlayer(playerToRemove: Player): void
    {
        let g: Game;
        if (g = findGameThatContainsPlayer(playerToRemove))
        {
            g.removePlayer(playerToRemove);
        }

        let l: ListOfPlayers;
        if (l = findListThatContainsPlayer(playerToRemove))
        {
            l.removePlayer(playerToRemove);
            return;
        }
    }

    export function enterRoom(playerToMove: Player, room: number)
    {
        if (!playerQueues[room])
        {
            playerQueues[room] = new ListOfPlayers(room);
        }

        playerQueues[1].removePlayer(playerToMove);
        playerQueues[room].addPlayer(playerToMove);

        if (playerQueues[room].isFull())
        {
            list.push(new Game(playerQueues[room]));
            playerQueues[room] = new ListOfPlayers(room);
        }
        else
        {
            playerToMove.sendMessage(Properties.socketEvent.messageToClient,
                Properties.messages.welcomeMessage(room));
        }
    }

    export function leaveRoom(playerToMove: Player)
    {
        findListThatContainsPlayer(playerToMove).removePlayer(playerToMove);
        playerQueues[1].addPlayer(playerToMove);
    }

    export function removeGame(gameToRemove: Game): void
    {
        list.splice(list.indexOf(gameToRemove), 1);
    }
}
