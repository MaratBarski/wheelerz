import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { first } from 'rxjs'
import { UserInputFormComponent } from 'src/app/components/user-input-form/user-input-form.component'
import { Story, StoryType } from 'src/app/models/story'
import { DataService } from 'src/app/services/data.service'
import { LoaderService } from 'src/app/services/loader.service'

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [CommonModule, UserInputFormComponent],
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrendsComponent {
  dataService = inject(DataService)
  loaderService = inject(LoaderService)
  router = inject(Router)

  story: Story = {
    storyType: StoryType.activity
  }

  onPublish(story: Story): void {
    this.story = story
    this.loaderService.load(true)
    this.dataService.addStory(this.story).pipe(first()).subscribe({
      next: () => {
        this.router.navigateByUrl('/fellow-travelers')
        this.loaderService.load(false)
      }, error: (er) => {
        this.router.navigateByUrl('/fellow-travelers')
        this.loaderService.load(false)
      }
    })
  }
}
