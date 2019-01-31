import { Player } from './player';
import { GameList } from './gameList';
import { Grid } from './grid';
import { ListOfPlayers } from './ListOfPlayer';
import { LetterPouch } from './letterPouch';
import { LetterDeck } from './letterDeck';
import { Database } from './database';
import { Properties } from './properties';

const LIMIT_TIME_PER_TURN = 300000;

export class Game
{
    private pouch: LetterPouch;
    private activePlayerID: number;
    private turnTimer: NodeJS.Timer;
    private grid: Grid;
    public gameEnded: boolean;

    private validCommands = {
        "placer": (player: Player, argv: string[]) => this.placer(player, argv),
        "changer": (player: Player, argv: string[]) => this.changer(player, argv),
        "passer": (player: Player, argv: string[]) => this.passer(player, argv),
        "aide": (player: Player, argv: string[]) => this.aide(player, argv)
    };

    get list(): ListOfPlayers
    {
        return this._players;
    }

    get activePlayer(): Player
    {
        return this.list.players[this.activePlayerID];
    }

    constructor(private _players: ListOfPlayers)
    {
        this.gameEnded = false;
        LetterPouch.CreateNewLetterPouch()
        .then((pouch) => {
            this.list.broadcast(Properties.socketEvent.messageToClient, Properties.messages.newGameMessage);
            this.list.broadcast(Properties.socketEvent.gameCreated);
            this.pouch = pouch;
            for (let p of this.list.players)
            {
                let deck = new LetterDeck();
                while (!deck.isFull())
                {
                    deck.addLetter(this.pouch.pick());
                }
                p.setDeck(deck);
                p.sendDeck();
            }
            this.activePlayerID = 0;
            this.grid = new Grid();
            this.turnTimer = setTimeout( () =>
            {
                this.endTurn();
            }, LIMIT_TIME_PER_TURN);
            this.gameUpdate();
            console.log("game created");
        });
    }

    public removePlayer(playerToRemove: Player): void
    {
        for (let l of playerToRemove.getDeck().deck)
        {
            this.pouch.addLetter(l);
        }

        let index: number = this.list.removePlayer(playerToRemove);
        if (this.gameEnded)
        {
            this.list.broadcast(Properties.socketEvent.aPlayerDisconnected,
                                playerToRemove.getName());
        }

        if (this.list.size === 0)
        {
            GameList.removeGame(this);
            clearTimeout(this.turnTimer);
        }
        else
        {
            if (this.activePlayerID >= index)
            {
                this.activePlayerID--;
            }
            this.endTurn();
        }
    }

    public command(player: Player, data: string): void
    {
        if (this.gameEnded)
        {
            this.list.broadcast(Properties.socketEvent.messageToClient,
                                Properties.messages.gameIsOver(player.getName()));
        }
        else
        {
            let command: string[] = data.split(' ');

            let commandToExecute: Function = this.validCommands[command[0]];

            if (commandToExecute)
            {
                if (command[0] === "aide" || player === this.activePlayer)
                {
                    command.splice(0, 1);
                    commandToExecute(player, command);
                }
                else
                {
                    this.list.broadcast(Properties.socketEvent.messageToClient,
                                        Properties.messages.invalidTurn(player.getName()));
                }
            }
            else
            {
                this.list.broadcast(Properties.socketEvent.messageToClient,
                                    Properties.messages.syntaxError(this.activePlayer.getName()));
        }
        }
    }

    private placer(player: Player, argv: string[]): void
    {
        if (argv.length !== 2)
        {
            this.list.broadcast(Properties.socketEvent.messageToClient,
                                Properties.messages.syntaxError(this.activePlayer.getName()));
            return;
        }

        let word: string = argv[1];
        let usedLetters: string;
        Database.singleWordExist(word)
        .then((exist: boolean) =>
        {
            if (exist)
            {
                return this.grid.testWordPlacement(argv[0], argv[1]);
            }
            else
            {
                this.list.broadcast(Properties.socketEvent.messageToClient,
                                    Properties.messages.invalidWord(this.activePlayer.getName(), word));
            }
        })
        .then((letters) =>
        {
            if (letters)
            {
                usedLetters = letters;
                if (this.activePlayer.deck.contains(letters))
                {
                    return this.grid.placeWord(argv[0], argv[1], this.activePlayer.deck);
                }
            }
            else
            {
                this.list.broadcast(Properties.socketEvent.messageToClient,
                                    Properties.messages.cannotPlace(this.activePlayer.getName()));
            }
        })
        .then((score) =>
        {
            if (score)
            {
                this.activePlayer.score += score;
                if (this.pouch.letters.length < usedLetters.length)
                {
                    this.endGame();
                }
                else
                {
                    for (let i = 0; i < usedLetters.length; i++)
                    {
                        this.activePlayer.deck.addLetter(this.pouch.pick());
                    }
                    this.activePlayer.sendDeck();
                    this.endTurn();
                }
            }
        });
    }

    private changer(player: Player, argv: string[]): void
    {
        if (argv.length !== 1)
        {
            this.list.broadcast(Properties.socketEvent.messageToClient,
                                Properties.messages.syntaxError(this.activePlayer.getName()));
            return;
        }

        let letters = argv[0].toUpperCase();
        let deck = player.getDeck();

        if (letters.length > this.pouch.letters.length)
        {
            this.list.broadcast(Properties.socketEvent.messageToClient,
                                Properties.messages.changerNotEnoughLetterInPouch(this.activePlayer.getName()));
            return;
        }

        if (!deck.contains(letters))
        {
            this.list.broadcast(Properties.socketEvent.messageToClient,
                                Properties.messages.playerDoesNotHaveRequiredLetters(this.activePlayer.getName()));
            return;
        }
        for (let l of letters)
        {
            deck.removeLetter(l);
            deck.addLetter(this.pouch.pick());
        }
        player.sendDeck();
        this.endTurn();
    }

    private passer(player: Player, argv: string[]): void
    {
        this.endTurn();
    }

    private aide(player: Player, argv: string[]): void
    {
        player.sendMessage(Properties.socketEvent.messageToClient, Properties.messages.help);
    }

    private endTurn(): void
    {
        if (this.activePlayer)
        {
            this.activePlayer.sendMessage(Properties.socketEvent.messageToClient,
                                          Properties.messages.notifyPlayerTurnEnd);
        }
        this.activePlayerID = (this.activePlayerID + 1) % this.list.players.length;
        clearTimeout(this.turnTimer);
        this.turnTimer = setTimeout( () =>
        {
            this.endTurn();
        }, LIMIT_TIME_PER_TURN);

        this.gameUpdate();
    }

    private gameUpdate(): void
    {
        this.list.broadcast(Properties.socketEvent.gameUpdate, this.grid.toLetterArray(),
                                                               this.list.playerInfos,
                                                               this.activePlayerID);
        if (this.activePlayer)
        {
            this.activePlayer.sendMessage(Properties.socketEvent.messageToClient, Properties.messages.notifyPlayerTurn);
        }
    }

    private endGame(): void
    {
        this.gameEnded = true;
        let remainingLetterScore = 0;
        for (let p of this.list.players)
        {
            for (let l of p.deck.deck)
            {
                p.score -= l.value;
                remainingLetterScore += l.value;
            }
        }
        this.activePlayer.score += remainingLetterScore;
        this.gameUpdate();
        this.list.broadcast(Properties.socketEvent.endGame);
    }
}
