import { expect } from 'chai';
import { Database } from './database';

describe('Scrabble Database tests', () => {
    Database.init();

    it('can be initialized without an error', done => {
        expect(true).to.be.true;
        done();
    });

    it('can verify if a word exists', done => {
        Database.singleWordExist('AH')
        .then((shouldBeValid) => {
            expect(shouldBeValid).to.be.true;
            Database.singleWordExist('AB')
            .then((shouldBeInvalid) => {
                expect(shouldBeInvalid).to.be.false;
                done();
            });
        });
    });

    it('can verify if multiple word exists', done => {
        Database.multipleWordsExist(['AH', 'salut'])
        .then((shouldBeValid) => {
            expect(shouldBeValid).to.be.true;
            Database.multipleWordsExist(['thisisnotavalidword', 'AH', 'salut'])
            .then((shouldBeInvalid) => {
                expect(shouldBeInvalid).to.be.false;
                done();
            });
        });
    });

    it("can import user", done => {
        Database.importUser({username: '1', password: 'c4ca4238a0b923820dcc509a6f75849b'})
        .then((usrGoodPassword) => {
            expect(usrGoodPassword.getName()).to.be.equal('1');
            done();
        });
    });

    it("can't import a user with the wrong password", done => {
        Database.importUser({username: '1', password: '2'})
        .then((usrWrongPassword) => {
            expect(usrWrongPassword).to.be.null;
            done();
            });
    });

    it("can't import an non-existing user", done => {
        Database.importUser({username: "DO NOT USE THIS USERNAME", password: "abc"})
        .then((usrNotExist) => {
            expect(usrNotExist).to.be.null;
            done();
        });
    });
});
