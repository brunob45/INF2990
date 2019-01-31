
import { expect} from 'chai';
import { Sudoku } from './sudoku.js';

describe('Shuffle Test:', () => {
    it('can switch two columns with each other', done => {
        let mySudoku = new Sudoku();
        mySudoku.generateInitialSolution();
        let column1: number[] = mySudoku.getColumn(1);
        let column2: number[] = mySudoku.getColumn(2);

        mySudoku.switchColumns(1, 2);

        let newColumn1: number[] = mySudoku.getColumn(2);
        let newColumn2: number[] = mySudoku.getColumn(1);

        let result = true;
        for (let i = 0; i < 9 && result; i++)
        {
            result = column1[i] === newColumn1[i]
                  && column2[i] === newColumn2[i];
        }

        expect(result).to.be.true;
        done();
    });
    it('can switch two rows with each other', done => {
        let mySudoku = new Sudoku();
        mySudoku.generateInitialSolution();
        let row1: number[] = mySudoku.getRow(1);
        let row2: number[] = mySudoku.getRow(2);

        mySudoku.switchRows(1, 2);

        let newRow1: number[] = mySudoku.getRow(2);
        let newRow2: number[] = mySudoku.getRow(1);

        let result = true;
        for (let i = 0; i < 9 && result; i++)
        {
            result = row1[i] === newRow1[i]
                  && row2[i] === newRow2[i];
        }

        expect(result).to.be.true;
        done();
    });

    it('can flip the grid along the horizontal X axis', done => {

        let mySudoku = new Sudoku();
        mySudoku.generateInitialSolution();
        let referenceSudoku = mySudoku.clone();

        mySudoku.flipXAxis();
        let result = true;
        for (let x = 0; x < 9 && result; x++)
        {
            for (let y = 0; y < 9 && result; y++)
            {
                result = mySudoku.get(x, y) === referenceSudoku.get(x, 8 - y);
            }
        }
        expect(result).to.be.true;
        done();
    });
    it('can flip the grid along the vertical Y axis', done => {

        let mySudoku = new Sudoku();
        mySudoku.generateInitialSolution();
        let referenceSudoku = mySudoku.clone();

        mySudoku.flipYAxis();
        let result = true;
        for (let x = 0; x < 9 && result; x++)
        {
            for (let y = 0; y < 9 && result; y++)
            {
                result = mySudoku.get(x, y) === referenceSudoku.get(8 - x, y);
            }
        }
        expect(result).to.be.true;
        done();
    });
    it('can flip the grid diagonally from the axis passing through Q2 and Q4 quadrant', done => {

        let mySudoku = new Sudoku();
        mySudoku.generateInitialSolution();
        let referenceSudoku = mySudoku.clone();

        mySudoku.flipDiagonalQ2Q4();

        let result = true;
        for (let x = 0; x < 9 && result; x++)
        {
            for (let y = 0; y < 9 && result; y++)
            {
                result = mySudoku.get(x, y) === referenceSudoku.get(y, x);
            }
        }
        expect(result).to.be.true;
        done();
    });

    it('can flip the grid diagonally from the axis passing through Q1 and Q3 quadrant', done => {

        let mySudoku = new Sudoku();
        mySudoku.generateInitialSolution();
        let referenceSudoku = mySudoku.clone();

        mySudoku.flipDiagonalQ1Q3();

        let result = true;
        for (let x = 0; x < 9 && result; x++)
        {
            for (let y = 0; y < 9 && result; y++)
            {
                result = mySudoku.get(x, y) === referenceSudoku.get(8 - y, 8 - x);
            }
        }
        expect(result).to.be.true;
        done();
    });

    it('can swap all instances of a two different numbers', done => {

        let mySudoku = new Sudoku();
        mySudoku.generateInitialSolution();
        let referenceSudoku = mySudoku.clone();

        mySudoku.swapAllNumbers(2, 7);

        let result = true;
        for (let x = 0; x < 9 && result; x++)
        {
            for (let y = 0; y < 9 && result; y++)
            {
                let num = referenceSudoku.get(x, y);
                let expected: number;
                switch (num)
                {
                    case 2:
                        num = 7;
                        break;
                    case 7:
                        num = 2;
                        break;
                }
                expected = mySudoku.get(x, y);
                result = num === expected;
            }
        }
        expect(result).to.be.true;
        done();
    });

    it('can strip away the right amount of numbers for an easy grid', done => {

        let mySudoku = new Sudoku();
        let nbRemainingNumbers = 0;
        for (let i = 0; i < 9; i++)
        {
            for (let j = 0; j < 9; j++)
            {
                if (mySudoku.get(i, j) !== 0)
                {
                    nbRemainingNumbers++;
                }
            }
        }
        expect(nbRemainingNumbers).to.be.equal(45);
        done();
    });
});

describe('Check Test:', () => {
    it('can perfom a quick test', done => {
        let mySudoku = new Sudoku();
        mySudoku.generateInitialSolution();
        let temp: number;
        let result: boolean;

        for (let i = 0; i < 9; i++)
        {
            for (let j = 0; j < 9; j++)
            {
                temp = mySudoku.get(i, j);
                result = mySudoku.quickTest(temp, i, j);
                expect(result).to.be.true;

                result = mySudoku.quickTest((temp + 1) % 9 + 1, i, j);
                expect(result).to.be.false;
            }
        }
        done();
    });

    it('can perfom a complete test', done => {
        let mySudoku = new Sudoku();
        mySudoku.generateInitialSolution();
        let result: boolean;

        result = mySudoku.completeTest();
        expect(result).to.be.true;

        mySudoku.grid[0][0] = 2;

        result = mySudoku.completeTest();
        expect(result).to.be.false;

        done();
    });
});

describe('Uniqueness solution', () => {
    it('can count 1 solution', done => {

        let mySudoku = new Sudoku();
        mySudoku.generateInitialSolution();
        mySudoku.grid[0][1] = null;

        let result = mySudoku.isValid();

        expect(result).to.be.true;

        done();
    });
});
