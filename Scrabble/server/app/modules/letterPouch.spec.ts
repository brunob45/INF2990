import { expect } from 'chai';
import { LetterPouch } from './letterPouch';

describe('LetterPouch tests', () => {

    let myPouch: LetterPouch;
    it('can be initialized without an error', (done) => {
        LetterPouch.CreateNewLetterPouch()
        .then((pouch) => {
            myPouch = pouch;
            expect(pouch).to.exist;
            done();
        });
    });

    it('can be initialized with the right amount of letters', (done) => {
        expect(myPouch.letters.length).to.be.equal(102);
        done();
    });

    it('can pick all letters', (done) => {
        for (let i = 101; i >= 0; i--)
        {
            let letter = myPouch.pick();
            expect(myPouch.letters.length).to.be.equal(i);
            expect(letter.value).to.be.below(11);
        }
        expect(myPouch.isEmpty()).to.be.true;
        done();
    });
});
