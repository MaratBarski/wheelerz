import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { DataService } from 'src/app/services/data.service'
import { LoaderService } from 'src/app/services/loader.service'
import { Story } from 'src/app/models/story'
import { Subject, first, map, tap } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { StoryUrls } from 'src/app/consts'
import { StorySelector } from 'src/app/models/story-selector'
import { SearchBoxComponent } from '../search-box/search-box.component'
import { NoDataComponent } from '../no-data/no-data.component'
import { PostViewComponent } from '../post-view/post-view.component'
import { StoryCardComponent } from '../story-card/story-card.component'
import { StorySelectorComponent } from '../story-selector/story-selector.component'
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular'

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslatePipe,
    StoryCardComponent,
    PostViewComponent,
    StorySelectorComponent,
    SearchBoxComponent,
    NoDataComponent
  ],
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryListComponent implements OnInit {

  dataService = inject(DataService)
  loader = inject(LoaderService)
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)
  changeDetectorRef = inject(ChangeDetectorRef)

  @ViewChild('hotelTemplate') hotelTemplate!: TemplateRef<any>
  @ViewChild('cityTemplate') cityTemplate!: TemplateRef<any>

  @Input() type = 1
  @Input() userId = 0
  @Input() editable = false
  @Input() isShowAvatar = true
  @Input() searchByUser = false
  @Input() pageSize = 20

  storySelector!: StorySelector
  isNoData = false

  total = 0
  stories: Story[] = []

  get url(): string {
    return StoryUrls[this.type].view
  }

  get noDataSrc(): string {
    return `nodata-${this.type}.svg`
  }

  get nodataText(): string {
    return `nodata_${this.type}`
  }

  getCurrentTemplate(type: number): TemplateRef<any> {
    if (type === 2) return this.hotelTemplate
    return this.cityTemplate
  }

  updateSearchText(text: string): void {
    if (!text) text = ''
    this.storySelector.q = text.trim()
    this.storySelector.page.current = 0
    this.select()
  }

  ngOnInit(): void {
    this.storySelector = {
      cityId: 0,
      countryId: 0,
      mobilities: {},
      type: this.type,
      page: { current: 0, size: this.pageSize },
      userId: this.userId,
      isOnlyMy: this.searchByUser,
      isMyInclude: true
    }
    this.select()
  }

  onPageChange(value: number): void {
    this.stories = []
    this.storySelector.page.current = value
    this.select()
  }

  select(): void {
    this.isNoData = false
    this.loader.load(true)
    this.storySelector = { ...this.storySelector }
    this.dataService.selectStories(this.storySelector).pipe(
      tap(res => {
        this.total = res.total
        this.loader.load(false)
      }),
      map(res => res.result),
      first()
    ).subscribe(res => {
      this.stories = [...this.stories, ...res]
      this.isNoData = this.stories.length === 0
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

  onIonInfinite(ev: any) {
    this.onPageChange(this.storySelector.page.current + 1)
    ev.target.complete()
    // setTimeout(() => {
    //   (ev as InfiniteScrollCustomEvent).target.complete();
    // }, 500);
  }
}
