export const ZONE_RADIUS = 1.5;
export const BASE_FRICTION = 0.3;
export const LOW_FRICTION = 0.1;
const DELTA_FRICTION = BASE_FRICTION - LOW_FRICTION;

export class BrushedIce {

    friction : number;
    position : THREE.Vector3;

    constructor(pos : THREE.Vector3)
    {
        this.position = pos;
        this.friction = LOW_FRICTION;
    }

    update(deltaT : number) : boolean
    {
        //One second -> returns to BASE_FRICTION
        this.friction += DELTA_FRICTION * deltaT;
        return this.friction < BASE_FRICTION;
    }

    getFriction(stonePos : THREE.Vector3) : number
    {
        let distance = this.position.clone().sub(stonePos);
        return (distance.length() < ZONE_RADIUS) ? this.friction : BASE_FRICTION;
    }
}
