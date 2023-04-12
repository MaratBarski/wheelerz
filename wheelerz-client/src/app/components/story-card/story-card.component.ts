import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Story } from 'src/app/models/story'
import { StarsComponent } from '../stars/stars.component'
import { AvatarComponent } from '../avatar/avatar.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-story-card',
  standalone: true,
  imports: [CommonModule, StarsComponent, AvatarComponent, TranslatePipe, RouterModule],
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryCardComponent {
  @Input() story!: Story
  @Input() isShowAvatar = true
  @Input() editable = false
  @Output() onDelete = new EventEmitter<Story>()
}
