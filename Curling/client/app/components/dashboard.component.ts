import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'dashboard',
  template: `
    <nav>
        <modifier [container]="container"
                  [webgltext]="webgltext"></modifier>
        <div #container></div>
    </nav> 
  `
})
export class DashboardComponent implements OnInit{
    private canPlay: boolean;
    constructor(){
      //not empty
    }
    ngOnInit(): void{
        this.canPlay = true;
    }
}
