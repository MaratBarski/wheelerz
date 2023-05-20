import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { LoaderService } from 'src/app/services/loader.service'
import { StoryListComponent } from 'src/app/components/story-list/story-list.component'

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [CommonModule, StoryListComponent, TranslatePipe],
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrendsComponent implements OnInit {
  loader = inject(LoaderService)

  ngOnInit(): void {
    this.loader.setShareUrl('trends')
  }
}
