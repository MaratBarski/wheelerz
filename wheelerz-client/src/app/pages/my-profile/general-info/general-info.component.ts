import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { AvatarComponent } from 'src/app/components/avatar/avatar.component'
import { Observable } from 'rxjs'
import { User } from 'src/app/models/user'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { TopProfileComponent } from 'src/app/components/top-profile/top-profile.component'
import { StoryCardComponent } from 'src/app/components/story-card/story-card.component'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [CommonModule, AvatarComponent, TranslatePipe, TopProfileComponent, StoryCardComponent, RouterModule],
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfoComponent {
  dataService = inject(DataService)
  user$: Observable<User> = this.dataService.getMyProfile()
  isEditable = true
}
