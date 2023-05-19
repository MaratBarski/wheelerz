import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Story } from 'src/app/models/story'
import { StarsComponent } from '../stars/stars.component'
import { AvatarComponent } from '../avatar/avatar.component'
import { TranslateAsyncPipe, TranslatePipe } from 'src/app/pipes/translate.pipe'
import { RouterModule } from '@angular/router'
import { UserService } from 'src/app/services/user.service'
import { ImageComponent } from '../image/image.component'
import { EditDeleteComponent } from '../edit-delete/edit-delete.component'
import { IonModal, IonicModule } from '@ionic/angular'

@Component({
  selector: 'app-story-card',
  standalone: true,
  imports: [CommonModule, StarsComponent, EditDeleteComponent, AvatarComponent, TranslateAsyncPipe, IonicModule, TranslatePipe, RouterModule, ImageComponent],
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryCardComponent {
  userService = inject(UserService)
  @Input() story!: Story
  @Input() isShowAvatar = true
  @Input() editable = false
  @Output() onDelete = new EventEmitter<Story>()
  @Input() raduius = 10
}
