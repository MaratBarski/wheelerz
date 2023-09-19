import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Observable, first, tap } from 'rxjs';
import { Country } from 'src/app/models/country';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountriesComponent implements OnInit, OnDestroy {
  dataService = inject(DataService)
  cd = inject(ChangeDetectorRef)
  loader = inject(LoaderService)

  countries$!: Observable<Country[]>

  ngOnInit(): void {
    this.load()
    this.loader.showTopMenu(false)
  }

  ngOnDestroy(): void {
    this.loader.showTopMenu(true)
  }

  load(): void {
    this.loader.load(true)
    this.countries$ = this.dataService.getCoutries().pipe(tap(() => {
      this.loader.load(false)
      this.cd.markForCheck()
    }))

  }

  update(country: Country): void {
    this.dataService.updateCountry(country).pipe(first()).subscribe()
  }

  delete(key: number): void {
    if (confirm('Are you sure?')) {
      this.dataService.deleteCountry(key).pipe(first()).subscribe(() => {
        this.load()
        this.cd.markForCheck()
      })
    }
  }

  add(): void {

  }
}
