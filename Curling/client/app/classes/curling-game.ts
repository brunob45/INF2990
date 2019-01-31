import { Injectable } from '@angular/core';

import { InputService } from '../services/input.service';
import { SceneService } from '../services/scene.service';
import { Mouse3DService } from '../services/mouse3d.service';
import { GameInfo } from './game-info';
import { CurlingStone } from './curlingstone';
import { AimLine } from './aim-line';
import { Brush } from './brush';
import { PowerBar } from './power-bar';

import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

const SERVER_LINK = "http://localhost:3002/";

interface ScoreData
{
  username: string;
  score: number;
}

let isTextOutdated : boolean;

let COLOR_RED = new THREE.Color( 0xbb5555 );
let COLOR_BLU = new THREE.Color( 0x5555bb );

enum State { Start, Launch, Brush, WaitAI, LaunchAI, End }

const HOUSE_RADIUS = 6;
const PERFECT_FORCE = 0.827;
const FORCE_TO_PUSH = 0.86;
const PERFECT_RADIUS = -0.027;

export const NUM_ROUNDS = 3;
const NUM_STONES = 8;

let force = 0;
let angle = 0;
let lightAdded = false;

@Injectable()
export class CurlingGame
{
    private isReady = false;

    private powerBar : PowerBar;
    public powerBarDraw : THREE.Mesh;
    private gameState : State;
    private objectLoader : THREE.ObjectLoader;

    private stoneLight : THREE.SpotLight;

    private time : number;

    private score : number;
    highScoresEasy: ScoreData[];
    highScoresHard: ScoreData[];

    constructor(private http: Http,
                private router: Router,
                private mouse3d : Mouse3DService,
                private input : InputService,
                private scene : SceneService,
                private aimLine : AimLine,
                public gameInfo : GameInfo,
                private brush : Brush)
    {
        this.objectLoader = new THREE.ObjectLoader();
        this.powerBar = new PowerBar();
        this.powerBarDraw = new THREE.Mesh();
        isTextOutdated = true;

        if (!lightAdded)
        {
            this.stoneLight = new THREE.SpotLight(0x888888, 0.6, 1000, 0.01, 1, 1);
            this.stoneLight.position.copy(new THREE.Vector3(0, 80, 0));
            this.stoneLight.penumbra = 0.3;
            this.stoneLight.castShadow = true;
            this.scene.addToScene(this.stoneLight);
            lightAdded = true;
        }

        this.isReady = true;

        this.resetGame();
        this.nextStone();
    }

    get isTextOutdated() : boolean
    { return isTextOutdated; }
    set isTextOutdated(val : boolean)
    { isTextOutdated = val; }

    update(deltaT : number) : void
    {
        this.animateStones();

        this.lightUpdate();

        if (this.gameState === State.Launch)
        {
            angle = this.aimLine.update();
            this.tryLaunchPlayer();
        }
        else if (this.gameState === State.WaitAI)
        {
            let that = this;
            setTimeout(function(){ that.changeState(State.LaunchAI); }, 2000);
        }
        else if (this.gameState === State.LaunchAI)
        {
            this.tryLaunchIA();
        }
        else if (this.gameState === State.Brush)
        {
            this.brush.update(deltaT);
        }

        let moving = this.gameInfo.update(deltaT);
        let stopped = this.gameInfo.targetStone && !moving && this.gameInfo.targetStone.ready;
        if ((this.gameState === State.Brush || this.gameState === State.LaunchAI) && stopped)
        {
            this.nextStone();
            this.isTextOutdated = true;
        }
        this.gameInfo.countPoints();
    }

    private lightUpdate() : void
    {
        if (this.gameInfo.targetStone === null || this.gameInfo.targetStone.outPlay)
        {
            this.stoneLight.intensity *= 0.98;
        }
        else
        {
            this.stoneLight.intensity = Math.min(1 , this.stoneLight.intensity * 1.2);
            if (this.gameInfo.targetStone.model)
            {
                this.stoneLight.target = this.gameInfo.targetStone.model;
            }
            this.stoneLight.color.copy(this.gameInfo.targetStone.isTeamRed ? COLOR_RED : COLOR_BLU);
        }
    }

    private tryLaunchPlayer() : void
    {
        if (this.gameInfo.targetStone && !this.gameInfo.targetStone.ready)
        {
            this.time = 0;
            if (this.input.cheat)
            {
                this.gameInfo.targetStone.launch(PERFECT_FORCE, false, PERFECT_RADIUS);
                this.input.cheat = false;
                this.changeState(State.Brush);
            }
            else if (this.input.mouseDown)
            {
                force += force < 1 ? 0.01 : 0;
                this.powerBarDraw = this.powerBar.makeShape(force, 0xFF0000);
            }
            else
            {
                if (force > 0.3)
                {
                    this.gameInfo.targetStone.launch(force, this.input.spinClockwise, angle);
                    this.changeState(State.Brush);
                }
                force = 0;
            }
        }
        else
        {
            force = 0;
        }
    }

