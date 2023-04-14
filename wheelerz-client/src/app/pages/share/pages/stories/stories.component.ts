import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserInputFormComponent } from 'src/app/components/user-input-form/user-input-form.component'
import { Story, StoryType } from 'src/app/models/story'
import { Router } from '@angular/router'
import { first } from 'rxjs'
import { DataService } from 'src/app/services/data.service'
import { LoaderService } from 'src/app/services/loader.service'

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule, UserInputFormComponent],
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoriesComponent implements OnInit{
  dataService = inject(DataService)
  loaderService = inject(LoaderService)
  router = inject(Router)

  story: Story = {
    storyType: StoryType.story
  }

  ngOnInit(): void {
    this.loaderService.setShareUrl('story')
  }

  onPublish(story: Story): void {
    this.story = story
    this.loaderService.load(true)
    this.dataService.addStory(this.story).pipe(first()).subscribe({
      next: () => {
        this.router.navigateByUrl('/stories')
        this.loaderService.load(false)
      }, error: (er) => {
        this.router.navigateByUrl('/stories')
        this.loaderService.load(false)
      }
    })
  }
}
