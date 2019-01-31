
const NB_TRANSFORM = 1000000;
const REMAINING_NUMBERS_EASY = 45;
const REMAINING_NUMBERS_HARD = 35;
const DIMENSIONS = 9;
const SUM_OF_ALL_NUMBERS = 45;

export class Sudoku {

    grid: number[/*ROW NUMBER (Y)*/][/*COL NUMBER (X)*/];
    isHard: boolean;

    isValid(): boolean
    {
        return this.testCell_rec(0) === 1;
    }

    get(x: number, y: number): number
    {
        return this.grid[y][x]; //We apologize for the confusion
    }

    getColumn(x: number): number[]
    {
        let columnX: number[] = [];
        for (let i = 0; i < DIMENSIONS; i++)
         {
             columnX[i] = this.grid[i][x];
         }
         return columnX;
    }
    getRow(y: number): number[]
    {
        let columnY: number[] = [];
        for (let i = 0; i < DIMENSIONS; i++)
         {
             columnY[i] = this.grid[y][i];
         }
         return columnY;
    }

    getSquare(x: number): number[]
    {
        let square: number[] = [];
        let a = Math.floor(x / Math.sqrt( DIMENSIONS ) ) * Math.sqrt( DIMENSIONS );
        let b = ( x % Math.sqrt( DIMENSIONS ) ) * Math.sqrt( DIMENSIONS );

        for (let j = 0; j < Math.sqrt( DIMENSIONS ); j++)
        {
            for (let i = 0; i < Math.sqrt( DIMENSIONS ); i++)
            {
                square[i + j * Math.sqrt( DIMENSIONS ) ] = this.get(i + b, j + a);
            }
        }

        return square;
    }

    toString(): string
    {
        let res = "";
        for (let i = 0; i < DIMENSIONS; i++)
        {
            for (let j = 0; j < DIMENSIONS; j++)
            {
                if (this.get(i, j))
                {
                    res += String( this.get(i, j) );
                }
                else
                {
                    res += "0";
                }
            }
        }
        return res;
    }

    constructor(str: string = null, hard = false)
    {
        this.isHard = hard;
        if (str)
        {
            this.grid = [];
            for (let i = 0; i < DIMENSIONS; i++)
            {
                this.grid[i] = [];
            }
            for (let i = 0; i < str.length; i++)
            {
                this.grid[i % DIMENSIONS ][ Math.floor( i / DIMENSIONS )] = Number( str[i] );
            }
        }
        else
        {
            this.generateInitialSolution();
            this.mixGrid();
            if (!this.completeTest())
            {
                console.log( "ERROR: The sudoku is invalid." );
            }
            this.stripGrid();
        }
    }

    clone(): Sudoku
    {
        return new Sudoku( this.toString() );
    }

    generateInitialSolution(): void
    {
        this.grid = [[1, 2, 3, 4, 5, 6, 7, 8, 9],
                     [4, 5, 6, 7, 8, 9, 1, 2, 3],
                     [7, 8, 9, 1, 2, 3, 4, 5, 6],

                     [2, 3, 4, 5, 6, 7, 8, 9, 1],
                     [5, 6, 7, 8, 9, 1, 2, 3, 4],
                     [8, 9, 1, 2, 3, 4, 5, 6, 7],

                     [3, 4, 5, 6, 7, 8, 9, 1, 2],
                     [6, 7, 8, 9, 1, 2, 3, 4, 5],
                     [9, 1, 2, 3, 4, 5, 6, 7, 8]];
     }

     mixGrid(): void
     {
        for (let i = 0; i < NB_TRANSFORM; i++)
        {
            switch (Math.floor( Math.random() * 7 ))
            {
                case 0:
                    this.switchLines((a: number, b: number) => this.switchColumns(a, b));
                    break;
                case 1:
                    this.switchLines((a: number, b: number) => this.switchRows(a, b));
                    break;
                case 2:
                    this.flipXAxis();
                    break;
                case 3:
                    this.flipYAxis();
                    break;
                case 4:
                    this.flipDiagonalQ2Q4();
                    break;
                case 5:
                    this.flipDiagonalQ1Q3();
                    break;
                case 6:
                    let num1: number = Math.floor( Math.random() * DIMENSIONS ) + 1;
                    let num2: number;
                    do
                    {
                        num2 = Math.floor( Math.random() * DIMENSIONS) + 1;
                    } while (num1 === num2);
                    this.swapAllNumbers(num1, num2);
                    break;
            }

        }
     }