    private preciseLaunch() : void
    {
        let idxCloser = 0;
        this.gameInfo.stones.forEach(
        (value : CurlingStone, index : number, array : CurlingStone[]) =>
            {
                if (value.isTeamRed && value.position.length() <= HOUSE_RADIUS
                    && value.position.z >= this.gameInfo.stones[idxCloser].position.z)
                {
                    idxCloser = index;
                }
            }
        );
        if (this.gameInfo.stones[idxCloser].position.length() <= HOUSE_RADIUS)
        {
            this.gameInfo.targetStone.launch(FORCE_TO_PUSH, false, PERFECT_RADIUS +
            Math.atan( this.gameInfo.stones[idxCloser].position.x /
            (this.gameInfo.targetStonePosition.z - this.gameInfo.stones[idxCloser].position.z) ));
        }
        else
        {
            this.gameInfo.targetStone.launch(PERFECT_FORCE, false, PERFECT_RADIUS);
        }
    }

    private tryLaunchIA() : void
    {
        if (this.gameInfo.targetStone && !this.gameInfo.targetStone.ready)
        {
            if (this.gameInfo.isHard)
            {
                this.preciseLaunch();
            }
            else
            {
                let randomForce = PERFECT_FORCE + Math.random() * 0.2 - Math.random() * 0.2;
                let randomAngle = PERFECT_RADIUS + Math.random() * 0.1 - Math.random() * 0.1;
                this.gameInfo.targetStone.launch(randomForce, false, randomAngle);
            }
        }
        this.powerBarDraw = this.powerBar.makeShape(force, 0);
    }

    private nextStone() : void
    {
        this.gameInfo.targetStone = null;
        if (this.gameState === State.Brush)
        {
            this.changeState(State.WaitAI);
        }
        else if (this.gameState === State.LaunchAI)
        {
            this.changeState(State.Launch);
        }
        let stonesRemaining = Math.max(this.gameInfo.stonesRed, this.gameInfo.stonesBlue);
        if (stonesRemaining === 0)
        {
            this.nextRound();
        }
        if (this.gameState !== State.End)
        {
            let isPlayersTurn = this.gameState === State.Launch;
            this.gameInfo.newStone(isPlayersTurn);
            isPlayersTurn ? this.gameInfo.stonesRed-- : this.gameInfo.stonesBlue-- ;
        }
    }

    private nextRound() : void
    {
        this.gameInfo.countPoints(true);
        this.gameInfo.roundNumber++;
        if (this.gameInfo.roundNumber > NUM_ROUNDS)
        {
            this.changeState(State.End);
        }
        else
        {
            this.resetRound();
        }
    }

    private setWinner() : void
    {
        if (this.gameInfo.pointsRed > this.gameInfo.pointsBlue)
        {
            this.gameInfo.winRed = true;
            this.score = this.gameInfo.pointsRed;
        }
        else if (this.gameInfo.pointsRed < this.gameInfo.pointsBlue)
        {
            this.gameInfo.winBlue = true;
            this.score = 0;
        }
        else if (this.gameInfo.pointsRed === this.gameInfo.pointsBlue)
        {
            this.score = 0;
        }
    }

    sceneScore() : void
    {
        let body = "name=" + this.gameInfo.name
        + "&pass=" + this.gameInfo.password
        + "&score=" + this.score
        + "&isHard=" + this.gameInfo.isHard;

        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        this.http.post(SERVER_LINK + "sendHighScores", body, {headers: headers}).subscribe(data =>
            { /*NOTHING TO SEE HERE*/ }
        );
    }

    private resetRound()
    {
        this.clearStones();
        this.gameInfo.stonesBlue = NUM_STONES;
        this.gameInfo.stonesRed = NUM_STONES;

        let random = Math.random();
        if (random > 0.5)
        {
            this.changeState(State.Launch);
        }
        else
        {
             this.changeState(State.WaitAI);
        }
    }

    private resetGame()
    {
        this.resetRound();
        this.gameInfo.roundNumber = 1;
        this.gameInfo.pointsBlue = 0;
        this.gameInfo.pointsRed = 0;
    }

    private changeState(state : State) : void
    {
        this.gameState = state;
        switch (this.gameState)
        {
        case State.Start:
            this.aimLine.visible = false;
            this.brush.visible = false;
            break;
        case State.Launch:
            this.aimLine.visible = true;
            break;
        case State.Brush:
            this.aimLine.visible = false;
            this.brush.visible = true;
            break;
        case State.WaitAI:
            this.aimLine.visible = false;
            this.brush.visible = false;
            break;
        case State.LaunchAI:
            break;
        case State.End:
            this.aimLine.visible = false;
            this.brush.visible = false;
            this.setWinner();
            let that = this;
            setTimeout(function(){ that.router.navigate(['./gameover']); }, 5000);
            setTimeout(function(){ that.resetGame(); }, 5000);
            setTimeout(function(){ that.nextStone(); }, 5001);
            break;
        }
    }

    private animateStones() : void
    {
        if (this.gameInfo.winRed === true)
        {
        this.gameInfo.stones.forEach(
            (value : CurlingStone, index : number, array : CurlingStone[]) =>
            {
                if (value.isTeamRed)
                {
                    value.victoryAnimation();
                }
            }
        );
        }
    }

    private clearStones() : void
    {
        this.gameInfo.stones.forEach(
            (value : CurlingStone, index : number, array : CurlingStone[]) =>
            {
                this.scene.removeFromScene(value.model);
            }
        );
        this.gameInfo.stones.splice(0, this.gameInfo.stones.length);
    }
}
