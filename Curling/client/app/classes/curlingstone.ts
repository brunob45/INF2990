import { ObjectCreaterService } from '../services/object-creater.service';
import { AudioService } from '../services/audio.service';

export const SPIN_MULTIPLIER = 0.003; //Speed of spin effect
export const SPIN_FORCE_MULTIPLIER = 0.01; //Force of curve
export const FORCE_MULTIPLIER = 10; //Speed of stone thrown at 100% Force
export const STONE_RADIUS = 0.6; //Radius of stone, for collisions
export const ELASTICITY = 0.85; //Collision-related coefficent

export const SPRITE_NAME = "glowsprite";
const GLOW_MAXIMUM = 5;
const GLOW_FADE_IN = 0.2;
const GLOW_FADE_OUT = 0.25;

const VELOCITY = 0.13;
const ROTATEYAMOUNT = 0.02;
const ROTATEZAMOUNT = 0.01;
const MAXJUMPS = 10;
export const START_HEIGHT = -STONE_RADIUS / 2;

const VECTORNULL = new THREE.Vector3(0, 0, 0);

let isMoveable = true;

export class CurlingStone {

    speed : THREE.Vector3;
    isClockwiseSpin : boolean;
    isTeamRed : boolean;
    ready = false;
    outPlay = false;
    canGivePoints = false;

    private soundCollision : THREE.Audio;
    private soundLaunch : THREE.Audio;
    private velocity : number;
    private rotateY : number;
    private rotateZ : number;
    private jumpCounter : number;

    model : THREE.Object3D;
    sprite : THREE.Sprite;

    get position() : THREE.Vector3
    {
        if (this.model)
        { return this.model.position; }
        else
        { return new THREE.Vector3(0, 0, 114); }
    }

    constructor(private creater : ObjectCreaterService, private audio : AudioService, teamRed : boolean)
    {
        this.isTeamRed = teamRed;
        this.isClockwiseSpin = null;
        this.creater.newCurlingStone(this.isTeamRed).then(
            (obj) => {
                this.model = obj;
                this.sprite = (obj.getObjectByName(SPRITE_NAME) as THREE.Sprite);
            }
        ).catch((error) => console.log(error));
        this.speed = VECTORNULL.clone();

        this.velocity = 0;
        this.rotateY = 0;
        this.rotateZ = 0;
        this.jumpCounter = 0;
        this.audio.loadTo(this.soundCollision, 'clang');
        this.audio.loadTo(this.soundLaunch, 'swoosh');
    }

    public launch(force : number, spin : boolean, angle : number) : void
    {
        if (this.isTeamRed && this.soundLaunch)
        {
            this.soundLaunch.play();
        }
        this.isClockwiseSpin = spin;
        force *= FORCE_MULTIPLIER;
        this.speed = new THREE.Vector3(Math.sin(angle) * force, 0 , -Math.cos(angle) * force);
        this.ready = true;
    }

    public isOutPlay() : boolean
    {
        if (this.model)
        {
            return (this.position.x <= -6.0 || this.position.x >= 6.0
                  || this.position.z >= 200 || this.position.z <= -16);
        }
        else
        {
            return false;
        }
    }

    public physicStep(stoneList : CurlingStone[], deltaT : number, friction : number) : boolean
    {
        let moving = true;
        this.outPlay = this.isOutPlay();
        this.glowing();
        if (this.model && this.ready)
        {
            let speed = this.speed.length();
            if (speed !== 0)
            {
                this.slowing(deltaT, friction);
                this.curving(deltaT, friction);
                this.spinning();

                this.speed.clampLength(0, 50);
                if (this.speed.lengthSq() <= 0.2)
                {
                    this.stopping();
                }
                else
                {
                    this.colliding(stoneList);
                }
                this.moving(deltaT);
            }
            else
            {
                moving = false;
            }
        }
        return moving;
    }

