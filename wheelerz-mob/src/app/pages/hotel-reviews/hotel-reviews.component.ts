import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { LoaderService } from 'src/app/services/loader.service'
import { StoryListComponent } from 'src/app/components/story-list/story-list.component'

@Component({
  selector: 'app-hotel-reviews',
  standalone: true,
  imports: [CommonModule, StoryListComponent, TranslatePipe],
  templateUrl: './hotel-reviews.component.html',
  styleUrls: ['./hotel-reviews.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HotelReviewsComponent implements OnInit {
  loader = inject(LoaderService)

  ngOnInit(): void {
    this.loader.setShareUrl('hotel-review')
  }

}


