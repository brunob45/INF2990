import { expect } from 'chai';
import { Sudoku } from './sudoku.js';
import { SudokuQueue } from './sudokuQueue.js';


describe('Sudoku queue tests', () => {
    it('can be instanced without an error', function(done) {
        this.timeout(10000);
        let myQueue = new SudokuQueue();
        expect(myQueue).to.not.be.undefined;
        done();
    });

    it('can pop a Sudoku', function(done) {
        this.timeout(10000);
        let myQueue = new SudokuQueue();
        expect(myQueue.pop()).to.not.be.undefined;
        done();
    });

    it('cannot push more than 3 sudoku', function(done) {
        this.timeout(10000);
        let myQueue = new SudokuQueue();
        myQueue.push(new Sudoku());
        expect(myQueue.getSize()).to.equal(3);
        done();
    });
});
