import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { StoryCardComponent } from '../story-card/story-card.component'
import { DataService } from 'src/app/services/data.service'
import { LoaderService } from 'src/app/services/loader.service'
import { Story } from 'src/app/models/story'
import { Subject, first, map, takeUntil, tap } from 'rxjs'
import { SearchBoxComponent } from '../search-box/search-box.component'
import { StoryRequest } from 'src/app/models/story-dto'
import { PaginatorComponent } from '../paginator/paginator.component'
import { ActivatedRoute, Router } from '@angular/router'
import { StoryUrls } from 'src/app/consts'

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [CommonModule, TranslatePipe, StoryCardComponent, SearchBoxComponent, PaginatorComponent],
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
    this.reload()
  }

  search(): void {
    this.loader.load(true)
    this.dataService.getStories(this.request).pipe(
      tap(res => {
        this.total = res.total
        this.loader.load(false)
        if (this.request.page.current > 0 && !res.result?.length) {
          this.request.page.current = 0
          this.reload()
        }
      }),
      map(res => res.result),
      first()
    ).subscribe(res => {
      this.stories = res
      this.changeDetectorRef.markForCheck()
    })
  }

  ngOnInit(): void {
    this.request.type = this.type
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy))
      .subscribe((res: any) => {
        const params = res['params']
        this.request = { ...this.request, page: { ...this.request.page, current: +(params.p || 0) }, q: params.q || '', }
        this.validateRequest()
        this.search()
      })
  }

  validateRequest(): void {
    if (this.request.page.current < 0) this.request.page.current = 0
  }

  ngOnDestroy(): void {
    this.destroy.next()
  }

  onPageChange(value: number): void {
    this.request.page.current = value
    this.reload()
  }

  reload(): void {
    this.router.navigate([this.url, { q: this.request.q, p: this.request.page.current }])
  }
}
