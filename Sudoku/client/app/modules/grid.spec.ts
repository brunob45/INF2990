import { Grid } from './grid';
import { expect } from 'chai';
import "reflect-metadata";

describe('Grid tests', function ()
{
    let grid: Grid = new Grid();

    it('Should create component', (done) =>
    {
        expect(grid).to.not.be.undefined;
        done();
    } );

    it('A grid should have 81 cells', (done) =>
    {
        expect(grid.cells.length).to.equal(81);
        done();
    } );
});
