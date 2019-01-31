enum Alphabet {A, B, C, D, E, F, G}
const MAX_SIZE = 7;
let letterPosition = MAX_SIZE - 1;
let id = MAX_SIZE - 1;

export interface Letter
{
    letter: string;
    value: number;
    id: number;
    selected : boolean;
}

export class Deck
{
    public letters: Letter[] = [];

    public get MAX_SIZE() { return MAX_SIZE; }


    public setLetter(index: number, newLetter: Letter): Letter
    {
        let temp = this.letters[index];
        this.letters[index] = newLetter;
        return temp;
    }

    public swapLetters(a: number, b: number): boolean
    {
        if (a < 0 || a >= this.MAX_SIZE || b < 0 || b >= this.MAX_SIZE)
        {
            return false;
        }

        let temp = this.letters[a];
        this.letters[a] = this.letters[b];
        this.letters[b] = temp;

        return true;
    }

    private clearSeletected() : void
    {
        for (let i = 0; i < MAX_SIZE; i++)
        {
            this.letters[i].selected = false;
        }
    }

    public findLetter (letter : string) : number
    {
        letter = letter.toUpperCase();
        this.clearSeletected();
        let offset = (letter === this.letters[letterPosition].letter) ? (letterPosition + 1) : 0;

        for (let i = 0 + offset; i < this.MAX_SIZE + offset; i++)
        {
            let j = i % this.MAX_SIZE;
            if (this.letters[j].letter === letter)
            {
                id = this.letters[j].id;
                this.letters[j].selected = true;
                letterPosition = j;
                break;
            }
        }

        return letterPosition;
    }
}
