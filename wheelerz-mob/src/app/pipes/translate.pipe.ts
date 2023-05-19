import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  translationService = inject(TranslationService);
  transform(value: string | undefined): any {
    return this.translationService.translate(value || '');
  }
}

@Pipe({
  name: 'ta',
  standalone: true
})
export class TranslateAsyncPipe implements PipeTransform {
  translationService = inject(TranslationService);
  transform(value: string | undefined): any {
    return this.translationService.translateAsync(value || '');
  }
}