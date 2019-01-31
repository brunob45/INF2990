interface Cell
{
    char: string;
}

export class Columns
{
    static DIMENSIONS = {x: 15, y: 1};

    public cells :
    {
        value : string
    } [] = [];

    constructor()
    {
        for (let i = 0; i < Columns.DIMENSIONS.x * Columns.DIMENSIONS.y; i++)
        {
            this.cells.push({"value": String(i + 1)});
        }
    }
}
