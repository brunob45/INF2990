import { Directive, Input } from '@angular/core';
import { RenderService } from '../services/render.service';

@Directive({
  selector: 'modifier'
})
export class ModifierDirective {
  public scale = 1;
  constructor(private _renderService: RenderService) {
  }

  @Input()
  public set container(value: HTMLElement) {
    if (value)
    {
        this._renderService.init(value);
    }
  }

  @Input()
  public set webgltext(value: string){
    if (!value)
    {
      value = '';
    }
  }
}
