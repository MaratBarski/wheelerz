import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Story } from 'src/app/models/story'
import { StarsComponent } from '../stars/stars.component'
import { AvatarComponent } from '../avatar/avatar.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'

@Component({
  selector: 'app-story-card',
  standalone: true,
  imports: [CommonModule, StarsComponent, AvatarComponent, TranslatePipe],
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryCardComponent {
  @Input() story!: Story
}
