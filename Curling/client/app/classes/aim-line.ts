import { Injectable } from '@angular/core';
import { LAUNCH_Z, HALF_WIDTH } from '../services/render.service';
import { SceneService } from '../services/scene.service';
import { Mouse3DService } from '../services/mouse3d.service';

const BASE_GAP = 3;
const ANIMATION_SPEED = 0.05;

const MAX_Z = 130;
const MIN_Z = 12; // Approx. Cos(30°) * 7 * 2

@Injectable()
export class AimLine
{
    private line : THREE.Line;
    private material : THREE.LineDashedMaterial;
    private geometry : THREE.Geometry;
    private angle : number;

    get visible() : boolean
    { return this.line.visible; }
    set visible(val : boolean)
    { this.line.visible = val; }

    constructor(private mouse3d : Mouse3DService, private scene : SceneService)
    {
        this.material = new THREE.LineDashedMaterial(
            {
                color : 0xffffff,
                linewidth: 5,
                scale: 1,
                dashSize: 3,
                gapSize: 2
            });
        this.geometry = new THREE.Geometry();
        this.geometry.vertices.push(
            new THREE.Vector3(0, 0.05, LAUNCH_Z),
            new THREE.Vector3( 0, 0.05, 0)
        );
        this.geometry.computeLineDistances();

        this.line = new THREE.Line(this.geometry, this.material);
        this.scene.addToScene(this.line);
        this.angle = 0;
    }

    public update() : number
    {
        this.animate();
        let pos = this.getLineEnd();
        //Readjust geometry vertices
        this.geometry.vertices[1].x = pos.x;
        this.geometry.vertices[1].z = LAUNCH_Z - pos.z;
        this.geometry.verticesNeedUpdate = true;

        //Calculate launch angle
        let angle = Math.atan(pos.x / pos.z);
        angle = angle < -Math.PI / 6 ? -Math.PI / 6 : angle;
        angle = angle > Math.PI / 6 ? Math.PI / 6 : angle;
        return angle;
    }
    private animate() : void
    {
        this.material.gapSize = BASE_GAP + Math.sin(this.angle);
        this.angle += ANIMATION_SPEED;
    }
    private getLineEnd() : THREE.Vector3
    {
        let position = this.mouse3d.getMouseWorldPosition();
        if (position)
        {
            //Adjust world coordinates relative to launch coordinates
            position.z = LAUNCH_Z - position.z;

            //X adjustment
            if (position.x !== 0)
            {
                let correctionX = HALF_WIDTH / Math.abs(position.x);
                position.x *= correctionX;
                position.z *= correctionX;
            }
            else
            {
                position.z = MAX_Z;
            }
            //Z adjustment
            if (Math.abs(position.z) > MAX_Z)
            {
                let correctionZ = MAX_Z / Math.abs(position.z);
                position.x *= correctionZ;
                position.z *= correctionZ;
            }
            //anti-backwards adjustment
            if (Math.abs(position.z) < MIN_Z)
            {
                position.z = MIN_Z;
                this.material.color.setHex(0xff0000);
            }
            else
            {
                position.z = Math.abs(position.z);
                this.material.color.setHex(0xffffff);
            }

            return position;
        }
    }
}
