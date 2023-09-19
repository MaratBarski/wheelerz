import { Pipe, PipeTransform, inject } from '@angular/core';
import { Country } from '../models/country';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'country',
  standalone: true
})
export class CountryPipe implements PipeTransform {
  us = inject(TranslationService)
  transform(value: Country): string | undefined {
    return this.us.isRtl ? value.hebname : value.name
  }

}
