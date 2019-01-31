import { Injectable } from '@angular/core';

const SOUND_PATH = '/assets/sounds/';
const EXT = '.mp3';

@Injectable()
export class AudioService
{
    listener : THREE.AudioListener;
    loader : THREE.AudioLoader;

    constructor()
    {
        this.listener = new THREE.AudioListener();
        this.loader = new THREE.AudioLoader();
    }

    loadSound(file : string) : Promise<THREE.Audio>
    {
        return new Promise<THREE.Audio>((resolve, error) => {
            this.loader.load(SOUND_PATH + file + EXT,
            (buffer : THREE.AudioBuffer) =>
            {
                let sound = new THREE.Audio(this.listener);
                sound.setBuffer(buffer);
                sound.autoplay = false;
                resolve(sound);
            },
            () => {/*NOTHING TO SEE HERE*/},
            () =>
            {
                error("failed to load " + file + EXT);
            });
        });
    }

    public loadTo(sound : THREE.Audio, file : string)
    {
        this.loadSound(file).then(
            (obj) =>
            {
                sound = obj;
            }).catch((error) => console.log(error));
    }
}
