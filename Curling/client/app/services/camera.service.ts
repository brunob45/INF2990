import { Injectable } from '@angular/core';

let pOffset = new THREE.Vector3(0, 10, 10);
let oOffset = new THREE.Vector3(0, 10, -10);

export const FOV = 75;
const LOOKOFFSETY = -6;
const ZOOM_BOUNDRY = 90;
const ZOOM_QUOTIENT = 10;

@Injectable()
export class CameraService
{
    private cameraPerspective : THREE.PerspectiveCamera;
    private cameraOrthographic : THREE.OrthographicCamera;

    public getPerspectiveOffset() : THREE.Vector3
    { return pOffset.clone(); }
    public getOrthographicOffset() : THREE.Vector3
    { return oOffset.clone(); }

    public get getCameraPerspective() : THREE.PerspectiveCamera
    { return this.cameraPerspective; }
    get getCameraOrthographic() : THREE.OrthographicCamera
    { return this.cameraOrthographic; }

    public getCamera(needPerspective : boolean) : THREE.Camera
    {
        if (needPerspective)
        {
            return this.cameraPerspective;
        }
        else
        {
            return this.cameraOrthographic;
        }
    }

    constructor()
    {
        let width = 100, height = 100;
        if (window)
        {
            width = window.innerWidth;
            height = window.innerHeight;
        }
        this.cameraPerspective = new THREE.PerspectiveCamera(FOV, width / height, 1, 1000);

        this.cameraOrthographic = new THREE.OrthographicCamera
        (width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
        let origin = new THREE.Vector3(0, -100, 0);
        this.cameraOrthographic.lookAt(origin);
        this.cameraOrthographic.updateProjectionMatrix();
    }

    public resizeUpdate(newWidth : number, newHeight : number) : void
    {
        this.cameraPerspective.aspect = newWidth / newHeight;

        this.cameraOrthographic.left = -newWidth / 2;
        this.cameraOrthographic.right = newWidth / 2;
        this.cameraOrthographic.top = newHeight / 2;
        this.cameraOrthographic.bottom = -newHeight / 2;

        this.updateProjectionMatrix();
    }
    public updateProjectionMatrix() : void
    {
        this.cameraPerspective.updateProjectionMatrix();
        this.cameraOrthographic.updateProjectionMatrix();
    }

    public moveCamera(targetZ : number)
    {
        let target = new THREE.Vector3(0, 0, targetZ);
        let lookAt = new THREE.Vector3(0, LOOKOFFSETY, targetZ / 2);
        let positionPerspective = this.getPerspectiveOffset().add(target);
        let positionOrthographic = this.getOrthographicOffset().add(lookAt);

        this.cameraPerspective.position.copy(positionPerspective);
        this.cameraOrthographic.position.copy(positionOrthographic);
        this.cameraPerspective.lookAt(lookAt);

        let zoom = (ZOOM_BOUNDRY - this.cameraOrthographic.position.z) / ZOOM_QUOTIENT;
        this.cameraOrthographic.zoom = zoom;

        this.updateProjectionMatrix();
    }
}
