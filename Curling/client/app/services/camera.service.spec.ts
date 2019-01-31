import { CameraService, FOV } from './camera.service';
import { expect } from 'chai';
import "reflect-metadata";

describe('CameraService', function () {
    let service: CameraService;

    beforeEach(() => {
        service = new CameraService();
    });

    it('should be created correctly', done =>
    {
        expect(service).to.not.be.undefined.and.to.be.a('CameraService');
        done();
    });
    it('should create a perspective camera', done =>
    {
        let cam = service.getCameraPerspective;
        expect(cam).to.not.be.undefined.and.to.be.a('THREE.PerspectiveCamera');
        done();
    });
    it('perspective camera is correctly initialized', done =>
    {
        let cam = service.getCameraPerspective;
        expect(cam.aspect).to.not.be.undefined;
        expect(cam.position).to.not.be.undefined.and.to.be.a('THREE.Vector3');
        expect(cam.fov).to.equal(FOV);

        expect(cam.projectionMatrix).to.not.be.undefined.and.to.be.a('THREE.Matrix4');
        done();
    });

    it('should create an orthographic camera', done =>
    {
        let cam = service.getCameraOrthographic;
        expect(cam).to.not.be.undefined.and.to.be.a('THREE.OrthographicCamera');
        done();
    });
    it('orthographic camera is correctly initialized', done =>
    {
        let cam = service.getCameraOrthographic;
        expect(cam.bottom).to.not.be.undefined;
        expect(cam.top).to.not.be.undefined;
        expect(cam.left).to.not.be.undefined;
        expect(cam.right).to.not.be.undefined;
        expect(cam.near).to.not.be.undefined;
        expect(cam.far).to.not.be.undefined;
        expect(cam.position).to.not.be.undefined.and.to.be.a('THREE.Vector3');

        expect(cam.projectionMatrix).to.not.be.undefined.and.to.be.a('THREE.Matrix4');
        done();
    });

    it('should return the camera requested', done =>
    {
        let Pcam = service.getCameraPerspective;
        let Ocam = service.getCameraOrthographic;
        expect(service.getCamera(true)).to.be.equal(Pcam);
        expect(service.getCamera(false)).to.be.equal(Ocam);
        done();
    });

    it('should move the camera focus correctly', done =>
    {
        let posZ = 10;
        service.moveCamera(posZ);

        expect(service.getCameraPerspective.position.z).to.equal(posZ + service.getPerspectiveOffset().z);
        expect(service.getCameraOrthographic.position.z).to.equal((posZ / 2) + service.getOrthographicOffset().z);

        done();
    });
});
