import { Sockets } from "../modules/sockets";
import { emojis } from '../modules/emojis';
import { GameInfo } from '../modules/gameInfo';

export class Chat {
    static MAX_SIZE_OF_LOG = 150;

    timer: NodeJS.Timer;

    input = '';
    log: {text: string, server: boolean}[] = [];

    constructor()
    {
        this.timer = setInterval(() => {
                this.noAnswerFromServer();
            }, 5000);
    }

    executeInput(): void
    {
        if (this.input[0] === '/')
        {
            Sockets.sendCommand(this.input.slice(1));
        }
        else
        {
            let message = {"name": GameInfo.username, "text": this.input};
            Sockets.sendMessage(JSON.stringify(message));
            this.timer = setInterval(() => {
                    this.noAnswerFromServer();
                }, 1000);
        }

        this.input = '';
    }

    inputKeyUp(e: any)
    {
        this.input = e.target.value;
        return true;
    }

    addEntry(name: string, message: string)
    {
        for (let e of emojis)
        {
            message = message.split(e.ascii).join(String.fromCodePoint(e.unicode));
        }

        this.log.push({text: name + " : " + message, server: (name === "Serveur")});
        if (this.log.length > 150)
        {
            this.log.shift();
        }
    }

    noAnswerFromServer()
    {
        this.addEntry("Erreur", "Le serveur ne répond plus.");
        clearInterval(this.timer);
    }

    hasAnswerFromServer()
    {
        clearInterval(this.timer);
    }
}
