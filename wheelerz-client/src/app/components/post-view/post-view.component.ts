import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Story } from 'src/app/models/story'
import { UserService } from 'src/app/services/user.service'
import { RouterModule } from '@angular/router'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { AvatarComponent } from '../avatar/avatar.component'
import { ImageComponent } from '../image/image.component'
import { StarsComponent } from '../stars/stars.component'
import { TopProfileComponent } from '../top-profile/top-profile.component'
import { ChairOptionsViewComponent } from '../chair-options-view/chair-options-view.component'
import { StoryToChairPipe } from 'src/app/pipes/story-to-chair.pipe'
import { EditDeleteComponent } from '../edit-delete/edit-delete.component'

@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [CommonModule, StoryToChairPipe, EditDeleteComponent, RouterModule, ChairOptionsViewComponent, TranslatePipe, AvatarComponent, ImageComponent, StarsComponent, TopProfileComponent],
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostViewComponent {
  userService = inject(UserService)
  @Input() story!: Story
  @Input() isShowAvatar = true
  @Input() editable = false
  @Output() onDelete = new EventEmitter<Story>()
  @Input() raduius = 10
}
