import "reflect-metadata";
import { SceneService } from './scene.service';
import { expect } from 'chai';

describe('SceneService', function () {
    let service: SceneService;

    beforeEach(() => {
        service = new SceneService();
    });

    it('should be created correctly', done =>
    {
        expect(service).to.not.be.undefined.and.to.be.a('SceneService');
        done();
    });
    it('should return its contents correctly', done =>
    {
        expect(service.getScene()).to.not.be.undefined.and.to.be.a('THREE.Scene');
        done();
    });
    it('should be created empty', done =>
    {
        expect(service.getScene().children.length).to.equal(0);
        done();
    });
    it('should add an element sucessfully', done =>
    {
        service.addToScene(new THREE.Object3D());
        expect(service.getScene().children.length).to.equal(1);
        done();
    });
    it('should remove an element sucessfully', done =>
    {
        let obj = new THREE.Object3D();
        service.addToScene(obj);
        service.removeFromScene(obj);
        expect(service.getScene().children.length).to.equal(0);
        done();
    });
    it('should find an element by its name and remove it sucessfully', done =>
    {
        let obj = new THREE.Object3D();
        obj.name = "removal";
        service.addToScene(obj);
        service.removeNameFromScene("removal");
        expect(service.getScene().children.length).to.equal(0);
        done();
    });
});
