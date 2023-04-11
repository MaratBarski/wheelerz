import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { AvatarComponent } from '../avatar/avatar.component'
import { User } from 'src/app/models/user'

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
  @Output() onAvatarChanged = new EventEmitter<string>()
}
