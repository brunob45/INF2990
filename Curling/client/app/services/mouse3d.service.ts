import { Injectable } from '@angular/core';
import { InputService } from './input.service';
import { CameraService } from './camera.service';

@Injectable()
export class Mouse3DService
{
    constructor(private input : InputService, private camera : CameraService) { }

    public getMouseWorldPosition() : THREE.Vector3
    {
        let vector : THREE.Vector3;
        let camera = this.camera.getCamera(this.input.isPerspective);
        if (this.input.isPerspective)
        {
            let mouseWorldVector = this.input.mousePos.clone().unproject(camera);
            let directionVector = mouseWorldVector.sub(camera.position).normalize();
            let distance = - camera.position.y / directionVector.y;
            vector = camera.position.clone().addScaledVector(directionVector, distance);
        }
        else
        {
            let mouseWorldVector = this.input.mousePos.clone();
            mouseWorldVector.setComponent(2, -1);
            mouseWorldVector.unproject(camera);
            mouseWorldVector.setComponent(1, 0);
            vector = mouseWorldVector;
        }
        return vector;
    }
}
