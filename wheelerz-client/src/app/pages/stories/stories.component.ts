import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { Observable } from 'rxjs'
import { Story } from 'src/app/models/story'
import { SearchBoxComponent } from 'src/app/components/search-box/search-box.component'
import { StoryCardComponent } from 'src/app/components/story-card/story-card.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule, StoryCardComponent, TranslatePipe, SearchBoxComponent],
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoriesComponent {
  dataService = inject(DataService)
  stories$!: Observable<Story[]>

  search(text: string): void {
    this.stories$ = this.dataService.getStories('trips', text)
  }

  ngOnInit(): void {
    this.search('')
  }
}
