export class Grid
{
    static COLOR_INPUT = "green";
    static COLOR_VALID = "black";
    static COLOR_ERROR = "red";
    static DIMENSION = 9;

    public cells :
    {
        value : string,
        id : string,
        color : string,
        disabled : boolean
    } [] = [];

    static parseId(id: string): {x: number, y: number}
    {
        return {"x": Number(id[0]), "y": Number(id[1])};
    }

    constructor()
    {
        for (let i = 0; i < Grid.DIMENSION; i++)
        {
            for (let j = 0; j < Grid.DIMENSION; j++)
            {
                this.cells.push(
                    {
                        "value": "",
                        "id": String(j) + String(i),
                        "color": "black",
                        "disabled": true
                    } );
            }
        }
    }

    public get(i: number, j: number): {value: string, id: string, color: string, disabled: boolean}
    {
        return this.cells[i + Grid.DIMENSION * j];
    }

    public setValue(v: string, x: number, y: number): void
    {
        this.get(x, y).value = v;
        this.testCell(x, y);
    }

    public clearValue(x: number, y: number): void
    {
        this.get(x, y).value = "";
        this.testGrid();
    }

    private isCellEmpty(i: number, j: number)
    {
        return this.get(i, j).value === "";
    }


    public reset(): void
    {
        for (let i = 0; i < 9; i++)
        {
            for (let j = 0; j < 9; j++)
            {
                if (!this.get(i, j).disabled)
                {
                    this.get(i, j).value = "";
                }
                this.get(i, j).color = Grid.COLOR_VALID;
            }
        }
    }

    private verifyColor(x: number, y: number)
    {
        if (this.get(x, y).disabled)
        {
            this.get(x, y).color = Grid.COLOR_VALID;
        }
        else
        {
            this.get(x, y).color = Grid.COLOR_INPUT;
        }
    }

    public fill(stringImp: string): void
    {
        this.clean();

        for (let i = 0; i < 9; i++)
        {
            for (let j = 0; j < 9; j++)
            {
                if (stringImp[i + j * Grid.DIMENSION] <= '0'
                    || stringImp[i + j * Grid.DIMENSION] > '9'
                    || stringImp[i + j * Grid.DIMENSION] === undefined)
                {
                    this.get(i, j).value = "";
                    this.get(i, j).disabled = false;
                    this.get(i, j).color = Grid.COLOR_INPUT;
                }
                else
                {
                    this.get(i, j).value = stringImp[i + j * Grid.DIMENSION];
                    this.get(i, j).disabled = true;
                    this.get(i, j).color = Grid.COLOR_VALID;
                }
            }
        }
    }

    private clean()
    {
        for (let i = 0; i < 9; i++)
        {
            for (let j = 0; j < 9; j++)
            {
                this.get(i, j).disabled = false;
                this.get(i, j).value = "";
            }
        }
    }

    private testGrid() : boolean
    {
        for (let i = 0; i < Grid.DIMENSION; i++)
        {
            for (let j = 0; j < Grid.DIMENSION; j++)
            {
                this.verifyColor(i, j);
            }
        }

        for (let k = 0; k < Grid.DIMENSION; k++)
        {
            for (let l = 0; l < Grid.DIMENSION; l++) //for each cell
            {
                if (!this.isCellEmpty(l, k))
                {
                    this.testCell(k, l);
                }
            }
        }

        return true;
    }

    private testCell(x: number, y: number): boolean
    {
        let val = this.get(x, y).value;
        let conflict = false;

        // test row
        for (let i = 0; i < Grid.DIMENSION; i++)
        {
            if (i === x)
            {
                continue;
            }
            if (this.get(i, y).value === val)
            {
                this.get(i, y).color = Grid.COLOR_ERROR;
                conflict = true;
            }
        }

        // test column
        for (let j = 0; j < Grid.DIMENSION; j++)
        {
            if (j === y)
            {
                continue;
            }
            if (this.get(x, j).value === val)
            {
                this.get(x, j).color = Grid.COLOR_ERROR;
                conflict = true;
            }
        }

        if (conflict)
        {
            this.get(x, y).color = Grid.COLOR_ERROR;
        }
        else
        {
            this.verifyColor(x, y);
        }
        return true;
    }

    public toString(): string
    {
        let ret = "";
        for (let i = 0; i < Grid.DIMENSION; i++)
        {
            for (let j = 0; j < Grid.DIMENSION; j++)
            {
                if (this.isCellEmpty(i, j))
                {
                    ret += "0";
                }
                else
                {
                    ret += this.get(i, j).value;
                }
            }
        }
        return ret;
    }

    public isComplete(): boolean
    {
        for (let i = 0; i < Grid.DIMENSION; i++)
        {
            for (let j = 0; j < Grid.DIMENSION; j++)
            {
                if (this.isCellEmpty(i, j))
                {
                    return false;
                }
            }
        }
        return true;
    }
}
