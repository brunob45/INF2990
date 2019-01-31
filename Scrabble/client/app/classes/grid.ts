enum Multiplier {SINGLE, DOUBLE_LETTER, TRIPLE_LETTER, DOUBLE_WORD, TRIPLE_WORD}
enum Color {white, transparent, pink, lightblue, blue, green}

interface Cell
{
    char: string;
    value: number;
    multip: Multiplier;
    color: Color;
}

export class Grid
{
    static DIMENSIONS = {x: 15, y: 15};

    public data: Cell[][] = [];

    constructor()
    {
        for (let i = 0; i < Grid.DIMENSIONS.x; i++)
        {
            this.data[i] = [];
            for (let j = 0; j < Grid.DIMENSIONS.y; j++)
            {
                this.data[i].push({char: "", value: null, multip: Multiplier.SINGLE, color: Color.transparent});
            }
        }
    }

    public setGrid(data : any[][])
    {
        for (let i = 0; i < Grid.DIMENSIONS.x; i++)
        {
            this.data[i] = [];
            for (let j = 0; j < Grid.DIMENSIONS.y; j++)
            {
                if (data[j + 1][i + 1])
                {
                    this.data[i].push({char: data[j + 1][i + 1].letter, value: data[j + 1][i + 1].value,
                                       multip: Multiplier.SINGLE, color: Color.white});
                }
                else
                {
                    this.data[i].push({char: "", value: null, multip: Multiplier.SINGLE, color: Color.transparent});
                }
            }
        }
    }

    public get(i: number, j: number): Cell
    {
        return this.data[i][j];
    }

    public reset(): void
    {
        for (let i = 0; i < Grid.DIMENSIONS.x; i++)
        {
            for (let j = 0; j < Grid.DIMENSIONS.y; j++)
            {
                this.get(i, j).char = "";
            }
        }
    }
}
