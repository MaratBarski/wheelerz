import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StoryCardComponent } from 'src/app/components/story-card/story-card.component'
import { Observable, tap } from 'rxjs'
import { Story } from 'src/app/models/story'
import { DataService } from 'src/app/services/data.service'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { SearchBoxComponent } from 'src/app/components/search-box/search-box.component'
import { LoaderService } from 'src/app/services/loader.service'

@Component({
  selector: 'app-hotel-reviews',
  standalone: true,
  imports: [CommonModule, StoryCardComponent, TranslatePipe, SearchBoxComponent],
  templateUrl: './hotel-reviews.component.html',
  styleUrls: ['./hotel-reviews.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HotelReviewsComponent implements OnInit {

  dataService = inject(DataService)
  stories$!: Observable<Story[]>
  loader = inject(LoaderService)

  search(text: string): void {
    this.loader.load(true)
    this.stories$ = this.dataService.getStories('hotels', text).pipe(
      tap(() => {
      this.loader.load(false)
    }))
  }

  ngOnInit(): void {
    this.search('')
  }

}


