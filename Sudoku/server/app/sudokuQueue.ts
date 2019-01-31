import { Sudoku } from './sudoku.js';
import { Sockets } from './sockets';

const QUEUE_MAX_SIZE = 3;
export class SudokuQueue{


    queue: Sudoku[];
    size: number;
    start: number;
    isHard: boolean;

    getSize(): number
    {
        return this.size;
    }

    constructor(isHard = false)
    {
        this.isHard = isHard;
        this.size = 0;
        this.start = 0;
        this.queue = [];
        for (let i = 0; i < QUEUE_MAX_SIZE; i++)
        {
            this.push(new Sudoku(null, this.isHard));
        }
    }

    push(sudo: Sudoku): void
    {
        if (this.size < QUEUE_MAX_SIZE)
        {
            this.queue[(this.start + this.size) % QUEUE_MAX_SIZE] = sudo;
            this.size++;
            Sockets.update();
            Sockets.emit("Sudoku " + (this.isHard ? "difficile" : "facile") + " généré");
        }
    }

    pop(): Sudoku
    {
        if (this.size > 0)
        {
            let result = this.queue[this.start];
            this.start = (this.start + 1) % QUEUE_MAX_SIZE;
            this.size--;
            setTimeout(() => {
                let newSudoku: Sudoku = new Sudoku(null, this.isHard);
                this.push(newSudoku);
            }, 5000);
            Sockets.update();
            return result;
        }
        return null;
    }
}
