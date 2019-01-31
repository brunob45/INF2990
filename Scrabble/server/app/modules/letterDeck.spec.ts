import { LetterDeck, MAX_LETTERS_DECK, BLANK } from './letterDeck';
import { Letter } from './letterPouch';
import { expect } from 'chai';

describe('LetterDeck tests', () => {
    let myDeck: LetterDeck;
    let letters: Letter[] = [
        {letter: "A", value: 1},
        {letter: "B", value: 2},
        {letter: "C", value: 3},
        {letter: "D", value: 4},
        {letter: "A", value: 5},
        {letter: "A", value: 6},
        {letter: "B", value: 7}
    ];
    let blankDeck: LetterDeck;
    let blankTest: Letter[] = [
        {letter: BLANK, value: 0},
        {letter: "B", value: 2},
        {letter: "C", value: 3},
        {letter: "D", value: 4},
        {letter: "A", value: 5},
        {letter: "A", value: 6},
        {letter: "B", value: 7}
    ];

    it('can be initialized without an error', done => {
        myDeck = new LetterDeck(letters);
        blankDeck = new LetterDeck(blankTest);
        expect(myDeck).to.exist;
        expect(blankDeck).to.exist;
        done();
    });

    it('can be initialized with the right array of letters', done => {
        expect(myDeck.deck).to.be.equal(letters);
        expect(blankDeck.deck).to.be.equal(blankTest);
        done();
    });

    it('can deny add letter when full', done => {
        expect(myDeck.isFull()).to.be.true;
        expect(myDeck.addLetter(letters[0])).to.be.false;
        done();
    });

    it('can find letters', done => {
        expect(myDeck.contains('A')).to.be.true;
        expect(myDeck.contains('z')).to.be.false;
        expect(myDeck.contains('CDA')).to.be.true;
        expect(myDeck.contains('DCZ')).to.be.false;
        expect(myDeck.contains('AAB')).to.be.true;
        expect(myDeck.contains('ACC')).to.be.false;
        done();
    });

    it('can remove letter', done => {
        myDeck.removeLetter("A");
        expect(myDeck.deck.length).to.be.equal(MAX_LETTERS_DECK - 1);
        myDeck.removeLetter("Z");
        expect(myDeck.deck.length).to.be.equal(MAX_LETTERS_DECK - 1);
        done();
    });

    it('can flush deck', done => {
        myDeck.removeLetter('A');
        myDeck.removeLetter('A');
        myDeck.removeLetter('*');
        myDeck.removeLetter("B");
        myDeck.removeLetter("B");
        myDeck.removeLetter("C");
        myDeck.removeLetter("D");
        expect(myDeck.isEmpty()).to.be.true;
        done();
    });

    it('can add letters', done => {
        myDeck.addLetter({letter: "Z", value: 10});
        expect(myDeck.isEmpty()).to.be.false;
        expect(myDeck.contains("Z")).to.be.true;
        done();
    });

    it('can find letters and use blanks for missing letters', done => {
        expect(blankDeck.contains('A')).to.be.true;
        expect(blankDeck.contains('Z')).to.be.true;
        expect(blankDeck.contains('AAA')).to.be.true;
        expect(blankDeck.contains('DZCZ')).to.be.false;
        expect(blankDeck.contains('YA')).to.be.true;
        expect(blankDeck.contains('ACCC')).to.be.false;
        done();
    });

    it('can remove a blank letter when needed', done => {
        blankDeck.removeLetter("A");
        expect(blankDeck.deck.length).to.be.equal(MAX_LETTERS_DECK - 1);
        expect(blankDeck.contains("Y")).to.be.true;
        blankDeck.removeLetter("Z");
        expect(blankDeck.deck.length).to.be.equal(MAX_LETTERS_DECK - 2);
        expect(blankDeck.contains("Y")).to.be.false;
        done();
    });

    it('can convert blank letters to letters with value of Zero', done => {
        blankDeck.addLetter({letter: "*", value: 0});
        let wanted = "W";
        let letter = blankDeck.removeLetter(wanted);
        expect(letter.letter).to.equal(wanted);
        expect(letter.value).to.equal(0);
        done();
    });
});
