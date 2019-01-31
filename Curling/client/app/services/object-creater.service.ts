import { Injectable } from '@angular/core';
import { LAUNCH_Z } from './render.service';
import { SceneService } from './scene.service';
import { SPRITE_NAME, STONE_RADIUS, START_HEIGHT } from '../classes/curlingstone';

let COLOR_GLOW = new THREE.Color( 0x888800 );

const EXT = '.json';
const MODEL_PATH = '/assets/models/json/';
const BRUSH_MODEL = 'curlingBrush';
const ROCK_MODEL = 'curlingRock';
const GLOW_TEXTURE = 'assets/images/glow.png';

const BRUSH_SCALE = 4;
export const RED_BRUSH = 'redbrushname';
export const GREEN_BRUSH = 'greenbrushname';

function addShadows(obj : THREE.Object3D)
{
    obj.traverse( function( node ) {
        if ( node instanceof THREE.Mesh )
        {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
}

@Injectable()
export class ObjectCreaterService {

    objectLoader: THREE.ObjectLoader;
    glowSpriteMaterial : THREE.SpriteMaterial;

    constructor(public scene : SceneService)
    {
        this.objectLoader = new THREE.ObjectLoader();
        let loader = new THREE.TextureLoader();
        let texture = loader.load(GLOW_TEXTURE);
        this.glowSpriteMaterial = new THREE.SpriteMaterial(
            {
                map : texture,
                color: COLOR_GLOW.getHex(), transparent: false, blending: THREE.AdditiveBlending
            }
        );
    }

    public newCurlingStone(isRed : boolean): Promise<THREE.Object3D>
    {
        return new Promise<THREE.Mesh>((resolve, error) => {
            let rockColor : string = isRed ? 'Red' : 'Blue' ;
            this.objectLoader.load( MODEL_PATH + ROCK_MODEL + rockColor + EXT, obj =>
            {
                if (obj === undefined)
                {
                    error("Unable to load round non-teapot object");
                }
                else
                {
                    obj.position.set(0, -STONE_RADIUS / 2, LAUNCH_Z);
                    obj.scale.set(STONE_RADIUS, STONE_RADIUS, STONE_RADIUS);
                    this.scene.addToScene(obj);

                    (obj as THREE.Mesh).material = new THREE.MeshPhongMaterial({
                        wireframe: false,
                        shininess: 0.2,
                    });

                    let glowSprite = new THREE.Sprite(this.glowSpriteMaterial);
                    glowSprite.scale.set(0, 0, 1);
                    glowSprite.name = SPRITE_NAME;
                    addShadows(obj);
                    (obj as THREE.Mesh).add(glowSprite);
                    resolve(obj as THREE.Mesh);
                }
            });
        });
    }

    public newBrush(): Promise<THREE.Object3D>
    {
        return new Promise<THREE.Mesh>((resolve, error) => {
            let mesh = new THREE.Object3D();
            let brushColor = "Red";
            this.objectLoader.load( MODEL_PATH + BRUSH_MODEL + brushColor + EXT, obj =>
            {
                if (obj)
                {
                    obj.position.set(0, START_HEIGHT, 0);
                    obj.scale.set(BRUSH_SCALE, BRUSH_SCALE, BRUSH_SCALE);
                    obj.name = RED_BRUSH;
                    (obj as THREE.Mesh).material = new THREE.MeshPhongMaterial({
                        wireframe: false,
                        shininess: 0.2,
                    });
                    mesh.add(obj as THREE.Mesh);
                    brushColor = "Green";
                    this.objectLoader.load('/assets/models/json/curlingBrush' + brushColor + '.json', obj2 =>
                    {
                        if (obj2)
                        {
                            obj2.position.set(0, START_HEIGHT, 0);
                            obj2.scale.set(BRUSH_SCALE, BRUSH_SCALE, BRUSH_SCALE);
                            obj2.name = GREEN_BRUSH;
                            (obj2 as THREE.Mesh).material = new THREE.MeshPhongMaterial({
                                wireframe: false,
                                shininess: 0.2,
                            });
                            mesh.add(obj2 as THREE.Mesh);
                            addShadows(mesh);
                            this.scene.addToScene(mesh);
                            resolve((mesh as THREE.Mesh));
                        }
                        else
                        {
                            error("Unable to load another elongated non-teapot object");
                        }
                    });
                }
                else
                {
                    error("Unable to load elongated non-teapot object");
                }
            });
        });
    }
}
