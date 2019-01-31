import { expect } from 'chai';
import { Deck } from './deck';

describe('Deck tests', () => {
    let myDeck: Deck;
    it('should create component', (done) => {
        myDeck = new Deck();
        myDeck.setLetter(0, {letter: 'A', value: 1, id: 1, selected: false});
        myDeck.setLetter(1, {letter: 'B', value: 3, id: 2, selected: false});
        myDeck.setLetter(2, {letter: 'C', value: 3, id: 3, selected: false});
        myDeck.setLetter(3, {letter: 'D', value: 2, id: 4, selected: false});
        myDeck.setLetter(4, {letter: 'E', value: 1, id: 5, selected: false});
        myDeck.setLetter(5, {letter: 'F', value: 4, id: 6, selected: false});
        myDeck.setLetter(6, {letter: 'G', value: 2, id: 7, selected: false});
        expect(myDeck).to.not.be.undefined;
        done();
    });

    it('should set letters', (done) => {
        myDeck.setLetter(0, {letter: 'B', value: 3, id: 1, selected: false});
        myDeck.setLetter(1, {letter: 'A', value: 1, id: 2, selected: false});

        expect(myDeck.letters[0].letter).to.equal('B');
        expect(myDeck.letters[0].value).to.equal(3);
        expect(myDeck.letters[0].id).to.equal(1);

        expect(myDeck.letters[1].letter).to.equal('A');
        expect(myDeck.letters[1].value).to.equal(1);
        expect(myDeck.letters[1].id).to.equal(2);
        done();
    });

    it('should swap two letters', (done) => {
        let res = myDeck.swapLetters(0, 1);
        expect(res).to.be.true;

        expect(myDeck.letters[1].letter).to.equal('B');
        expect(myDeck.letters[1].value).to.equal(3);
        expect(myDeck.letters[1].id).to.equal(1);

        expect(myDeck.letters[0].letter).to.equal('A');
        expect(myDeck.letters[0].value).to.equal(1);
        expect(myDeck.letters[0].id).to.equal(2);
        done();
    });

    it('should return the index of the letter and color it', (done) => {
        let res = myDeck.findLetter('A');
        expect(res).to.equal(0);
        expect(myDeck.letters[0].selected).to.be.true;

        res = myDeck.findLetter('B');
        expect(res).to.equal(1);
        expect(myDeck.letters[1].selected).to.be.true;
        expect(myDeck.letters[0].selected).to.be.false;
        done();
    });
});
