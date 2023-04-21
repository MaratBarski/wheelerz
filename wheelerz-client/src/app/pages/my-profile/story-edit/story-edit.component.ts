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
import { WizardItem } from 'src/app/models/accesability'
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

  wizard$ = this.accessibilityWizardService.getWizard()
  story$!: Observable<Story>
  story!: Story
  type = 0
  step = 0

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
      tap(res => this.story = res)
    )
  }

  onPublish(s: Story): void {
    //alert(this.type)
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

  onInit(): void {
    this.step = 0
    this.loader.showTopMenu(true)
    this.shareWizardService.shoeTabs(true)
  }

  onDone(wizard: WizardItem[]): void {
    this.story.accessibility = wizard
    this.loader.load(true)
    this.dataService.addStory(this.story).pipe(first()).subscribe({
      next: () => {
        this.router.navigateByUrl('/hotel-reviews')
        this.loader.load(false)
      }, error: (er) => {
        this.router.navigateByUrl('/hotel-reviews')
        this.loader.load(false)
      }
    })
  }
}
