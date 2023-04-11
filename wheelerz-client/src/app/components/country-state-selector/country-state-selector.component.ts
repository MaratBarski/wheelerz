import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { InputLineComponent } from '../input-line/input-line.component'
import { map, Observable, tap } from 'rxjs'
import { Country, State } from 'src/app/models/country'
import { DataService } from 'src/app/services/data.service'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-country-state-selector',
  standalone: true,
  imports: [CommonModule, TranslatePipe, InputLineComponent, FormsModule],
  templateUrl: './country-state-selector.component.html',
  styleUrls: ['./country-state-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryStateSelectorComponent implements OnInit {
  dataService = inject(DataService)
  countries$ = this.dataService.getCoutries().pipe(map(res => ([{ name: 'Select Country', id: 0 }, ...res])), tap(res => this.countries = res))
  states$?: Observable<State[]>
  countries!: Country[]
  states!: State[]

  @Output() onCity = new EventEmitter<State>();
  @Output() onCountry = new EventEmitter<Country>();

  @Input() selectedCountry = 0
  @Input() selectedCity = 0

  ngOnInit(): void {
    this.loadStates()
  }

  loadStates(): void {
    this.states$ = this.dataService.getStates(this.selectedCountry)
      .pipe(map(res => ([{ name: 'Select State', id: 0, countryId: 0 }, ...res])), tap(res => this.states = res))
  }

  changeCountry(): void {
    this.selectedCity = 0
    this.changeCity()
    this.loadStates()
    this.onCountry.emit(this.countries.find(x => +x.id === +this.selectedCountry))
  }

  changeCity(): void {
    this.onCity.emit(this.states.find(x => +x.id === +this.selectedCity))
  }
}
