import { Injectable } from '@angular/core';

@Injectable()
export class SceneService
{
    private scene : THREE.Scene;
    constructor()
    {
        this.scene = new THREE.Scene();
    }

    getScene()
    { return this.scene; }

    addToScene(value : THREE.Object3D)
    { this.scene.add(value); }

    removeFromScene(value : THREE.Object3D)
    { this.scene.remove(value); }
    removeNameFromScene(value : string)
    { this.scene.remove(this.scene.getObjectByName(value)); }
}
