import { GRID_TEMPLATE } from './gridTemplate';
import { Grid, BONUS } from './grid';
import { expect } from 'chai';
import { LetterDeck } from './letterDeck';

describe('Grid tests', () => {
    let myGrid: Grid;
    let deck: LetterDeck = new LetterDeck();
    deck.addLetter( { letter: 'M', value: 2} );
    deck.addLetter( { letter: 'O', value: 1} );
    deck.addLetter( { letter: 'T', value: 1} );

    it('can be initialized without an error', done => {
        myGrid = new Grid();
        expect(myGrid).to.exist;
        done();
    });
    it('can be initialized with the correct multipliers', done => {
        let mult = myGrid.getCoordCell(GRID_TEMPLATE[8].coord).multiplier;
        let expected = GRID_TEMPLATE[8].mult;
        expect(mult).to.equal(expected);
        done();
    });
    it('can recognize bad command arguments', done => {

                   myGrid.testWordPlacement("r1v", "AA")
          .then((result) => {
            expect(result).to.be.null;
            return myGrid.testWordPlacement("a1o", "AA");
        }).then((result) => {
            expect(result).to.be.null;
            return myGrid.testWordPlacement("a18v", "AA");
        }).then((result) => {
            expect(result).to.be.null;
            return myGrid.testWordPlacement("0", "AA");
        }).then((result) => {
            expect(result).to.be.null;
            return myGrid.testWordPlacement("a16v", "AA");
        }).then((result) => {
            expect(result).to.be.null;
            return myGrid.testWordPlacement("a0v", "AA");
        }).then((result) => {
            expect(result).to.be.null;
            return myGrid.testWordPlacement("p1v", "AA");
        }).then((result) => {
            expect(result).to.be.null;
            done();
        });
    });

    it('can recognize invalid moves', done => {
        myGrid.testWordPlacement("a1v", "MOT")
          .then((result) => {
            expect(result).to.be.null;
            done();
          });
    });
    it('ignores one-letter words', done => {
        myGrid.testWordPlacement("h8h", "M")
          .then((result) => {
            expect(result).to.be.null;
            done();
          });
    });
    it('can recognize a valid move at the center', done => {
        //
        //     M[O]T
        //
        myGrid.testWordPlacement("h7h", "MOT")
          .then((result) => {
            expect(result).to.not.be.null;
            done();
          });
    });
    it('can place words and grant the correct amount of points', done => {
        let score = myGrid.placeWord("h7h", "MOT", deck);
        expect(score).to.equal(8);
        done();
    });
    it('can recognize a valid move by letter overlap', done => {

        //
        //     M[O]T
        //     O
        //     T
        //
        myGrid.testWordPlacement("h7v", "MOT")
          .then((result) => {
            expect(result).to.not.be.null;
            deck.addLetter( { letter: 'M', value: 2} );
            deck.addLetter( { letter: 'O', value: 1} );
            deck.addLetter( { letter: 'T', value: 1} );

            myGrid.placeWord("h7v", "MOT", deck);
            done();
          });
    });
    it('can recognize a valid move by word prolongation', done => {
        //
        //     M[O]T
        //     O
        //     T
        //     S
        //
        myGrid.testWordPlacement("h7v", "MOTS")
          .then((result) => {
            expect(result).to.not.be.null;
            done();
          });
    });
    it('can recognize a valid move because of collateral words', done => {
        //
        //         E S T
        //     M[O]T
        //
        myGrid.testWordPlacement("g9h", "EST")
          .then((result) => {
            expect(result).to.not.be.null;
            done();
          });
    });

    it('can give 50 bonus points from the full placement of 7 letters', done => {
        deck = new LetterDeck();
        deck.addLetter( { letter: 'E', value: 1} );
        deck.addLetter( { letter: 'I', value: 1} );
        deck.addLetter( { letter: 'M', value: 2} );
        deck.addLetter( { letter: 'P', value: 3} );
        deck.addLetter( { letter: 'E', value: 1} );
        deck.addLetter( { letter: 'R', value: 1} );
        deck.addLetter( { letter: 'L', value: 1} );
        let score = myGrid.placeWord("g9h", "EMPILER", deck);
        expect(score).to.equal(BONUS + 12 + 3);
        done();
    });
    it('adds word bonuses multiplicatively', done => {
        //
        //               [R]
        //                R
        //                R
        //            R R R
        //            R
        //            R
        //           [R]
        // [B]A C[T]E R I[E]
        //
        myGrid = new Grid();
        deck = new LetterDeck();
        for (let i = 0; i < 6; i++)
        {
            deck.addLetter( { letter: 'R', value: 1} );
        }
        myGrid.placeWord("h8v", "RRRR", deck);
        myGrid.placeWord("k6h", "RRR", deck);
        for (let i = 0; i < 4; i++)
        {
            deck.addLetter( { letter: 'R', value: 1} );
        }
        myGrid.placeWord("k6v", "RRRRR", deck);
        deck.addLetter( { letter: 'B', value: 3} );
        deck.addLetter( { letter: 'A', value: 1} );
        deck.addLetter( { letter: 'C', value: 3} );
        deck.addLetter( { letter: 'T', value: 1} );
        deck.addLetter( { letter: 'E', value: 1} );
        deck.addLetter( { letter: 'I', value: 1} );
        deck.addLetter( { letter: 'E', value: 1} );
        let score = myGrid.placeWord('o1h', "BACTERIE", deck);
        expect(score).to.equal(BONUS + (13 * 9));
        done();
    });

    it('can use blanks in words', done => {
        //
        //       C * *[R]T E
        //         (Charte)
        //
        deck.addLetter( { letter: '*', value: 0} );
        deck.addLetter( { letter: '*', value: 0} );
        deck.addLetter( { letter: 'C', value: 3} );
        deck.addLetter( { letter: 'T', value: 1} );
        deck.addLetter( { letter: 'E', value: 1} );
        myGrid.testWordPlacement("h5h", "CHARTE")
          .then((result) => {
            expect(result).to.not.be.null;
            let score = myGrid.placeWord("h5h", "CHARTE", deck);
            expect(score).to.equal(6);
            done();
          });
    });
});
