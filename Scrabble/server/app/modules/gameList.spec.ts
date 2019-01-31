import { expect } from 'chai';
import { GameList } from './gameList';
import { Player } from './player';

describe('GameList test', function () {
    let player = new Player(null, "player");

    it('Should find player in waiting queue', (done) => {
        GameList.addPlayer(player);
        expect(GameList.findListThatContainsPlayer(player)).to.not.be.null;
        done();
    });

    it('Should remove player in waiting queue', (done) => {
        GameList.removePlayer(player);
        expect(GameList.findListThatContainsPlayer(player)).to.be.null;
        done();
    });

    it('Should create multiple games', (done) => {
        for (let n = 2; n <= 4; n++)
        {
            for (let i = 1; i <= n; i++)
            {
                player = new Player(null, "player" + String(i));
                GameList.addPlayer(player);
                GameList.enterRoom(player, n);
                expect(GameList.findListThatContainsPlayer(player)).to.not.be.null;
            }
            expect(GameList.findListThatContainsPlayer(player)).to.not.be.null;
        }

        done();
    });
});
