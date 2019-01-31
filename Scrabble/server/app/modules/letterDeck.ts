import { Letter } from './letterPouch';

export const MAX_LETTERS_DECK = 7;
export const BLANK = '*';

export class LetterDeck
{
    private _deck: Letter[];
    constructor(letters?: Letter[])
    {
        this._deck = letters || [];
    }

    get deck(): Letter[]
    {
        return this._deck;
    }

    addLetter(letter: Letter): boolean
    {
        if (this.isFull())
        {
            return false;
        }
        this.deck.push(letter);
        return true;
    }

    removeLetter(letter: string): Letter
    {
        for (let i = 0; i < this.deck.length; i++)
        {
            if (this.deck[i].letter === letter)
            {
                return this.deck.splice(i, 1)[0];
            }
        }

        for (let i = 0; i < this.deck.length; i++)
        {
            if (this.deck[i].letter === BLANK)
            {
                this.deck[i].letter = letter;
                return this.deck.splice(i, 1)[0];
            }
        }

        return null;
    }

    isFull(): boolean
    {
        return this.deck.length >= MAX_LETTERS_DECK;
    }

    isEmpty(): boolean
    {
        return this.deck.length <= 0;
    }

    contains(letters: string): boolean
    {
        let letterArray = letters.toUpperCase().split('');

        for (let l of this.deck)
        {
            let index = letterArray.findIndex((a: string) => l.letter === a);
            if (index > -1)
            {
                letterArray.splice(index, 1);
            }
        }

        for (let l of this.deck)
        {
            if (l.letter === BLANK)
            {
                letterArray.splice(0, 1);
            }
        }
        return letterArray.length === 0;
    }
}
