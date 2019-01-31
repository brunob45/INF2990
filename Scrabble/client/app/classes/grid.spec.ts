import { Grid } from './grid';
import { expect } from 'chai';

describe('Grid tests', function () {
    it('Should create grid', (done) =>
    {
        let grid = new Grid();
        expect(grid).to.not.be.undefined;
        done();
    } );

});
