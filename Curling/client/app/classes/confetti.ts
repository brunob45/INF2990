import { SKYBOXLENGHT, SKYBOXWIDTH,
         SKYBOXHEIGHT, SKYBOX_Z } from '../services/render.service';
import { SceneService } from '../services/scene.service';

const PARTICLESAMOUNT = 20000;
const PARTICLESIZE = 0.5;
const PARTICLEHEIGHT = 70;

export class Confetti {

    private particleSystem : THREE.Points;

    constructor(private scene : SceneService)
    {
    }

    get ParticleSystem() : THREE.Points
    { return this.particleSystem; }

    set ParticleSystem(val : THREE.Points)
    { this.particleSystem = val; }

    public confettiInit() : void {

        let particlesMaterial = new THREE.PointsMaterial(
        {
            vertexColors: 2,
            size: PARTICLESIZE
        });

        let particleGeometry = new THREE.Geometry();

        for (let i = 0; i < PARTICLESAMOUNT; i++) {
            let positionX = Math.random() * SKYBOXWIDTH - SKYBOXWIDTH / 2,
                positionY = Math.random() * PARTICLEHEIGHT - PARTICLEHEIGHT / 2,
                positionZ = Math.random() * SKYBOXLENGHT - SKYBOXLENGHT / 2;
            let particlePosition = new THREE.Vector3(positionX, positionY, positionZ);
            particleGeometry.vertices.push(particlePosition);
            particleGeometry.colors.push(new THREE.Color(Math.random() * 0xFFFFFF));
        }

        this.particleSystem = new THREE.Points(particleGeometry, particlesMaterial);
        this.particleSystem.position.y = SKYBOXHEIGHT;
        this.particleSystem.position.z = SKYBOX_Z;
        this.scene.addToScene(this.particleSystem);
    }
}
