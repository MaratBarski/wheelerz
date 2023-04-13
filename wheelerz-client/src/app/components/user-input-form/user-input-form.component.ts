import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EstimationLineComponent } from '../estimation-line/estimation-line.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { StarsComponent } from '../stars/stars.component'
import { InputLineComponent } from '../input-line/input-line.component'
import { Story, StoryType } from 'src/app/models/story'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InputCommentComponent } from '../input-comment/input-comment.component'
import { RadioComponent } from '../radio/radio.component'
import { FileImage } from 'src/app/models/fileImage'
import { CountryStateSelectorComponent } from '../country-state-selector/country-state-selector.component'
import { Country, State } from 'src/app/models/country'
import { DateTimeService } from 'src/app/services/date-time.service'
import { DateSelectorComponent } from '../date-selector/date-selector.component'

@Component({
  selector: 'app-user-input-form',
  standalone: true,
  imports: [CommonModule,
    EstimationLineComponent,
    InputLineComponent,
    TranslatePipe,
    StarsComponent,
    FormsModule,
    InputCommentComponent,
    RadioComponent,
    ReactiveFormsModule,
    CountryStateSelectorComponent,
    DateSelectorComponent
  ],
  templateUrl: './user-input-form.component.html',
  styleUrls: ['./user-input-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInputFormComponent implements OnInit {
  @Input() formTitle = 'share_your_story_with_the_community'
  @Input() css = 'story'
  @Input() isShowName = false
  @Input() files: FileImage[] = []
  @Input() story: Story = {
    storyType: StoryType.story,
    estimation: 0
  }
  @Output() onPublish = new EventEmitter<Story>()

  dateTimeService = inject(DateTimeService)

  get isValid(): boolean {
    return this.form.valid
  }

  form!: FormGroup

  ngOnInit(): void {
    this.createFiles()
    this.createForm()
  }

  createFiles(): void {
    if (!this.story.storyPhotos?.length) return;
    this.files = this.story.storyPhotos.map(x => ({ small: x.small, id: x.id, fileName: x.fileName }))
  }

  createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(this.story.name || ''),
      title: new FormControl(this.story.title || ''),
      comments: new FormControl(this.story.comments || '')
    })
  }

  changeEstimation(est: number): void {
    this.story.estimation = est
  }

  publish(): void {
    const story: Story = { ...this.story, ...this.form.getRawValue() }
    this.onPublish.emit(story)
  }

  cancel(): void {
    this.form.reset();
  }

  onImageUpdates(images: FileImage[]): void {
    this.story.photos = images
  }

  onCountry(value: Country): void {
    this.story.countryId = +value.id
  }

  onCity(value: State): void {
    this.story.cityId = +value.id
  }

  startDateSelected(date: Date): void {
    this.story.startDate = date
    this.story.startDateDisplay = this.dateTimeService.dateToString(date)
  }

  endDateSelected(date: Date): void {
    this.story.endDate = date
    this.story.endDateDisplay = this.dateTimeService.dateToString(date)
  }
  
}
