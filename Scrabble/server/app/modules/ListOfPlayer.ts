import { Player } from "./player";
import { Properties } from './properties';

export class ListOfPlayers
{
    private _players: Player[] = [];
    private _size: number;

    get size() : number
    {
        return this._size;
    }

    get players(): Player[]
    {
        return this._players;
    }

    get playerInfos(): { name: string, score: number }[]
    {
        let playerInfos: { name: string, score: number }[] = [];
        for (let p of this.players)
        {
            playerInfos.push({name: p.getName(), score: p.score});
        }
        return playerInfos;
    }

    constructor(size?: number)
    {
        this._size = size || Infinity;
    }

    public addPlayer(playerToAdd: Player): boolean
    {
        if (this.isFull())
        {
            return false;
        }

        this.broadcast(Properties.socketEvent.messageToClient,
            Properties.messages.aNewPlayerJoinedRoom(playerToAdd.getName()));
        this.players.push(playerToAdd);

        this.broadcast(Properties.socketEvent.updateRemainingWaitingPlayerNumber,
                        JSON.stringify(this.size - this.players.length));
        return true;
    }

    public isFull(): boolean
    {
        return this.players.length >= this.size;
    }

    public broadcast(event: string, ...args: any[])
    {
        for (let p of this.players)
        {
            p.sendMessage(event, args);
        }
    }

    public removePlayer(playerToRemove: Player): number
    {
        let index: number;
        if (this.contains(playerToRemove))
        {
            let playerIsPlayerToRemove = (p: Player) => p === playerToRemove;

            index = this.players.findIndex(playerIsPlayerToRemove);
            this.players.splice(index, 1);

            this.broadcast(Properties.socketEvent.messageToClient,
                Properties.messages.aPlayerLeftRoom(playerToRemove.getName()));

            this.broadcast(Properties.socketEvent.updateRemainingWaitingPlayerNumber,
                            JSON.stringify(this.size - this.players.length));
        }
        return index;
    }

    public contains(playerToFind: Player): boolean
    {
        let playerIsplayerToFind = (p: Player) => p === playerToFind;
        return this.players.find(playerIsplayerToFind) !== undefined;
    }


    public findByName(name: string): Player
    {
        let playerIsplayerToFind = (p: Player) => p.getName() === name;
        return this.players.find(playerIsplayerToFind);
    }
}
