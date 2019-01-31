import { expect } from 'chai';
import { Chat } from './chat';

describe('Chat test', function () {
    it('Should create chat', (done) => {
        let chat = new Chat();
        expect(chat).to.not.be.undefined;
        done();
    });

    it('Should add message to log', (done) => {
        let chat = new Chat();

        chat.addEntry("test", "ceci est un test");
        expect(chat.log.length).to.equal(1);

        chat.addEntry("test", "ceci est un autre test");
        expect(chat.log.length).to.equal(2);

        done();
    });
});
