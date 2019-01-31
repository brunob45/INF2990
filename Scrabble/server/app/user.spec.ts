import { expect} from 'chai';
import { User } from './user.js';

describe('User test', () => {
    it('can create a user with the right name', done => {
        let myUser = new User("bob", "pa$$word");
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
