import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { Observable, tap } from 'rxjs'
import { Story } from 'src/app/models/story'
import { SearchBoxComponent } from 'src/app/components/search-box/search-box.component'
import { StoryCardComponent } from 'src/app/components/story-card/story-card.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { LoaderService } from 'src/app/services/loader.service'

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
  loader = inject(LoaderService)
  stories$!: Observable<Story[]>

  search(text: string): void {
    this.loader.load(true)
    this.stories$ = this.dataService.getStories('trips', text).pipe(
      tap(() => {
      this.loader.load(false)
    }))
  }

  ngOnInit(): void {
    this.search('')
  }
}
