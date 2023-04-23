import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { Observable, first, map, tap } from 'rxjs'
import { Story } from 'src/app/models/story'
import { ActivatedRoute, Router } from '@angular/router'
import { UserInputFormComponent } from 'src/app/components/user-input-form/user-input-form.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { LoaderService } from 'src/app/services/loader.service'
import { UserService } from 'src/app/services/user.service'
import { StoryUrls } from 'src/app/consts'
import { ShareWizardService } from '../../share/share-wizard.service'
import { WizardItem, WizardRadioItem } from 'src/app/models/accesability'
import { AccessibilityWizardService } from 'src/app/services/accessibility-wizard.service'
import { AccessibilityWizardComponent } from 'src/app/components/accessibility-wizard/accessibility-wizard.component'

@Component({
  selector: 'app-story-edit',
  standalone: true,
  imports: [CommonModule, UserInputFormComponent, TranslatePipe, AccessibilityWizardComponent],
  templateUrl: './story-edit.component.html',
  styleUrls: ['./story-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ShareWizardService]
})
export class StoryEditComponent implements OnInit {
  dataService = inject(DataService)
  userService = inject(UserService)
  activatedRoute = inject(ActivatedRoute)
  loader = inject(LoaderService)
  router = inject(Router)
  shareWizardService = inject(ShareWizardService)
  accessibilityWizardService = inject(AccessibilityWizardService)

  wizard?: WizardItem[]
  story$!: Observable<Story>
  story!: Story
  type = 0
  step = 0

  get isHotel(): boolean {
    return this.type === 2
  }

  get isAddPhotoEnable(): boolean {
    return !this.isHotel
  }

  get storyBackUrl(): string {
    return StoryUrls[this.type].view
  }

  ngOnInit(): void {
    const id = +(this.activatedRoute.snapshot.paramMap.get('id') || '0')
    this.story$ = this.dataService.getStoryById(id).pipe(
      tap(res => {
        if (this.userService.isAdmin) this.type = res.storyType || 0
      }),
      map((res) => {
        return { ...res, photos: res.storyPhotos?.map(x => ({ id: x.id, small: x.small, fileName: x.fileName })) }
      }),
      tap(res => this.story = res),
      tap(res => {
        this.accessibilityWizardService.getWizard().pipe(first()).subscribe(wz => {
          this.wizard = wz
          if (!res.accessibility) return
          for (let i = 0; i < this.wizard.length; i++) {
            this.wizard[i].comments = res.accessibility[i].comments
            this.wizard[i].id = res.accessibility[i].id
            this.wizard[i].photos = res.accessibility[i].files
            this.wizard[i].files = res.accessibility[i].files
            this.updateWizardItems(this.wizard[i].accessibilityItems, res.accessibility[i].accessibilityItems)
          }
        })
      })
    )
  }

  updateWizardItems(items: WizardRadioItem[] | undefined, res: WizardRadioItem[] | undefined): void {
    if (!items) return
    if (!res) return
    for (let j = 0; j < items.length; j++) {
      items[j].selectedKey = res[j].selectedKey
      items[j].selectedValue = res[j].selectedValue
    }
  }

  savePost(s: Story): void {
    this.loader.load(true)
    s.storyPhotos = undefined
    this.dataService.updateStory(s).pipe(first()).subscribe({
      next: () => {
        this.loader.load(false)
        this.router.navigateByUrl(`${this.storyBackUrl}`)
      },
      error: () => {
        this.loader.load(false)
      }
    })
  }

  onPublish(story: Story): void {
    if (!this.isHotel) {
      this.savePost(story)
      return
    }
    this.startWizard(story)
  }

  startWizard(story: Story): void {
    this.story = story
    this.step = 1
    this.loader.showTopMenu(false)
    this.shareWizardService.showTabs(false)
  }

  onInit(): void {
    this.step = 0
    this.loader.showTopMenu(true)
    this.shareWizardService.showTabs(true)
  }

  onDone(wizard: WizardItem[]): void {
    this.story.accessibility = wizard
    this.savePost(this.story)
  }
}
