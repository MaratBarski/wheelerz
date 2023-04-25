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
  countries$!: Observable<Country[]>
  states$?: Observable<State[]>
  countries!: Country[]
  states!: State[]

  @Output() onCity = new EventEmitter<State>();
  @Output() onCountry = new EventEmitter<Country>();

  @Input() selectedCountry = 0
  @Input() selectedCity = 0
  @Input() exists = false
  @Input() storyType = 0

  ngOnInit(): void {
    this.countries$ = this.dataService.getCoutries(this.exists, this.storyType).pipe(map(res => ([{ name: '', id: 0 }, ...res])), tap(res => this.countries = res))
    this.loadStates()
  }

  loadStates(): void {
    this.states$ = this.dataService.getStates(this.selectedCountry, this.exists, this.storyType)
      .pipe(map(res => ([{ name: '', id: 0, countryId: 0 }, ...res])), tap(res => this.states = res))
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
