import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { AvatarComponent } from 'src/app/components/avatar/avatar.component'
import { Observable } from 'rxjs'
import { User } from 'src/app/models/user'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { TopProfileComponent } from 'src/app/components/top-profile/top-profile.component'

@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [CommonModule, AvatarComponent, TranslatePipe, TopProfileComponent],
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfoComponent {
  dataService = inject(DataService)
  user$: Observable<User> = this.dataService.getMyProfile()
  isEditable = true
}
