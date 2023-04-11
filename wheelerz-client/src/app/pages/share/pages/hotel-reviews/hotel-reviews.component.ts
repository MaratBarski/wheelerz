import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AccessibilityWizardComponent } from 'src/app/components/accessibility-wizard/accessibility-wizard.component'
import { AccessibilityWizardService } from 'src/app/services/accessibility-wizard.service'
import { WizardItem } from 'src/app/models/accesability'
import { UserInputFormComponent } from 'src/app/components/user-input-form/user-input-form.component'
import { Story, StoryType } from 'src/app/models/story'
import { DataService } from 'src/app/services/data.service'
import { first } from 'rxjs'
import { Router } from '@angular/router'
import { LoaderService } from 'src/app/services/loader.service'

@Component({
  selector: 'app-hotel-reviews',
  standalone: true,
  imports: [CommonModule, AccessibilityWizardComponent, UserInputFormComponent],
  templateUrl: './hotel-reviews.component.html',
  styleUrls: ['./hotel-reviews.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotelReviewsComponent {
  accessibilityWizardService = inject(AccessibilityWizardService)
  dataService = inject(DataService)
  loaderService = inject(LoaderService)
  router = inject(Router)

  wizard$ = this.accessibilityWizardService.getWizard()
  story: Story = {
    storyType: StoryType.hotel
  }
  step = 0

  onDone(wizard: WizardItem[]): void {
    this.story.accessibility = wizard
    this.loaderService.load(true)
    this.dataService.addStory(this.story).pipe(first()).subscribe({
      next: () => {
        this.router.navigateByUrl('/hotel-reviews')
        this.loaderService.load(false)
      }, error: (er) => {
        this.router.navigateByUrl('/hotel-reviews')
        this.loaderService.load(false)
      }
    })
  }

  onPublish(story: Story): void {
    this.story = story
    this.step = 1
  }

  onInit(): void {
    this.step = 0
  }
}
