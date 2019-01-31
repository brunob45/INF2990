import { GameList } from './gameList';
import { LetterDeck } from './letterDeck';
import { Properties } from './properties';

export class Player
{
    private socket: SocketIO.Socket;
    private name: string;
    private hasReceivedPing = true;
    score: number;
    deck: LetterDeck;

    constructor(socket: SocketIO.Socket, name: string)
    {
        this.socket = socket;
        this.name = name;
        this.deck = null;
        this.score = 0;

        let timeOutInterval = setInterval( () =>
        {
            if (this.hasReceivedPing)
            {
                this.hasReceivedPing = false;
            }
            else
            {
                GameList.removePlayer(this);
                clearInterval(timeOutInterval);
                if (socket)
                {
                    this.socket.disconnect();
                }
            }
        }, 5000);
    }

    ping(): void
    {
        this.hasReceivedPing = true;
    }

    sendMessage(event: string, ...args: any[])
    {
        if (this.socket)
        {
            this.socket.emit(event, args);
        }
    }

    getName(): string
    {
        return this.name;
    }

    getDeck(): LetterDeck
    {
        return this.deck;
    }

    setDeck(deck: LetterDeck): void
    {
        this.deck = deck;
    }

    sendDeck(): void
    {
        this.sendMessage(Properties.socketEvent.sendLettersToPlayer, this.deck.deck);
    }
}
