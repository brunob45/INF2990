import { Database } from "./database";

export interface Letter
{
    letter: string;
    value: number;
}

export class LetterPouch
{
    letters: Letter[] = [];

    static CreateNewLetterPouch(): Promise<LetterPouch>
    {
        return new Promise((resolve, reject) => {
            let pouch = new LetterPouch();
            Database.getLetters()
            .then((list) =>
            {
                pouch.letters = list;
                resolve(pouch);
            });
        });
    }

    pick(): Letter
    {
        if (this.isEmpty())
        {
            return null;
        }

        let index = Math.floor(Math.random() * this.letters.length);
        let letter = this.letters.splice(index, 1);
        return letter[0];
    }

    addLetter(letter: Letter): void
    {
        this.letters.push(letter);
    }

    isEmpty(): boolean
    {
        return this.letters.length === 0;
    }
}
