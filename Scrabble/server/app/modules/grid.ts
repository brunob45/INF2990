import { Multiplier, Coord, GRID_TEMPLATE, CENTER_TILE } from './gridTemplate';
import { Letter } from './letterPouch';
import { LetterDeck } from './letterDeck';
import { Database } from './database';

enum Alignment { Horizontal = 1, Vertical }

export const placeErrors = {
    invalidArg : "Invalid Placement Parameter (Row-Column-Vertical/Horizontal)",
    invalidRow : "Invalid Coordinates (A-O)",
    invalidCol : "Invalid Coordinates (1-15)",
    invalidAlign : "Invalid Alignment Specifier (H/V)"
};

const GRID_SIZE = 15;
const stringToCoord =
{
    'A' : 1,
    'B' : 2,
    'C' : 3,
    'D' : 4,
    'E' : 5,
    'F' : 6,
    'G' : 7,
    'H' : 8,
    'I' : 9,
    'J' : 10,
    'K' : 11,
    'L' : 12,
    'M' : 13,
    'N' : 14,
    'O' : 15
};
const ALIGN =
{
    'V' : Alignment.Vertical,
    'H' : Alignment.Horizontal
};
const multipliersValues =
{
    [Multiplier.SINGLE]: { l: 1, w: 1},
    [Multiplier.DOUBLE_WORD]: { l: 1, w: 2},
    [Multiplier.DOUBLE_LETTER]: { l: 2, w: 1},
    [Multiplier.TRIPLE_WORD]: { l: 1, w: 3},
    [Multiplier.TRIPLE_LETTER]: { l: 3, w: 1}
};
export const BONUS = 50;

export interface GridCell
{
    letter : Letter;
    multiplier : Multiplier;
}
export interface PlaceArgs
{
    x : number;
    y : number;
    align : Alignment;
}

export class Grid
{

    private _cells : GridCell[];

    constructor()
    {
        this.initCells();
    }
    private initCells()
    {
        this._cells = [];
        for (let x = 1; x <= GRID_SIZE; x++)
        {
            for (let y = 1; y <= GRID_SIZE; y++)
            {
                this._cells[ y * GRID_SIZE + x ] = {letter : null, multiplier : Multiplier.SINGLE };
            }
        }
        for (let cell of GRID_TEMPLATE)
        {
            this.getCoordCell(cell.coord).multiplier = cell.mult;
        }
    }

    public getCoordCell(coord : Coord) : GridCell
    {
        return this.getNumCell(coord.x, coord.y);
    }
    public getNumCell(x : number, y : number) : GridCell
    {
        if (y && x)
        {
            return this._cells[ y * GRID_SIZE + x ];
        }
        else
        {
            return null;
        }
    }
    public getCell(x : number, y : string) : GridCell
    {
        return this.getNumCell(x, stringToCoord[y]);
    }

    setCellLetter(x: number, y : number, letter : Letter)
    {
        this.getNumCell(x, y).letter = letter;
    }

    getArguments(coordArg : string) : PlaceArgs
    {
            let coord : string[] = coordArg.match(/[a-zA-Z]+|[0-9]+/g);
            if (coord.length === 3)
            {
                let y = stringToCoord[coord[0].toUpperCase()];
                let x = Number(coord[1]); // Typescript, if you may
                let align = ALIGN[coord[2].toUpperCase()];
                return { x, y, align };
            }
            else
            {
                return null;
            }
    }

