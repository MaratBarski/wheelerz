import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EstimationLineComponent } from '../estimation-line/estimation-line.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { StarsComponent } from '../stars/stars.component'
import { InputLineComponent } from '../input-line/input-line.component'
import { Story, StoryType } from 'src/app/models/story'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { InputCommentComponent } from '../input-comment/input-comment.component'
import { RadioComponent } from '../radio/radio.component'
import { FileImage } from 'src/app/models/fileImage'

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
    ReactiveFormsModule],
  templateUrl: './user-input-form.component.html',
  styleUrls: ['./user-input-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInputFormComponent implements OnInit {
  @Input() formTitle = 'share_your_story_with_the_community'
  @Input() estimation = 0
  @Input() css = 'story'
  @Input() isShowName = false
  @Input() story: Story = {
    storyType: StoryType.story
  }
  @Output() onPublish = new EventEmitter<Story>()

  get isValid(): boolean {
    return this.form.valid
  }

  form!: FormGroup

  ngOnInit(): void {
    this.createForm()
  }

  createForm(): void {
    this.form = new FormGroup({
      city: new FormControl(this.story.city || '', [Validators.required, Validators.maxLength(100)]),
      country: new FormControl(this.story.country || '', [Validators.required, Validators.maxLength(100)]),
      startDate: new FormControl(this.story.startDate || '', [Validators.required]),
      endDate: new FormControl(this.story.endDate || '', [Validators.required]),
      name: new FormControl(this.story.name || ''),
      title: new FormControl(this.story.name || ''),
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
}
