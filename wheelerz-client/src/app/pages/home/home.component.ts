import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from 'src/app/services/loader.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { CountryStateSelectorComponent } from 'src/app/components/country-state-selector/country-state-selector.component';
import { Country, State } from 'src/app/models/country';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslatePipe, CountryStateSelectorComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  loaderService = inject(LoaderService)
  router = inject(Router)
  constructor() {
    this.loaderService.showTopMenu(false)
  }

  countryId = 0
  cityId = 0

  onCity(event: State): void {
    this.cityId = event.id
  }

  onCountry(event: Country): void {
    this.countryId = event.id
  }

  search(): void {
    this.router.navigateByUrl(`stories?city=${this.cityId}&country=${this.countryId}`)
  }


}
