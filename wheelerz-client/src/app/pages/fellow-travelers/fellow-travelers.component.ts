import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'
import { SearchBoxComponent } from 'src/app/components/search-box/search-box.component'
import { StoryCardComponent } from 'src/app/components/story-card/story-card.component'
import { Story } from 'src/app/models/story'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { DataService } from 'src/app/services/data.service'
import { LoaderService } from 'src/app/services/loader.service'

@Component({
  selector: 'app-fellow-travelers',
  standalone: true,
  imports: [CommonModule, StoryCardComponent, TranslatePipe, SearchBoxComponent],
  templateUrl: './fellow-travelers.component.html',
  styleUrls: ['./fellow-travelers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FellowTravelersComponent implements OnInit {
  dataService = inject(DataService)
  stories$!: Observable<Story[]>
  loader = inject(LoaderService)

  search(text: string): void {
    this.stories$ = this.dataService.getStories('trends', text)
  }

  ngOnInit(): void {
    this.loader.setShareUrl('trends')
    this.search('')
  }
}
