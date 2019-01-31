import { expect } from "chai";
import {ListOfPlayers } from "./ListOfPlayer";
import { Player } from "./player";

describe('ListOfPlayers tests', () => {
    let list: ListOfPlayers;
    let player1 = new Player(null, "player1");

    it('can create list', done => {
        list = new ListOfPlayers(2);
        expect(list).to.not.be.undefined;
        done();
    });

    it('can add player and find player', done => {
        list.addPlayer(player1);
        expect(list.contains(player1)).to.be.true;
        expect(list.findByName("player2")).to.be.undefined;
        done();
    });

    it('can reach max size', done => {
        let res1 = list.addPlayer(new Player(null, "player2"));
        let res2 = list.addPlayer(new Player(null, "player3"));

        expect(res1).to.be.true;
        expect(res2).to.be.false;
        expect(list.isFull()).to.be.true;
        done();
    });

    it('can remove player', done => {
        list.removePlayer(player1);
        expect(list.contains(player1)).to.be.false;
        done();
    });
});
