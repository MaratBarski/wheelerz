import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { AvatarComponent } from 'src/app/components/avatar/avatar.component'
import { Observable, first } from 'rxjs'
import { User } from 'src/app/models/user'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { TopProfileComponent } from 'src/app/components/top-profile/top-profile.component'
import { StoryCardComponent } from 'src/app/components/story-card/story-card.component'
import { StoryListComponent } from 'src/app/components/story-list/story-list.component'

@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [CommonModule, TranslatePipe, TopProfileComponent, StoryListComponent],
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfoComponent implements OnInit {
  dataService = inject(DataService)
  user$!: Observable<User>

  ngOnInit(): void {
    this.reload()
  }

  reload(): void {
    this.user$ = this.dataService.getMyProfile()
  }
}
