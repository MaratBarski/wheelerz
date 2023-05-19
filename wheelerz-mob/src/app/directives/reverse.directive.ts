import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core'
import { TranslationService } from '../services/translation.service'

@Directive({
  selector: '[appReverse]',
  standalone: true
})
export class ReverseDirective implements OnInit {

  constructor(private elm: ElementRef, private translationService: TranslationService, private render: Renderer2) { }

  ngOnInit(): void {
    if (this.translationService.isRtl) this.render.addClass(this.elm.nativeElement, 'reverse')
  }

}
