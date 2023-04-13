import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Observable, tap } from 'rxjs'
import { SearchBoxComponent } from 'src/app/components/search-box/search-box.component'
import { StoryCardComponent } from 'src/app/components/story-card/story-card.component'
import { Story } from 'src/app/models/story'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { DataService } from 'src/app/services/data.service'
import { LoaderService } from 'src/app/services/loader.service'

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [CommonModule, StoryCardComponent, TranslatePipe, SearchBoxComponent],
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrendsComponent {
  dataService = inject(DataService)
  stories$!: Observable<Story[]>
  loader = inject(LoaderService)

  search(text: string): void {
    this.loader.load(true)
    this.stories$ = this.dataService.getStories('trends', text).pipe(
      tap(() => {
        this.loader.load(false)
      }))
  }

  ngOnInit(): void {
    this.loader.setShareUrl('trends')
    this.search('')
  }
}
