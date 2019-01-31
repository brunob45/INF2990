import { Injectable } from '@angular/core';
import { CurlingStone, STONE_RADIUS } from './curlingstone';
import { BrushedIce, BASE_FRICTION } from './brushed-ice';
import { SceneService } from '../services/scene.service';
import { AudioService } from '../services/audio.service';
import { ObjectCreaterService } from '../services/object-creater.service';

export const NUM_ROUNDS = 3;
const NUM_STONES = 8;

const HOUSE_RADIUS = 6;
const POINT_CHECK_RADIUS = HOUSE_RADIUS + STONE_RADIUS;

@Injectable()
export class GameInfo
{
    public name : string;
    public password : string;

    public isHard : boolean;
    public roundNumber : number;
    public stonesBlue : number;
    public stonesRed : number;
    public pointsBlue : number;
    public pointsRed : number;

    public winRed : boolean;
    public winBlue : boolean;

    public zones : BrushedIce[];
    public stones : CurlingStone[];
    public targetStone : CurlingStone;

    constructor(private scene : SceneService,
                private objectCreater : ObjectCreaterService,
                private audio : AudioService)
    {
        this.stones = [];
        this.zones = [];
        this.targetStone = null;

        this.initData();
    }
    initData() : void
    {
        this.name = "";
        this.password = "";
        this.isHard = false;
        this.roundNumber = 0;
        this.stonesBlue = NUM_STONES;
        this.stonesRed = NUM_STONES;
        this.pointsBlue = 0;
        this.pointsRed = 0;
        this.winBlue = false;
        this.winRed = false;
    }

    public countPoints(addPoints = false) : void
    {
		// Only adds points to total in gameInfo when addPoints = true, otherwise simply marks noteworthy stones
        let redClosest = POINT_CHECK_RADIUS;
        let blueClosest = POINT_CHECK_RADIUS;
        this.stones.forEach(
            (value : CurlingStone, index : number, array : CurlingStone[]) =>
            {
                if (value.model)
                {
                    if (value.isTeamRed && redClosest > value.position.length())
                    {
                        redClosest = value.position.length();
                    }
                    else if (!value.isTeamRed && blueClosest > value.position.length())
                    {
                        blueClosest = value.position.length();
                    }
                }
            }
        );

		//Closest stone to the center wins.
        let redWins = redClosest < blueClosest ? true : false;
		//Closest of opposing teams blocks points from being scored.
		//Maximum distance from which winning team's stones can score points.
        let loseClosest = redWins ? blueClosest : redClosest;

        this.stones.forEach(
            (value : CurlingStone, index : number, array : CurlingStone[]) =>
            {
                if (value.model)
                {
                    if (redWins === value.isTeamRed && value.position.length() < loseClosest)
                    {
                        //Glow effect on stones scoring points
                        value.canGivePoints = true;
                        if (addPoints)
                        {
                            if (redWins)
                            {
                                this.pointsRed++;
                            }
                            else
                            {
                                this.pointsBlue++;
                            }
                        }
                    }
                    else
                    {
                        value.canGivePoints = false;
                    }
                }
            }
        );
    }

    public get targetStonePosition() : THREE.Vector3
    {
        if (this.targetStone)
        { return this.targetStone.position; }
        else
        { return new THREE.Vector3(0, 0, 0); }
    }

    public update(deltaT : number) : boolean
    {
        let moving = this.stoneUpdate(deltaT);
        this.frictionUpdate(deltaT);

        return moving;
    }

    private stoneUpdate(deltaT : number) : boolean
    {
        let moving = false;
        this.stones.forEach(
            (value : CurlingStone, index : number, array : CurlingStone[]) =>
            {
                moving = value.physicStep(this.stones, deltaT, this.frictionTest(value)) || moving;
                if (value.outPlay)
                {
                    this.stones.splice(this.stones.indexOf(value), 1);
                    this.scene.removeFromScene(value.model);
                }
            }
        );
        return moving;
    }
    private frictionUpdate(deltaT : number) : void
    {
        this.zones.forEach(
            (value : BrushedIce, index : number, array : BrushedIce[]) =>
            {
                if (!value.update(deltaT))
                {
                    this.zones.splice(this.zones.indexOf(value));
                }
            }
        );
    }
    private frictionTest(stone : CurlingStone) : number
    {
        let friction = BASE_FRICTION;
        this.zones.forEach(
            (value : BrushedIce, index : number, array : BrushedIce[]) =>
            {
                let f = value.getFriction(stone.position);
                if (friction > f)
                {
                    friction = f;
                }
            }
        );
        return friction;
    }

    public newBrushedZone(position : THREE.Vector3) : void
    {
        this.zones.push(new BrushedIce(position));
    }

    public newStone(isRed : boolean)
    {
        let newStone = new CurlingStone(this.objectCreater, this.audio, isRed);
        this.targetStone = newStone;
        this.stones.push(newStone);
    }
    public clearStones() : void
    {
        this.stones.forEach(
            (value : CurlingStone, index : number, array : CurlingStone[]) =>
            {
                this.scene.removeFromScene(value.model);
            }
        );
        this.stones.splice(0, this.stones.length);
    }
}
