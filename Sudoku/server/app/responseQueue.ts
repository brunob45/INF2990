import * as express from 'express';
import { SudokuQueue } from './sudokuQueue.js';
import { Sockets } from './sockets';
import { Queues } from './queues';

const MAX_PENDING_REQUEST = 1000000;

interface ConnectionData
{
  response: express.Response;
  ip: string;
}

export class ResponseQueue{

    queue: ConnectionData[];
    isHard: boolean;
    sudoQueue: SudokuQueue;
    size: number;
    start: number;

    getSize(): number
    {
        return this.size;
    }

    constructor(isHard: boolean)
    {
        this.size = 0;
        this.start = 0;
        this.queue = [];
        this.isHard = isHard;
        this.sudoQueue = isHard ? Queues.hardSudokuQueue : Queues.easySudokuQueue;
        setInterval( () =>
        {
            if (this.getSize() > 0 && this.sudoQueue.getSize() > 0)
            {
                this.pop().json(this.sudoQueue.pop().toString());
            }
        }, 100);
    }

    push(res: express.Response, ip: string): void
    {
        this.queue[this.start + this.size] = {response: res, ip: ip};
        this.size++;
        if (this.size > MAX_PENDING_REQUEST)
        {
            console.log("Server can't keep up! Shutting down...");
            //crashes the server because the load is too high. Probably DDOS
            process.exit();
        }
    }

    pop(): express.Response
    {
        if (this.size > 0)
        {
            this.size--;
            let result = this.queue[this.start];
            this.start = this.start + 1;

            if ((this.start + this.size) > MAX_PENDING_REQUEST)
            {
                this.refactor();
            }

            Sockets.emit("Sudoku " + (this.isHard ? "difficile" : "moyen") + " envoyé à " + result.ip);
            return result.response;
        }
        return null;
    }

    refactor(): void
    {
        for (let i = 0; i > this.size; i++)
        {
            this.queue[i] = this.queue[this.start + i];
        }
        this.start = 0;
    }
}