     stripGrid(): void
     {
         let newGrid: Sudoku;
         do
         {
            newGrid = this.clone();
            let nbNumbersToDelete: number;
            nbNumbersToDelete = DIMENSIONS * DIMENSIONS -
                                (this.isHard ? REMAINING_NUMBERS_HARD : REMAINING_NUMBERS_EASY);

            for (let i = 0; i < nbNumbersToDelete; i++)
            {
                let x: number;
                let y: number;
                do{
                    x = Math.floor( Math.random() * DIMENSIONS );
                    y = Math.floor( Math.random() * DIMENSIONS );
                }
                while ( newGrid.get(x, y) === 0 );
                newGrid.grid[y][x] = 0;
            }
         }
         while (!newGrid.isValid());
         this.grid = newGrid.grid;
     }

     switchLines(transformation: (a: number, b: number) => void): void
     {
         let section: number = Math.floor( Math.random() * Math.sqrt( DIMENSIONS ) );
         let offset1: number = Math.floor( Math.random() * Math.sqrt( DIMENSIONS ) );
         let offset2: number = ( offset1 + 1 ) % Math.sqrt( DIMENSIONS );
         transformation( section * Math.sqrt( DIMENSIONS ) + offset1,
                         section * Math.sqrt( DIMENSIONS ) + offset2);
     }

     switchColumns(a: number, b: number): void
     {
         let temp: number;
         for (let i = 0; i < DIMENSIONS; i++)
         {
             temp = this.grid[i][a];
             this.grid[i][a] = this.grid[i][b];
             this.grid[i][b] = temp;
         }
     }

     switchRows(a: number, b: number): void
     {
         let temp: number;
         for (let i = 0; i < DIMENSIONS; i++)
         {
             temp = this.grid[a][i];
             this.grid[a][i] = this.grid[b][i];
             this.grid[b][i] = temp;
         }
     }

    flipXAxis(): void
    {
        for (let i = 0; i < DIMENSIONS / 2; i++)
        {
            this.switchRows(i, DIMENSIONS - 1 - i);
        }
    }

    flipYAxis(): void
    {
        for (let i = 0; i < DIMENSIONS / 2; i++)
        {
            this.switchColumns(i, DIMENSIONS - 1 - i);
        }
    }

    flipDiagonalQ2Q4(): void
    {
        let temp: number;
        for (let i = 0; i < DIMENSIONS - 1; i++)
        {
            for (let j = i + 1 ; j < DIMENSIONS; j++)
            {
                temp = this.grid[j][i];
                this.grid[j][i] = this.grid[i][j];
                this.grid[i][j] = temp;
            }
        }
    }

    flipDiagonalQ1Q3(): void
    {
        let temp: number;
        for (let i = 0; i < DIMENSIONS - 1; i++)
        {
            for (let j = 0; j < DIMENSIONS - 1 - i; j++)
            {
                temp = this.grid[i][j];
                this.grid[i][j] = this.grid[DIMENSIONS - 1 - j][DIMENSIONS - 1 - i];
                this.grid[DIMENSIONS - 1 - j][DIMENSIONS - 1 - i] = temp;
            }
        }
    }

    swapAllNumbers(a: number, b: number): void
    {
        for (let i = 0; i < DIMENSIONS; i++)
        {
            for (let j = 0; j < DIMENSIONS; j++)
            {
                let num: number = this.grid[i][j];
                switch (num)
                {
                    case a:
                        this.grid[i][j] = b;
                        break;
                    case b:
                        this.grid[i][j] = a;
                        break;
                }
            }
        }
    }

