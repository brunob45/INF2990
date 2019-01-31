import { Injectable } from '@angular/core';

let isTextOutdated : boolean;
let isPerspective : boolean;
let spinClockwise : boolean;
let mouseDown : boolean;
let cheat = false;
let mouseScreenPos : THREE.Vector3;

@Injectable()
export class InputService
{
    constructor()
    {
        isTextOutdated = true;
        mouseDown = false;
        isPerspective = true;
        spinClockwise = false;
        cheat = false;
        mouseScreenPos = new THREE.Vector3(0, 0, 0);
    }

    get isTextOutdated() : boolean
    { return isTextOutdated; }
    set isTextOutdated(val : boolean)
    { isTextOutdated = val; }

    get isPerspective() : boolean
    { return isPerspective; }
    set isPerspective(val : boolean)
    { isPerspective = val; }

    get spinClockwise() : boolean
    { return spinClockwise; }
    set spinClockwise(val : boolean)
    { spinClockwise = val; }

    get cheat() : boolean
    { return cheat; }
    set cheat(val : boolean)
    { cheat = val; }

    get mouseDown() : boolean
    { return mouseDown; }

    get mousePos() : THREE.Vector3
    { return mouseScreenPos.clone(); }
}

if (window)
{
    window.addEventListener('keydown', (event) => {
        let keyName = event.key;
        keyName = keyName.toLowerCase();

        if (keyName === 's')
        {
            spinClockwise = !spinClockwise;
            isTextOutdated = true;
        }
        if (keyName === 'c')
        {
            isPerspective = !isPerspective;
        }
        if (keyName === 'q')
        {
            cheat = true;
        }
    }, false);

    window.addEventListener( 'mousemove', (event) => {
        if (mouseScreenPos !== undefined)
        {
            mouseScreenPos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouseScreenPos.y = -( event.clientY / window.innerHeight ) * 2 + 1;
            mouseScreenPos.z = 0.5;
        }
    }, false );

    window.addEventListener( 'mousedown', (event) => {
        mouseDown = (event.button === 0);
        if (!document.getElementsByClassName("md-card"))
        {
            document.getElementsByTagName('canvas')[0].style.cursor = "none";
        }
    }, false );

    window.addEventListener( 'mouseup', (event) => {
        mouseDown = !(event.button === 0);
        if (!document.getElementsByClassName("md-card"))
        {
            document.getElementsByTagName('canvas')[0].style.cursor = "auto";
        }
    }, false );
}
