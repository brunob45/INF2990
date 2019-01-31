import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { CurlingGame, NUM_ROUNDS } from '../classes/curling-game';
import { InputService } from './input.service';
import { SceneService } from './scene.service';
import { AudioService } from './audio.service';
import { CameraService } from './camera.service';
import { Confetti } from '../classes/confetti';
import { PowerBar } from '../classes/power-bar';

import { CookieService } from 'angular2-cookie/core';

const SERVER_LINK = "http://localhost:3002/";

const ICEWIDTH = 14;
export const HALF_WIDTH = ICEWIDTH / 2;
export const ICELENGHT = 146;
const ICEOFFSET = 30;
export const LAUNCH_Z = 114;
const CENTER_Z = LAUNCH_Z / 2;
const CENTER_ZONE_LENGTH = 72;
export const HOGLINE_FRONT = CENTER_Z + CENTER_ZONE_LENGTH / 2;
export const HOGLINE_BACK = CENTER_Z - CENTER_ZONE_LENGTH / 2;

export const SKYBOXLENGHT = 200;
export const SKYBOXWIDTH = 150;
export const SKYBOXHEIGHT = 52;
const SKYBOX_Y = 25;
export const SKYBOX_Z = 40;
const ERASE_NUMBER = 4;
let oldGame = false;

@Injectable()
export class RenderService {

    private renderer: THREE.WebGLRenderer;
    private confetti : Confetti;
    private powerBar : PowerBar;
    private powerBarDraw : THREE.Mesh;
    private clock : THREE.Clock;
    private dt : number;
    private shapeGroup : THREE.Group;
    private powerBarGraduated : THREE.Mesh;

    private sceneHUD : THREE.Scene;
    private cameraHUD : THREE.OrthographicCamera;

    private font : THREE.Font;
    private textMaterial : THREE.Material;
    private textGroup : THREE.Group;
    private fontLoader : THREE.FontLoader;
    private fontName : string;

    private velocity : number;
    private listener = new THREE.AudioListener();
    private soundVictory = new THREE.Audio( this.listener );
    private soundDefeat = new THREE.Audio( this.listener );
    private soundTie = new THREE.Audio( this.listener );
    private gameover : boolean;

    public user: {name: string, password: string, score: number, difficulty: string} =
    {name: "", password: "", score: 0, difficulty: ""};

    constructor(private http: Http,
                private cookieService: CookieService,
                private game : CurlingGame,
                private input : InputService,
                private scene : SceneService,
                private camera : CameraService,
                private audio : AudioService)
    {
        if (this.cookieService.get('username') != null)
        {
            this.login(this.cookieService.get('username'), this.cookieService.get('password'));
        }
    }