    quickTest(n: number, x: number, y: number): boolean
    {
        /* 1. check if there's no duplicate in the column.
         * 2. check if there's no duplicate in the row.
         * 3. check if there's no duplicate in the square.
         */

        for (let i = 0; i < DIMENSIONS; i++)
        {
            if (i === x)
            {
                continue;
            }
            if (this.get(i, y) === n)
            {
                return false;
            }
        }

        for (let j = 0; j < DIMENSIONS; j++)
        {
            if (j === y)
            {
                continue;
            }
            if (this.get(x, j) === n)
            {
                return false;
            }
        }

        for (let k = Math.floor( x / Math.sqrt( DIMENSIONS ) ) * Math.sqrt( DIMENSIONS );
                 k < Math.floor( x / Math.sqrt( DIMENSIONS ) ) * Math.sqrt( DIMENSIONS ) + Math.sqrt( DIMENSIONS );
                 k++)
        {
            for (let l = Math.floor( y / Math.sqrt( DIMENSIONS ) ) * Math.sqrt( DIMENSIONS );
                     l < Math.floor( y / Math.sqrt( DIMENSIONS ) ) * Math.sqrt( DIMENSIONS ) + Math.sqrt( DIMENSIONS );
                     l++)
        {
                let temp = this.get(k, l);
                if (x === k && y === l)
                {
                    continue;
                }
                if (temp === n)
                {
                    return false;
                }
            }
        }
        return true;
    }

    completeTest(): boolean
    {
        /* algorithm for final test
         * 1. add each number of each column. It should be 45.
         * 2. add each number of each row. Also 45.
         * 3. add each number of each square. 45.
         * 4. check if there's no duplicate in each column.
         * 5. check if there's no duplicate in each row.
         * 6. check if there's no duplicate in each square.
         */

        for (let i = 0; i < DIMENSIONS; i++)
        {
            let sum = 0;
            for (let j = 0; j < DIMENSIONS; j++)
            {
                sum += this.getColumn(i)[j];
            }
            if (sum !== SUM_OF_ALL_NUMBERS)
            {
                return false;
            }
        }

        for (let i = 0; i < DIMENSIONS; i++)
        {
            let sum = 0;
            for (let j = 0; j < DIMENSIONS; j++)
            {
                sum = sum + this.getRow(i)[j];
            }

            if (sum !== SUM_OF_ALL_NUMBERS)
            {
                return false;
            }
        }

        for (let i = 0; i < DIMENSIONS; i++)
        {
            let sum = 0;
            let square: number[] = this.getSquare(i);
            for (let j = 0; j < DIMENSIONS; j++)
            {
                sum += square[j];
            }

            if (sum !== SUM_OF_ALL_NUMBERS)
            {
                return false;
            }
        }

        for (let i = 0; i < DIMENSIONS; i++)
        {
            for (let j = 0; j < DIMENSIONS; j++)
            {
                if (!this.quickTest(this.get(i, j), i, j))
                {
                    return false;
                }
            }
        }
        /**/
        return true;
    }

    testCell_rec(x: number): number
    {
        if (x >= DIMENSIONS * DIMENSIONS) // A solution was found.
        {
            return 1;
        }

        if (this.get(( x % DIMENSIONS), Math.floor( x / DIMENSIONS )) !== 0) // If square is not empty, don't test it.
        {
            return this.testCell_rec( x + 1 );
        }

        // Otherwise, test every possibility.
        let ret = 0;
        for (let i = 1; i <= DIMENSIONS; i++)
        {
            // If a number is valid, test the next cell.
            if (this.quickTest( i, ( x % DIMENSIONS ), Math.floor( x / DIMENSIONS )))
            {
                let stemp = this.clone();
                stemp.grid[Math.floor( x / DIMENSIONS )][( x % DIMENSIONS )] = i;
                ret += stemp.testCell_rec( x + 1 );
                if (ret > 1)
                {
                    break;
                }
            }
        }
        // return the sum of all possible solutions.
        return ret;
    }
}
