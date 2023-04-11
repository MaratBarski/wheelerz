import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StoryCardComponent } from 'src/app/components/story-card/story-card.component'
import { Observable } from 'rxjs'
import { Story } from 'src/app/models/story'
import { DataService } from 'src/app/services/data.service'
import { FormsModule } from '@angular/forms'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { SearchBoxComponent } from 'src/app/components/search-box/search-box.component'

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

  search(text: string): void {
    this.stories$ = this.dataService.getStories('hotels', text)
  }

  ngOnInit(): void {
    this.search('')
  }

}


