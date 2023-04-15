import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { Observable, first, map, tap } from 'rxjs'
import { Story } from 'src/app/models/story'
import { ActivatedRoute, Router } from '@angular/router'
import { UserInputFormComponent } from 'src/app/components/user-input-form/user-input-form.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { LoaderService } from 'src/app/services/loader.service'
import { UserService } from 'src/app/services/user.service'
import { StoryUrls } from 'src/app/consts'

@Component({
  selector: 'app-story-edit',
  standalone: true,
  imports: [CommonModule, UserInputFormComponent, TranslatePipe],
  templateUrl: './story-edit.component.html',
  styleUrls: ['./story-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryEditComponent implements OnInit {
  dataService = inject(DataService)
  userService = inject(UserService)
  activatedRoute = inject(ActivatedRoute)
  loader = inject(LoaderService)
  router = inject(Router)

  story$!: Observable<Story>
  type = 0

  get storyBackUrl(): string {
    return StoryUrls[this.type].view
  }

  ngOnInit(): void {
    const id = +(this.activatedRoute.snapshot.paramMap.get('id') || '0')
    this.story$ = this.dataService.getStoryById(id).pipe(
      tap(res => {
        if (this.userService.isAdmin) this.type = res.storyType || 0
      }),
      map((res) => {
        return { ...res, photos: res.storyPhotos?.map(x => ({ id: x.id, small: x.small, fileName: x.fileName })) }
      }))
  }

  onPublish(s: Story): void {
    this.loader.load(true)
    s.storyPhotos = undefined
    this.dataService.updateStory(s).pipe(first()).subscribe({
      next: () => {
        this.loader.load(false)
        this.router.navigateByUrl(`${this.storyBackUrl}`)
      },
      error: () => {
        this.loader.load(false)
      }
    })
  }

}