    public victoryAnimation() : void
    {
        if (this && this.jumpCounter < MAXJUMPS && isMoveable)
        {
            this.rotateY = (this.model.rotation.y > 0.3) ? -ROTATEYAMOUNT : this.rotateY;
            this.rotateY = (this.model.rotation.y <= 0) ? ROTATEYAMOUNT : this.rotateY;
            this.rotateZ = (this.model.rotation.z > 0.3) ? -ROTATEZAMOUNT : this.rotateZ;
            this.rotateZ = (this.model.rotation.z <= 0) ? ROTATEZAMOUNT : this.rotateZ;
            this.velocity = (this.position.y > 1.5) ? -VELOCITY : this.velocity;

            if (this.position.y <= START_HEIGHT)
            {
                this.velocity = VELOCITY;
                this.jumpCounter++;
                if (this.jumpCounter === MAXJUMPS)
                {
                    isMoveable = false;
                }
            }

            this.position.y += this.velocity;
            this.model.rotation.y += this.rotateY;
            this.model.rotation.z += this.rotateZ;
        }

        if (this && !isMoveable)
        {
            this.stopMoving();
        }
    }

    public stopMoving() : void
    {
        this.velocity = 0;
        this.rotateY = 0;
        this.rotateZ = 0;
        this.model.position.y = START_HEIGHT;
        this.model.rotation.y = 0;
        this.model.rotation.z = 0;
        this.speed = VECTORNULL;
    }

    public slowing(deltaT : number, friction : number) : void
    {
        let frictionVector = this.speed.clone().normalize();
        this.speed.add(frictionVector.multiplyScalar( -friction * deltaT));
    }

    public curving(deltaT : number, friction : number) : void
    {

        if (this.isClockwiseSpin != null)
        {
            let spinForceVector = new THREE.Vector3().crossVectors(this.speed, new THREE.Vector3(0, 1, 0));
            spinForceVector.normalize();
            let spinForce = this.isClockwiseSpin ? -1 : 1 ;
            spinForce *= friction * deltaT * this.speed.length() * SPIN_FORCE_MULTIPLIER;
            this.speed.addScaledVector(spinForceVector, spinForce);
        }
    }

    public spinning() : void
    {
        if (this.isClockwiseSpin != null)
        {
            this.model.rotation.z += SPIN_MULTIPLIER * (this.isClockwiseSpin ? -1 : 1 ) * this.speed.length();
        }
    }

    public stopping() : void
    {
        this.speed = new THREE.Vector3(0, 0, 0);
        //Stone has stopped. further movements through
        //collisions will no longer be affected by spin.
        this.isClockwiseSpin = null;
    }

    public colliding(stoneList : CurlingStone[])
    {
        stoneList.forEach((value : CurlingStone, index : number, array : CurlingStone[]) =>
        {
            if (this.model.id !== value.model.id)
            {
                //Note: direction of vector is ( this <--bounceVector-- value )
                let bounceVector = this.position.clone().sub(value.position);
                if (bounceVector.length() <= STONE_RADIUS * 2)
                {//Collision has occurred!
                    if (this.soundCollision)
                    {
                        this.soundCollision.play();
                    }
                    let overlap = (STONE_RADIUS * 2) - bounceVector.length();
                    bounceVector.normalize();
                    //Ensures colision isn't checked twice
                    this.position.addScaledVector(bounceVector, overlap / 2 + 0.01);
                    value.position.addScaledVector(bounceVector, -overlap / 2 - 0.01);

                    let transferredMoment = ELASTICITY * (this.speed.dot(bounceVector) - value.speed.dot(bounceVector));
                    //Redistribute
                    this.speed.addScaledVector(bounceVector, -transferredMoment);
                    value.speed.addScaledVector(bounceVector, transferredMoment);
                }
            }
        });
    }

    public moving(deltaT : number) : void
    {
        this.position.addScaledVector(this.speed, deltaT);
    }

    public glowing() : void
    {
        if (this.sprite)
        {
            if (this.canGivePoints)
            {
                this.sprite.scale.set(Math.min(GLOW_MAXIMUM, GLOW_FADE_IN + this.sprite.scale.x),
                                    Math.min(GLOW_MAXIMUM, GLOW_FADE_IN + this.sprite.scale.y), 1);
            }
            else
            {
                this.sprite.scale.set(Math.max(0, this.sprite.scale.x - GLOW_FADE_OUT),
                                    Math.max(0, this.sprite.scale.y - GLOW_FADE_OUT), 1);
            }
        }
    }
}
