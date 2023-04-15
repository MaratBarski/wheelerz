import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { LoaderService } from 'src/app/services/loader.service'
import { StoryListComponent } from 'src/app/components/story-list/story-list.component'

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule, StoryListComponent, TranslatePipe],
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoriesComponent {
  loader = inject(LoaderService)

  ngOnInit(): void {
    this.loader.setShareUrl('story')
  }
}
