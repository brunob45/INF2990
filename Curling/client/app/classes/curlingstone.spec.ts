import 'reflect-metadata';
import { ObjectCreaterService } from '../services/object-creater.service';
import { SceneService } from '../services/scene.service';
import { AudioService } from '../services/audio.service';
import { CurlingStone, FORCE_MULTIPLIER,
         ELASTICITY, STONE_RADIUS, START_HEIGHT } from './curlingstone';
import { expect } from 'chai';

class MockObjectCreater implements ObjectCreaterService
{
    objectLoader : THREE.ObjectLoader;
    glowSpriteMaterial : THREE.SpriteMaterial;
    scene : SceneService;

    newCurlingStone(b : boolean) : Promise<THREE.Object3D>
    {
        return new Promise<THREE.Object3D>
        ((resolve, error) =>
        {
            let obj = new THREE.Mesh();
            let sprite = new THREE.Sprite();
            sprite.name = "glowsprite";
            obj.add(sprite);
            resolve(obj);
        }
        );
    }
    newBrush() : Promise<THREE.Object3D>
    {
        return new Promise<THREE.Object3D>
        ((resolve, error) => { resolve(new THREE.Mesh()); } );
    }
}
class MockAudio implements AudioService
{
    listener : THREE.AudioListener;
    loader : THREE.AudioLoader;

    loadSound(file : string) : Promise<THREE.Audio>
    {
        return new Promise<THREE.Audio>((resolve, error) => {
                error("failed to load " + file);
        });
    }
    public loadTo(sound : THREE.Audio, file : string)
    {
        sound = null;
    }
}

describe('CurlingStone', function () {
    let service : ObjectCreaterService = new MockObjectCreater();
    let audio : AudioService = new MockAudio();
    let stoneList : CurlingStone[] = [];
    let stone : CurlingStone;
    let otherStone : CurlingStone;

    beforeEach(() => {
        stoneList.splice(0, stoneList.length);
        stone = new CurlingStone(service, audio, true);
        stoneList.push(stone);
        otherStone = new CurlingStone(service, audio, false);
        stoneList.push(otherStone);
    });

    it("should be initialized correctly", done => {
        expect(stone.isTeamRed).to.equal(true);
        expect(stone.isClockwiseSpin).to.equal(null);
        expect(stone.ready).to.equal(false);
        setTimeout(function() {
            expect(stone.model).to.exist.and.be.an.instanceOf(THREE.Object3D);
            done();
        }, 500);
    });
    it("should be launched correctly", done => {

        let force = 1;
        let spin = true;
        let angle = Math.PI / 6;
        stone.launch(force, spin, angle);

        expect(approx(stone.speed.length(), force * FORCE_MULTIPLIER)).to.equal(true);
        expect(approx(stone.speed.x, force * FORCE_MULTIPLIER * Math.sin(angle))).to.equal(true);
        expect(stone.isClockwiseSpin).to.equal(spin);
        done();
    });


    it("should move", done => {

        this.retries(3);
        let force = 1;
        let spin = true;
        let angle = 0;
        let deltaT = 1;
        stone.launch(force, spin, angle);
        setTimeout(function() {
            stone.position.z = 0;
            expect(approx(stone.position.z, 0)).to.equal(true);
            stone.moving(deltaT);
            expect(approx(stone.position.z, stone.speed.z)).to.equal(true);
            done();
        }, 500);
    });
    it("should be slowed down by friction", done => {

        let force = 1;
        let spin = true;
        let angle = 0;
        let friction = 1;
        let deltaT = 1;
        stone.launch(force, spin, angle);

        expect(approx(stone.speed.length(), force * FORCE_MULTIPLIER)).to.equal(true);
        stone.slowing(deltaT, friction);
        expect(approx(stone.speed.length(), force * FORCE_MULTIPLIER - 1)).to.equal(true);
        done();
    });
    it("should curve from friction", done => {

        let force = 1;
        let spin = true;
        let angle = 0;
        let friction = 1;
        let deltaT = 1;
        stone.launch(force, spin, angle);

            expect(approx(stone.speed.x, 0)).to.equal(true);
            stone.curving(deltaT, friction);
            expect(approx(stone.speed.x, 0)).to.equal(false);
        done();
    });
    it("should spin", done => {

        this.retries(3);
        let force = 1;
        let spin = true;
        let angle = 0;
        stone.launch(force, spin, angle);

        setTimeout(function() {
            expect(approx(stone.model.rotation.z, 0)).to.equal(true);
            stone.spinning();
            expect(approx(stone.model.rotation.z, 0)).to.equal(false);
            done();
        }, 500);
    });
    it("should detect a collision", done => {

        this.retries(3);
        let force = 1;
        let spin = true;
        let angle = 0;
        stone.launch(force, spin, angle);

        setTimeout(function() {
            otherStone.position.z = 5;
            stone.position.z = 5 - STONE_RADIUS * 2.2; //No overlap
            stone.colliding(stoneList);
            expect(approx(stone.speed.length(), force * FORCE_MULTIPLIER)).to.equal(true);
            //No loss of speed

            stone.position.z = 5 - STONE_RADIUS * 1.8; //Overlap
            stone.colliding(stoneList);
            expect(approx(stone.speed.length(), force * FORCE_MULTIPLIER)).to.equal(false);
            //Loss of speed
            done();
        }, 500);
    });
    it("should collide and transfer speed", done => {

        this.retries(3);
        let force = 1;
        let spin = true;
        let angle = 0;
        stone.launch(force, spin, angle);

        setTimeout(function() {
            otherStone.position.z = 5;
            expect(approx(otherStone.speed.length(), 0)).to.equal(true);
            //No gain of speed

            stone.position.z = 5 - STONE_RADIUS * 1.8; //Overlap
            stone.colliding(stoneList);
            expect(approx(stone.speed.length(), force * FORCE_MULTIPLIER * (1 - ELASTICITY))).to.equal(true);
            expect(approx(otherStone.speed.length(), force * FORCE_MULTIPLIER * ELASTICITY)).to.equal(true);
            //Speed transferred according to elasticity
            done();
        }, 500);
    });
    it("should stop", done => {

        let force = 1;
        let spin = true;
        let angle = 0;
        stone.launch(force, spin, angle);

        expect(approx(stone.speed.z, 0)).to.equal(false);
        stone.stopping();
        expect(approx(stone.speed.z, 0)).to.equal(true);
        done();
    });

    it("should do a victory animation", done => {

        this.retries(3);
        setTimeout(function() {
            stone.position.y = START_HEIGHT;
            expect(approx(stone.position.y, START_HEIGHT)).to.equal(true);
            stone.victoryAnimation();
            stone.victoryAnimation();
            stone.victoryAnimation();
            expect(approx(stone.position.y, START_HEIGHT)).to.equal(false);
            done();
        }, 500);
    });
    it("should stop the victory animation", done => {

        this.retries(3);
        setTimeout(function() {
            stone.position.y = START_HEIGHT;
            expect(approx(stone.position.y, START_HEIGHT)).to.equal(true);
            stone.victoryAnimation();
            stone.victoryAnimation();
            stone.victoryAnimation();
            expect(approx(stone.position.y, START_HEIGHT)).to.equal(false);
            stone.stopMoving();
            expect(approx(stone.position.y, START_HEIGHT)).to.equal(true);
            done();
        }, 500);
    });


});

const APPROX_TOLERANCE = 0.01;
function approx(actual : number, expected : number) : boolean
{
    let tolerance = (Math.abs(expected) * APPROX_TOLERANCE);
    return (expected - tolerance <= actual
         && expected + tolerance >= actual);
}
