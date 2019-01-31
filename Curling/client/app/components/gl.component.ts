import { Component, OnInit } from '@angular/core';
import { RenderService } from '../services/render.service';
import { MdSnackBar } from '@angular/material';
@Component({
    selector: 'My-GL',
    template: `
        <dashboard></dashboard>
        <!--
        <div>
            <md-card>
                <label for="displaceX">Displacement X</label>
                <md-input type="number" step="10" [(ngModel)]="xmodel" name="displaceX"></md-input>
                <button md-button color="primary" type="button" (click)="displaceX()">Enter</button>
            </md-card>

            <md-card>
                <label for="displaceY">Displacement Y</label>
                <md-input ink="All" type="number" step="10" [(ngModel)]="ymodel" name="displaceY"></md-input>
                <button type="button" md-button color="primary" (click)="displaceY()">Enter</button>
            </md-card>

            <md-card>
                Scale
                <md-slider step="2" min="0" max="200" tick-interval="10" thumb-label>
                </md-slider>
                <button md-button color="secondary" (click)="showNotImplemented()">Apply</button>
            </md-card>

            <md-card>
                <label for="texttoshow">Texte à écrire sur le canevas</label>
                <md-input type="text" [(ngModel)]="webgltext" name="texttoshow"
                    placeholder="Les chemises de l'archiduchesse sont-elles sèches ou archi-sèches ?">
                </md-input>
            </md-card>

            <md-card>
                <label for="displaceCameraZ">Camera Z</label>
                <md-input ink="All" type="number" step="10" [(ngModel)]="zCamera" name="displaceCameraZ"></md-input>
                <button md-button color="primary" type="button" (click)="displaceCameraZ()">Déplacer Caméra</button>
            </md-card>

            <md-card>
                <button md-button color="primary" (click)="newTeapot()"
                        md-tooltip="I dare you to click me">
                Teapot Madness
                </button>
            </md-card>
        </div>-->
        <modifier [container]="container"
                  [webgltext]="webgltext"></modifier>
        <div #container></div>
    `
})
export class GlComponent implements OnInit{
    webgltext: string;
    xmodel: number;
    ymodel: number;
    zCamera: number;
    ngOnInit(): void{
        this.webgltext = "";
        this.xmodel = this.ymodel = 0;
        this.zCamera = 0;
    }
    constructor(private renderService : RenderService,
                private snackbar: MdSnackBar
    ){

    }
   public showNotImplemented(): void{
       this.snackbar.open('Sorry, this is not implemented yet. Would you do it for me? :)', 'Yes');
   }
}
