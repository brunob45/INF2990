import { expect} from 'chai';
import { User } from './user.js';

describe('User test', () => {
    it('can create a user with the right name and the right time', done => {
        let myUser = new User("bob", "pa$$word");
        myUser.setBestScore(300, false);
        myUser.setBestScore(500, true);
        expect(myUser.getBestScore(false)).to.be.equal(300);
        expect(myUser.getBestScore(true)).to.be.equal(500);
        expect(myUser.getName()).to.be.equal("bob");
        done();
    });

    it('can verify the password', done => {
        let myUser = new User("bob", "pa$$word");
        expect(myUser.verifyPassword("pa$$word")).to.be.true;
        expect(myUser.verifyPassword("Pa$$word")).to.be.false;
        done();
    });
});
