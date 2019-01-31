import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';

@Component({
    selector: 'difficulty',
    templateUrl: 'assets/templates/difficulty-component-template.html',
    styleUrls: ['assets/stylesheets/difficulty-component-stylesheet.css']
})

export class DifficultyComponent {
    constructor(private http: Http, private router: Router, private cookieService: CookieService){
        this.cookieService.remove("difficulty");
    }
    hardEvent(){
        this.cookieService.put("difficulty", "hard");
        this.router.navigate(['./dashboard']);
    }

    normalEvent(){
        this.cookieService.put("difficulty", "normal");
        this.router.navigate(['./dashboard']);
    }
}
