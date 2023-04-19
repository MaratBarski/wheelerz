import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter, inject } from '@angular/core'
import { CommonModule, KeyValue } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { CountryStateSelectorComponent } from '../country-state-selector/country-state-selector.component'
import { Country, State } from 'src/app/models/country'
import { StorySelector } from 'src/app/models/story-selector'
import { DataService } from 'src/app/services/data.service'
import { Observable, tap } from 'rxjs'
import { UserMobility } from 'src/app/models/user-accessibility'
import { RadioComponent } from '../radio/radio.component'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-story-selector',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    CountryStateSelectorComponent,
    RadioComponent,
    FormsModule
  ],
  templateUrl: './story-selector.component.html',
  styleUrls: ['./story-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorySelectorComponent implements OnInit {
  dataService = inject(DataService)

  userMobility$!: Observable<UserMobility>
  mobilities: string[] = []

  mobilitiesValues: KeyValue<any, string>[] = [
    { key: 'yes', value: 'yes' },
    { key: 'no', value: 'no' },
    { key: 'other', value: 'other' }
  ]

  getMobilitiesState(mobility: string): string {
    if (!this.storySelector.mobilities.hasOwnProperty(mobility)) return 'other'
    return this.storySelector.mobilities[mobility] ? 'yes' : 'no'
  }

  @Input() storySelector!: StorySelector

  @Output() onApply = new EventEmitter<StorySelector>()

  changeMobilitiesValue(value: KeyValue<string, string>, mobility: string): void {
    if (value.key === 'other')
      delete this.storySelector.mobilities[mobility]
    else
      this.storySelector.mobilities[mobility] = value.key === 'yes'
  }

  ngOnInit(): void {
    this.userMobility$ = this.dataService.getModilityDefinition().pipe(tap(res => {
      this.mobilities = res.types.map(x => x.name)
    }))
  }

  changeCountry(event: Country): void {
    this.storySelector = { ...this.storySelector, countryId: event.id }
  }

  changeCity(event: State): void {
    this.storySelector = { ...this.storySelector, cityId: event.id }
  }

  aplly(): void {
    this.onApply.emit(this.storySelector)
    //this.dataService.selectStories(this.storySelector).subscribe()
  }
}
