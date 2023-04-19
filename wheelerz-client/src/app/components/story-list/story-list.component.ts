import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { StoryCardComponent } from '../story-card/story-card.component'
import { DataService } from 'src/app/services/data.service'
import { LoaderService } from 'src/app/services/loader.service'
import { Story } from 'src/app/models/story'
import { Observable, Subject, first, map, takeUntil, tap } from 'rxjs'
import { StoryRequest } from 'src/app/models/story-dto'
import { PaginatorComponent } from '../paginator/paginator.component'
import { ActivatedRoute, Router } from '@angular/router'
import { StoryUrls } from 'src/app/consts'
import { StorySelectorComponent } from '../story-selector/story-selector.component'
import { StorySelector } from 'src/app/models/story-selector'
import { User } from 'src/app/models/user'
import { SearchBoxComponent } from '../search-box/search-box.component'
import { NoDataComponent } from '../no-data/no-data.component'

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    StoryCardComponent,
    PaginatorComponent,
    StorySelectorComponent,
    SearchBoxComponent,
    NoDataComponent
  ],
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryListComponent implements OnInit, OnDestroy {

  dataService = inject(DataService)
  loader = inject(LoaderService)
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)
  changeDetectorRef = inject(ChangeDetectorRef)

  @Input() type = 1
  @Input() userId = 0
  @Input() editable = false
  @Input() isShowAvatar = true
  @Input() searchByUser = false

  storySelector!: StorySelector
  user$!: Observable<User>
  isNoData = false

  destroy = new Subject<void>()
  total = 0
  stories!: Story[]

  request: StoryRequest = {
    page: { current: 0, size: 50 },
    type: this.type,
    userId: 0,
    q: ''
  }

  get url(): string {
    return StoryUrls[this.type].view
  }

  updateSearchText(text: string): void {
    this.request.q = text
    this.request.page.current = 0
    this.select()
  }

  loadProfile(): void {
    this.user$ = this.dataService.getMyProfile()
      .pipe(tap(res => {
        this.storySelector = {
          cityId: 0,
          countryId: 0,
          mobilities: this.searchByUser ? {} : (res.mobilities || []).reduce((prev, cur) => ({ ...prev, [cur.name]: true }), {}),
          type: this.type,
          page: { current: 0, size: 50 },
          userId: this.userId,
          isOnlyMy: this.searchByUser
        }
        this.select()
      }))
  }

  ngOnInit(): void {
    this.loadProfile()
  }

  validateRequest(): void {
    if (this.request.page.current < 0) this.request.page.current = 0
  }

  ngOnDestroy(): void {
    this.destroy.next()
  }

  onPageChange(value: number): void {
    this.request.page.current = value
    this.storySelector.page.current = value
    this.select()
  }

  select(): void {
    this.isNoData = false
    this.loader.load(true)
    this.dataService.selectStories(this.storySelector).pipe(
      tap(res => {
        this.total = res.total
        this.loader.load(false)
      }),
      map(res => res.result),
      first()
    ).subscribe(res => {
      this.stories = res
      this.isNoData = res.length === 0
      this.changeDetectorRef.markForCheck()
    })
  }

  onApplySelector(selector: StorySelector): void {
    this.storySelector = selector
    this.onPageChange(0)
  }

  onDelete(story: Story): void {
    if (!story.id) return
    this.loader.load(true)
    this.dataService.deleteStory(story.id).pipe(first()).subscribe({
      next: () => {
        this.select()
      },
      error: () => {
        this.select()
      }
    })
  }
}