    testArguments( args : PlaceArgs ) : boolean
    {
        if (!args)
        {
            return false;
        }
        else if ( args.x < 1 || args.x > 15)
        {
            return false;
        }
        else if ( args.y < 1 || args.y > 15)
        {
            return false;
        }
        else if (!args.align)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    //Sample command:    /placer a15v mot
    // /placer (y)(x)(horizontal/vertical) (word)
    public testWordPlacement(coordArg : string, letters : string)
    : Promise<string>
    {
        return new Promise<string>(
        (resolve, reject) =>
        {
            let args = this.getArguments(coordArg);
            if (!this.testArguments(args))
            {
                resolve(null);
            }

            let wordsFound = this.testWordsFromPlacement(args, letters);
            if (!wordsFound.valid)
            {
                resolve(null);
            }
            Database.multipleWordsExist(wordsFound.words).then((exists) =>
            {
                if (exists)
                {
                    resolve(wordsFound.lettersUsed);
                }
                else
                {
                    resolve(null);
                }
            });
        });
    }
    testWordsFromPlacement(args : PlaceArgs, letters : string)
    : { words : string[], lettersUsed : string, valid : boolean }
    {
        let usedLetters = "";
        let validPlacement = false;
        //VALID: must involve at least one letter previously played on the grid
        //EXCEPTION: first move; a letter must be placed at the center

        let words: string[] = [];
        let mainWord = "";
        for (let x = args.x, y = args.y; x <= GRID_SIZE && y <= GRID_SIZE;
             args.align === Alignment.Horizontal ? x++ : y++)
        {
            let wordIndex = args.align === Alignment.Horizontal ? x - args.x : y - args.y;
            if (this.getNumCell(x, y).letter)
            {
                mainWord += (this.getNumCell(x, y).letter.letter);
                validPlacement = true; //Word involved previously placed letter
            }
            else if (wordIndex < letters.length)
            {
                let currentLetter = letters.charAt(wordIndex);
                //No letters yet, but is one of those we try to place
                mainWord += (currentLetter);
                usedLetters += (currentLetter);
                //Added letter could create side words & more points
                let align = args.align;
                let collateral = this.testWordFromCollateral({ x, y, align }, letters.charAt(wordIndex));
                if (collateral)
                {
                    words.push(collateral);
                    validPlacement = true; //Collateral word created from previous letters
                }
                if (x === CENTER_TILE.x && y === CENTER_TILE.y )
                {
                    validPlacement = true; //Letter on center square
                }
            }
            else
            {
                //No letters, none to place. we're done here.
                break;
            }
        }
        words.push(mainWord);
        return { words : words, lettersUsed : usedLetters, valid : validPlacement };
    }
    testWordFromCollateral(args : PlaceArgs, letter : string) : string
    {
        let word = "";
        //Backtrack
        let x = args.x, y = args.y;
        let sideAlign = args.align === Alignment.Horizontal ? Alignment.Vertical : Alignment.Horizontal;
        do
        {
            sideAlign === Alignment.Horizontal ? x-- : y--;
        }
        while (this.getNumCell(x, y) && this.getNumCell(x, y).letter);
        sideAlign === Alignment.Horizontal ? x++ : y++;
        for (; x <= GRID_SIZE && y <= GRID_SIZE; sideAlign === Alignment.Horizontal ? x++ : y++)
        {
            if (this.getNumCell(x, y).letter)
            {
                word += this.getNumCell(x, y).letter.letter;
            }
            else if (x === args.x && y === args.y)
            {
                //No letter here yet, is the one we want to add
                word += letter;
            }
            else
            {
                //Nothing left.
                break;
            }
        }

        if (word.length > 1)
        {
            return word;
        }
        else
        {
            return null;
        }
    }

    public placeWord(coordArg : string, letters : string, deck : LetterDeck) : number
    {
        let args = this.getArguments(coordArg);
        letters = letters.toUpperCase();
        if (this.testArguments(args))
        {
            return this.place(args, letters, deck);
        }
        return null;
    }
    place(args : PlaceArgs, letters : string, deck: LetterDeck) : number
    {
        let totalScore = 0;
        let mainScore = 0;
        let mainMult = 1;

        let wasFull = deck.isFull(); //Can get bonus points if emptied, but only if it starts full

        for (let x = args.x, y = args.y; x <= GRID_SIZE && y <= GRID_SIZE;
             args.align === Alignment.Horizontal ? x++ : y++)
        {
            let wordIndex = args.align === Alignment.Horizontal ? x - args.x : y - args.y;
            if (this.getNumCell(x, y).letter)
            {
                //Already placed letters cannot get multipliers.
                mainScore += this.getNumCell(x, y).letter.value;
            }
            else if (wordIndex < letters.length)
            {
                let currentLetter = letters.charAt(wordIndex);
                let letter = deck.removeLetter(currentLetter);
                this.setCellLetter(x, y, letter);

                let currentMult = multipliersValues[this.getNumCell(x, y).multiplier];
                mainScore += letter.value * currentMult.l;
                mainMult *= currentMult.w;

                //Added letter could create side words & more points
                let align = args.align;
                totalScore += this.placeCollateral({ x, y, align });
            }
            else
            {
                //No letters, none to place. we're done here.
                break;
            }
        }
        totalScore += mainScore * mainMult;
        if (wasFull && deck.isEmpty())
        {
            totalScore += BONUS;
        }
        return totalScore;
    }

    placeCollateral(args : PlaceArgs) : number
    {
        let score = 0;
        let wordLength = 1;
        //Only the new letter needs multipliers.
        let currentMult = multipliersValues[this.getNumCell(args.x, args.y).multiplier];
        //Backtrack
        let x = args.x, y = args.y;
        let sideAlign = args.align === Alignment.Horizontal ? Alignment.Vertical : Alignment.Horizontal;
        do
        {
            sideAlign === Alignment.Horizontal ? x-- : y--;
        }
        while (this.getNumCell(x, y) && this.getNumCell(x, y).letter);
        sideAlign === Alignment.Horizontal ? x++ : y++;
        for (; x <= GRID_SIZE && y <= GRID_SIZE; sideAlign === Alignment.Horizontal ? x++ : y++)
        {
            if (x === args.x && y === args.y)
            {
                score += this.getNumCell(x, y).letter.value * currentMult.l;
            }
            else
            {
                if (this.getNumCell(x, y).letter)
                {
                    score += this.getNumCell(x, y).letter.value;
                    wordLength++;
                }
                else
                {
                    //Nothing left.
                    break;
                }
            }
        }

        if (wordLength > 1)
        {
            return score * currentMult.w;
        }
        else
        {
            return 0;
        }
    }

    public toLetterArray() : Letter[][]
    {
        let cells: Letter[][] = [];
        for (let i = 1; i <= GRID_SIZE; i++)
        {
            cells[i] = [];
            for (let j = 1; j <= GRID_SIZE; j++)
            {
                cells[i][j] = this.getNumCell(i, j).letter;
            }
        }
        return cells;
    }
}
