import { Injectable } from '@angular/core';

import { HOGLINE_BACK, HOGLINE_FRONT } from '../services/render.service';
import { STONE_RADIUS } from './curlingstone';

import { AudioService } from '../services/audio.service';
import { InputService } from '../services/input.service';
import { Mouse3DService } from '../services/mouse3d.service';
import { ObjectCreaterService, GREEN_BRUSH, RED_BRUSH } from '../services/object-creater.service';
import { GameInfo } from './game-info';

const SWIPE_SPEED = 10;
const MAX_SWIPE_DISPLACEMENT = STONE_RADIUS * 2;
const SWIPE_MIDPOINT = MAX_SWIPE_DISPLACEMENT / 2;

let unitX = new THREE.Vector3(-1, 0, 0);
let previousMousePressed = false;

@Injectable()
export class Brush
{
    private ready = false;
    private mesh = new THREE.Object3D();
    private greenBrush : THREE.Object3D;
    private redBrush : THREE.Object3D;
    private position : THREE.Vector3;
    private swipeDisplacement : number;

    private listener = new THREE.AudioListener();
    private soundBroom = new THREE.Audio( this.listener );
    setDisplacement(val : number)
    {
        this.swipeDisplacement = val;
        if (this.swipeDisplacement > MAX_SWIPE_DISPLACEMENT)
        {
            this.swipeDisplacement = MAX_SWIPE_DISPLACEMENT;
        }
        else if (this.swipeDisplacement < 0)
        {
            this.swipeDisplacement = 0;
        }
    }

    set visible(val : boolean)
    {
        this.mesh.visible = val;
    }

    constructor(private gameInfo : GameInfo,
                private input : InputService,
                private mouse3d : Mouse3DService,
                private objectCreater : ObjectCreaterService,
                private audio : AudioService)
    {
        this.swipeDisplacement = 0;
        this.mesh = new THREE.Object3D();
        this.objectCreater.newBrush().then(
            (obj) => {
                this.mesh = obj;
                this.greenBrush = this.mesh.getObjectByName(GREEN_BRUSH);
                this.redBrush = this.mesh.getObjectByName(RED_BRUSH);
                this.ready = true;
                this.greenBrush.visible = false;
                this.redBrush.visible = false;
        }).catch((error) => console.log(error));

        this.soundBroom.load('/assets/sounds/broom.mp3');
        this.soundBroom.setVolume(1);
        this.soundBroom.autoplay = false;
    }

    public update(deltaT : number)
    {
        if (this.ready)
        {
            this.position = this.mouse3d.getMouseWorldPosition();
            if ((this.gameInfo.targetStone) && this.isInCenterZone(this.gameInfo.targetStonePosition.z))
            {
                this.greenBrush.visible = true;
                this.redBrush.visible = false;
                this.setDisplacement(this.swipeDisplacement + deltaT *
                (this.input.mouseDown ? SWIPE_SPEED : -SWIPE_SPEED));

                if (previousMousePressed !== this.input.mouseDown)
                {
                    if (!this.soundBroom.isPlaying)
                    {
                        this.soundBroom.play();
                    }
                    previousMousePressed = this.input.mouseDown;
                    this.gameInfo.newBrushedZone(this.position.clone().addScaledVector(unitX, SWIPE_MIDPOINT));
                }
            }
            else
            {
                this.setDisplacement(this.swipeDisplacement - deltaT * SWIPE_SPEED);
                this.greenBrush.visible = false;
                this.redBrush.visible = true;
            }
            this.mesh.position.copy(this.position.clone());
            this.mesh.position.addScaledVector(unitX, this.swipeDisplacement);
        }
    }
    private isInCenterZone(zPosition : number)
    {
        return zPosition > HOGLINE_BACK && zPosition < HOGLINE_FRONT;
    }
}
