enum Letters {A, B, C, D, E, F, G, H, I, J, K, L, M, N, O}

interface Cell
{
    char: string;
}

export class Rows
{
    static DIMENSIONS = {x: 15, y: 1};

    public cells :
    {
        value : string
    } [] = [];

    constructor()
    {
        for (let i = 0; i < Rows.DIMENSIONS.x * Rows.DIMENSIONS.y; i++)
        {
            this.cells.push({"value": String(Letters[i])});
        }
    }
}
