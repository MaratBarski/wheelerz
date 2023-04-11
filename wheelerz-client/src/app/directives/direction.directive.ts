import { Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appDirection]',
  standalone: true
})
export class DirectionDirective implements OnDestroy {

  private destory = new Subject<void>()

  constructor(private elm: ElementRef, private translationService: TranslationService, private render: Renderer2) {
    this.translationService.loadTranslation.pipe(takeUntil(this.destory)).subscribe(() => {
      this.render.setStyle(this.elm.nativeElement, 'direction', this.translationService.direction)
    })
  }

  ngOnDestroy(): void {
    this.destory.next();
  }

}
