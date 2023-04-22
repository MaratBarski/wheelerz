import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { AvatarComponent } from '../avatar/avatar.component'
import { User } from 'src/app/models/user'
import { MobilityType } from 'src/app/models/user-accessibility'
import { Chair } from 'src/app/models/chair'

@Component({
  selector: 'app-top-profile',
  standalone: true,
  imports: [CommonModule, TranslatePipe, AvatarComponent],
  templateUrl: './top-profile.component.html',
  styleUrls: ['./top-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopProfileComponent {
  @Input() user!: User
  @Input() isEditable = false
  @Input() mobilityTypes?: MobilityType[]
  @Input() chairInfo?: Chair

  @Output() onAvatarChanged = new EventEmitter<string>()

  get mobilities(): MobilityType[] | undefined {
    return this.mobilityTypes ? this.mobilityTypes : this.user.mobilities
  }

  get chair(): Chair | undefined {
    return this.chairInfo ? this.chairInfo : this.user.chairInfo
  }

  get noWalk(): boolean {
    if (this.chairInfo) return true
    return !!this.user.noWalk
  }
}
