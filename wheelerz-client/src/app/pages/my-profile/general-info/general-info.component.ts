import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { AvatarComponent } from 'src/app/components/avatar/avatar.component'
import { Observable, first } from 'rxjs'
import { User } from 'src/app/models/user'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { TopProfileComponent } from 'src/app/components/top-profile/top-profile.component'
import { StoryCardComponent } from 'src/app/components/story-card/story-card.component'
import { RouterModule } from '@angular/router'
import { Story } from 'src/app/models/story'
import { LoaderService } from 'src/app/services/loader.service'

@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [CommonModule, AvatarComponent, TranslatePipe, TopProfileComponent, StoryCardComponent, RouterModule],
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfoComponent implements OnInit {
  dataService = inject(DataService)
  user$!: Observable<User>
  loaderService = inject(LoaderService)
  cd = inject(ChangeDetectorRef)

  isEditable = true

  ngOnInit(): void {
    this.reload()
  }

  reload(): void {
    this.user$ = this.dataService.getMyProfile()
    this.loaderService.load(false)
  }

  onDelete(story: Story): void {
    if (!story.id) return
    this.loaderService.load(true)
    this.dataService.deleteStory(story.id).pipe(first()).subscribe({
      next: () => {
        this.reload()
        this.cd.markForCheck()
      },
      error: () => {
        this.reload()
        this.cd.markForCheck()
      }
    })
  }
}