    public init(container: HTMLElement)
    {
        if (!oldGame)
        {
            this.soundVictory.load('/assets/sounds/tada.mp3');
            this.soundDefeat.load('/assets/sounds/trombone.mp3');
            this.soundTie.load('/assets/sounds/soloClap.mp3');

            this.clock = new THREE.Clock();
            this.velocity = 0.3;

            this.renderer = new THREE.WebGLRenderer({antialias: true, devicePixelRatio: window.devicePixelRatio});
            this.renderer.setSize(window.innerWidth * 0.99, window.innerHeight * 0.99, true);
            this.renderer.autoClear = false;
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            this.sceneHUD = new THREE.Scene();
            this.scene.addToScene(new THREE.AmbientLight(0x444444, 0.45));
            for (let i = 0; i < 5; i++)
            {
                let spotlight = new THREE.SpotLight(0xffffff, 1, 300, Math.PI / 6, 2, 4);
                spotlight.position.copy(new THREE.Vector3( 0, 40, i * 30 + 5));
                spotlight.target.position.add(new THREE.Vector3(0, 0, i * 30 + 5));
                spotlight.penumbra = 1;
                spotlight.castShadow = true;
                spotlight.shadow.bias = 0.0001;
                spotlight.shadow.mapSize.width = 1024;
                spotlight.shadow.mapSize.height = 1024;
                this.scene.addToScene(spotlight);
                this.scene.addToScene(spotlight.target);
            }

            let materialArray = [];

            // Need to set the anisotropy to make sure textures aren't blurry
            let maxAnisotropy = this.renderer.getMaxAnisotropy();

            // Positive x
            materialArray.push(new THREE.MeshPhongMaterial({
                map: this.loadTexture("../assets/images/wall.png", maxAnisotropy),
                side: THREE.BackSide
            }));
            // Negative x
            materialArray.push(new THREE.MeshPhongMaterial({
                map: this.loadTexture("../assets/images/wall.png", maxAnisotropy),
                side: THREE.BackSide
            }));
            // Positive y
            materialArray.push(new THREE.MeshPhongMaterial({
                map: this.loadTexture("../assets/images/top2.png", maxAnisotropy),
                side: THREE.BackSide
            }));
            // Negative y
            materialArray.push(new THREE.MeshPhongMaterial({
                map: this.loadTexture("../assets/images/floor.png", maxAnisotropy),
                side: THREE.BackSide
            }));
            // Positive z
            materialArray.push(new THREE.MeshPhongMaterial({
                map: this.loadTexture("../assets/images/backwall.png", maxAnisotropy),
                side: THREE.BackSide
            }));
            // Negative z
            materialArray.push(new THREE.MeshPhongMaterial({
                map: this.loadTexture("../assets/images/backwall.png", maxAnisotropy),
                side: THREE.BackSide
            }));

            let skyboxGeometry = new THREE.BoxGeometry(SKYBOXWIDTH, SKYBOXHEIGHT, SKYBOXLENGHT);
            let skyboxMaterial = new THREE.MeshFaceMaterial(materialArray);
            let skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
            skybox.receiveShadow = true;
            skybox.position.set(0, SKYBOX_Y, SKYBOX_Z);
            this.scene.addToScene(skybox);

            let iceTexture, material;
            iceTexture = this.loadTexture("../assets/images/ice.png", maxAnisotropy);
            material = new THREE.MeshPhongMaterial({ map : iceTexture });
            let plane = new THREE.Mesh(new THREE.PlaneGeometry(ICEWIDTH, ICELENGHT), material);
            plane.material.side = THREE.DoubleSide;
            plane.position.set(0, -0.5, CENTER_Z);
            plane.receiveShadow = true;
            plane.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

            let sidePlane1 = plane.clone();
            let sidePlane2 = plane.clone();
            sidePlane1.position.x = ICEOFFSET;
            sidePlane2.position.x = -ICEOFFSET;

            this.scene.addToScene(sidePlane1);
            this.scene.addToScene(sidePlane2);
            this.scene.addToScene(plane);

            let originHUD = new THREE.Vector3(0, 0, 0);
            this.cameraHUD = new THREE.OrthographicCamera
            (window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0, 30 );
            this.cameraHUD.lookAt(originHUD);
            this.cameraHUD.position.z = 1;

            this.confetti = new Confetti(this.scene);
            this.confetti.confettiInit();
            this.powerBar = new PowerBar();
            this.powerBarDraw = new THREE.Mesh();
            this.sceneHUD.add(this.powerBarDraw);
            this.confetti.ParticleSystem.visible = false;

            this.makePowerBarBackground();

            oldGame = true;
        }
        else
        {
            this.sceneHUD.remove(this.shapeGroup);
            if (this.game.powerBarDraw)
            {
                this.clearGroup(this.shapeGroup);
                this.shapeGroup.add(this.game.powerBarDraw);
            }
            this.sceneHUD.remove(this.textGroup);
            this.clearGroup(this.textGroup);
        }

        this.gameover = false;
        this.game.gameInfo.name = this.cookieService.get('username');
        this.game.gameInfo.password = this.cookieService.get('password');

        if (this.cookieService.get('difficulty') === 'hard')
        {
            this.game.gameInfo.isHard = true;
        }
        else if (this.cookieService.get('difficulty') === 'normal')
        {
            this.game.gameInfo.isHard = false;
        }

        this.fontLoader = new THREE.FontLoader();
        this.textMaterial = new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            opacity: 0.8
        } );
        this.textGroup = new THREE.Group();
        this.shapeGroup = new THREE.Group();

        this.sceneHUD.add( this.textGroup );
        this.fontName = 'facile_sans_regular';
        this.createHUD();

        if (container.getElementsByTagName('canvas').length === 0)
        {
            container.appendChild(this.renderer.domElement);
        }
        this.clock.start();
        this.animate();

        window.addEventListener('resize', _ => this.onWindowResize());
    }

    login(username: string, password: string): void
    {
        let body = "name=" + username + "&pass=" + password;
        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        this.http.post(SERVER_LINK + "login", body, {headers: headers}).subscribe(data =>
        {
            if (JSON.parse(data.json()))
            {
                this.user.name = username;
                this.user.password = password;
                this.cookieService.put("username", username);
                this.cookieService.put("password", password);
            }
            else
            {
                window.alert("Le nom d'utilisateur ou le mot de passe est invalide!");
            }
        });
    }

    loadTexture (url: string, maxAnisotropy: number) : THREE.Texture
    {
        let loader = new THREE.TextureLoader();
        let texture = loader.load(url);
        texture.anisotropy = maxAnisotropy;
        return texture;
    }

    animate() : void
    {
        window.requestAnimationFrame(_ => this.animate());
        this.dt = this.clock.getDelta();
        this.avancer(this.dt);
        this.moveCamera();
        this.makePowerBar();

        if (!this.gameover && (this.game.isTextOutdated || this.input.isTextOutdated))
        {
            this.createHUD();
            this.game.isTextOutdated = false;
            this.input.isTextOutdated = false;
        }

        this.confettiFall();
        this.render();
    }

    private makePowerBar() : void{
        if (this.game.powerBarDraw)
        {
            this.sceneHUD.remove(this.shapeGroup);
            this.clearGroup(this.shapeGroup);
            this.shapeGroup.add(this.game.powerBarDraw);
            this.sceneHUD.add(this.shapeGroup);
        }
    }

    private confettiFall() : void
    {
        if (this.confetti.ParticleSystem && this.game.gameInfo.winRed)
        {
            this.velocity *= 1.00002;
            this.confetti.ParticleSystem.position.y -= this.velocity;
            if (this.confetti.ParticleSystem.position.y < -SKYBOXHEIGHT)
            {
                this.confetti.ParticleSystem.position.y = SKYBOXHEIGHT;
                this.confetti.ParticleSystem.visible = false;
                this.game.gameInfo.winRed = false;
            }
        }
    }

    private avancer(deltaT : number): void
    {
        this.game.update(deltaT);
    }

    private moveCamera() : void
    {
        this.game.gameInfo.targetStone ?
            this.camera.moveCamera(this.game.gameInfo.targetStonePosition.z) :
            this.camera.moveCamera(0);
    }

    private onWindowResize() : void
    {
        let factor = 1;
        let newWidth : number = window.innerWidth * factor;
        let newHeight : number = window.innerHeight * factor;
        this.camera.resizeUpdate(newWidth, newHeight);

        this.makePowerBarBackground();
        this.game.isTextOutdated = true;

        this.orthographicWindowResize(this.cameraHUD);
        this.renderer.setSize(newWidth, newHeight);
    }

    private orthographicWindowResize(cam: THREE.OrthographicCamera): void
    {
        cam.left = -window.innerWidth / 2;
        cam.right = window.innerWidth / 2;
        cam.top = window.innerHeight / 2;
        cam.bottom = -window.innerHeight / 2;
        cam.updateProjectionMatrix();
    }

    private render(): void
    {
        this.renderer.clear();
        this.renderer.render(this.scene.getScene(), this.camera.getCamera(this.input.isPerspective));
        this.renderer.render(this.sceneHUD, this.cameraHUD);
    }

    private makePowerBarBackground() : void
    {
        this.sceneHUD.remove(this.powerBarGraduated);
        let newPowerBarGraduated = this.powerBar.makeGraduatedBar();
        this.powerBarGraduated = newPowerBarGraduated;
        this.sceneHUD.add(this.powerBarGraduated);
    }

    private clearGroup (group : THREE.Group) : void
    {
        for (let j = 0; j < ERASE_NUMBER; j ++)
        {
            for (let i = 0; i < group.children.length; i++)
            {
                group.remove(group.children[i]);
            }
        }
    }

    private createHUD() : void
    {
        this.fontLoader.load('/assets/fonts/facile_sans_regular.typeface.json', r => {
            this.sceneHUD.remove(this.textGroup);
            this.clearGroup(this.textGroup);
            this.font = new THREE.Font(r);
            let f = Object(r);
            let textSize = (window.innerHeight / 10);
            let options = {
                font: f as THREE.Font,
                size: textSize,
                height: 0.99,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: false
            };

            this.printScore(options);
            this.printRedStones(options);
            this.printBlueStones(options);
            this.printSpin(options);
            this.printWinner(options);
            this.printPlayer(options);
            this.printCPU(options);
            this.printRound(options);
            this.printControlSpin(options);
            this.printControlCamera(options);
            this.sceneHUD.add(this.textGroup);
        });
    }

    private printScore (options : THREE.TextGeometryParameters)
    {
        let score = this.game.gameInfo.pointsRed + ' - ' + this.game.gameInfo.pointsBlue;
        let textGeo = new THREE.TextGeometry(score, options);
        let offsetScoreY = this.textOffset(textGeo, 'y');
        this.printText(textGeo, 0, window.innerHeight / 2 + offsetScoreY);
    }

    private printRedStones (options : THREE.TextGeometryParameters)
    {
        let redStones = String(this.game.gameInfo.stonesRed);
        let textGeo = new THREE.TextGeometry(redStones, options);
        let offsetY = this.textOffset(textGeo, 'y');
        let offsetX = this.textOffset(textGeo, 'x');
        this.printText(textGeo, window.innerWidth / -2 - offsetX, window.innerHeight / -2 - offsetY);
    }

    private printBlueStones (options : THREE.TextGeometryParameters)
    {
        let blueStones = String(this.game.gameInfo.stonesBlue);
        let textGeo = new THREE.TextGeometry(blueStones, options);
        let offsetY = this.textOffset(textGeo, 'y');
        let offsetX = this.textOffset(textGeo, 'x');
        this.printText(textGeo, window.innerWidth / 2 + offsetX, window.innerHeight / -2 - offsetY);
    }

    private printSpin (options : THREE.TextGeometryParameters)
    {
        let spinDirection = this.input.spinClockwise ? "<-" : "->";
        let textGeo = new THREE.TextGeometry(spinDirection, options);
        let offsetY = this.textOffset(textGeo, 'y');
        let offsetX = this.textOffset(textGeo, 'x');
        this.printText(textGeo, window.innerWidth / -2 - 4 * offsetX, window.innerHeight / -2 - offsetY);
    }

    private printWinner (options : THREE.TextGeometryParameters)
    {
        if (this.game.gameInfo.roundNumber > NUM_ROUNDS)
        {
            this.gameover = true;
            let winner = "";
            if (this.game.gameInfo.winRed)
            {
                winner = "Victoire!";
                this.confetti.ParticleSystem.visible = true;
                this.soundVictory.play();
            }
            else if (this.game.gameInfo.winBlue)
            {
                winner = "Défaite.";
                this.soundDefeat.play();
            }
            else
            {
                winner = "Partie nulle.";
                this.soundTie.play();
            }
            let textGeo = new THREE.TextGeometry(winner, options);
            this.printText(textGeo, 0, 0);
        }
    }

    private printPlayer (options : THREE.TextGeometryParameters)
    {
        options.size = options.size / 2;
        let name = this.game.gameInfo.name;
        let textGeo = new THREE.TextGeometry(name, options);
        let offsetY = this.textOffset(textGeo, 'y');
        let offsetX = this.textOffset(textGeo, 'x');
        this.printText(textGeo, window.innerWidth / -2 - offsetX, window.innerHeight / 2 + offsetY);
    }

    private printCPU (options : THREE.TextGeometryParameters)
    {
        let cpu = this.game.gameInfo.isHard ? "Difficile" : "Normal";
        let textGeo = new THREE.TextGeometry(cpu, options);
        let offsetY = this.textOffset(textGeo, 'y');
        let offsetX = this.textOffset(textGeo, 'x');
        this.printText(textGeo, window.innerWidth / 2 + offsetX, window.innerHeight / 2 + offsetY);
    }

    private printRound (options : THREE.TextGeometryParameters)
    {
        let round = "";
        round = (this.game.gameInfo.roundNumber > NUM_ROUNDS) ? round = String(NUM_ROUNDS) :
            round = String(this.game.gameInfo.roundNumber);
        let textGeo = new THREE.TextGeometry(round, options);
        let offsetY = this.textOffset(textGeo, 'y');
        this.printText(textGeo, 0, window.innerHeight / 2 + offsetY * 5);
    }

    private printControlCamera (options : THREE.TextGeometryParameters)
    {
        let controls = "C pour alterner la camera";
        options.size = 10;
        let textGeo = new THREE.TextGeometry(controls, options);
        let offsetX = this.textOffset(textGeo, 'x');
        this.printText(textGeo, - offsetX - window.innerWidth / 2, window.innerHeight / 2.5);
    }

    private printControlSpin (options : THREE.TextGeometryParameters)
    {
        let controls = "S pour alterner le spin";
        options.size = 10;
        let textGeo = new THREE.TextGeometry(controls, options);
        let offsetX = this.textOffset(textGeo, 'x');
        let offsetY = this.textOffset(textGeo, 'y');
        this.printText(textGeo, - offsetX - window.innerWidth / 2, window.innerHeight / 2.5 + offsetY * 3);
    }

    public textOffset (textGeo : THREE.TextGeometry, coordonate : string) : number
    {
        let offset = 0;
        textGeo.computeBoundingBox();
        if (coordonate === 'x')
        {
            offset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
        }
        else if (coordonate === 'y')
        {
            offset = -0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );
        }
        return offset;
    }

    public printText(textGeo : THREE.TextGeometry, posX : number, posY: number) : void
    {
        this.textMaterial.transparent = true;
        let textMesh = new THREE.Mesh( textGeo, this.textMaterial );
        textGeo.computeBoundingBox();
        let centerOffsetX = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
        let centerOffsetY = -0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );
        textMesh.position.x = posX + centerOffsetX;
        textMesh.position.y = posY + centerOffsetY;
        textMesh.position.z = 0;
        this.textGroup.add( textMesh );
    }
}
