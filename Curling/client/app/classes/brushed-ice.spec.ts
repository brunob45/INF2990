import 'reflect-metadata';
import { BrushedIce, BASE_FRICTION,
         LOW_FRICTION, ZONE_RADIUS } from './brushed-ice';
import { expect } from 'chai';

describe('BrushedIce', function () {
    let ice: BrushedIce;

    beforeEach(() => {
        ice = new BrushedIce(new THREE.Vector3( 0, 0, 0 ));
    });

    it('should be created correctly', done =>
    {
        expect(ice).to.not.be.undefined.and.to.be.a('BrushedIce');
        done();
    });
    it('should be created with low friction', done =>
    {
        expect(ice.friction).to.equal(LOW_FRICTION);
        done();
    });
    it('should gain friction over time', done =>
    {
        let dt = 1 / 4;
        ice.update(dt);
        expect(ice.friction).to.be.within(LOW_FRICTION, BASE_FRICTION);
        done();
    });
    it('should return lower friction when in proximity', done =>
    {
        let posIn = new THREE.Vector3(0.8 * ZONE_RADIUS, 0, 0);
        let posOut = new THREE.Vector3(1.2 * ZONE_RADIUS, 0, 0);
        expect(ice.getFriction(posIn)).to.equal(LOW_FRICTION);
        expect(ice.getFriction(posOut)).to.equal(BASE_FRICTION);
        done();
    });
});
