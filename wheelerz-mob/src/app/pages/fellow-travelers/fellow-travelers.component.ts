import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { LoaderService } from 'src/app/services/loader.service'
import { StoryListComponent } from 'src/app/components/story-list/story-list.component'

@Component({
  selector: 'app-fellow-travelers',
  standalone: true,
  imports: [CommonModule, StoryListComponent, TranslatePipe],
  templateUrl: './fellow-travelers.component.html',
  styleUrls: ['./fellow-travelers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FellowTravelersComponent implements OnInit {
  loader = inject(LoaderService)

  ngOnInit(): void {
    this.loader.setShareUrl('trends')
  }
}
