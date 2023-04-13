import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core'
import { TabulatorComponent } from './components/tabulator/tabulator.component'
import { RouterOutlet, RouterLinkWithHref } from '@angular/router'
import { NavBarComponent } from './components/nav-bar/nav-bar.component'
import { StarsComponent } from './components/stars/stars.component'
import { TopComponent } from './components/top/top.component'
import { TranslationService } from './services/translation.service'
import { combineLatest, Observable, Subject, of, takeUntil, map, filter } from 'rxjs'
import { TranslateAsyncPipe } from './pipes/translate.pipe'
import { UserService } from './services/user.service'
import { LoaderService } from './services/loader.service'
import { NavLink } from './models/navigation'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    TopComponent,
    NavBarComponent,
    RouterOutlet,
    RouterLinkWithHref,
    TabulatorComponent,
    StarsComponent,
    TranslateAsyncPipe
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>()
  changeDetectorRef = inject(ChangeDetectorRef)
  userService = inject(UserService)
  loaderService = inject(LoaderService)
  translationService = inject(TranslationService)

  links: NavLink[] = [
    { name: 'road_trip_stories', link: 'stories' },
    { name: 'hotel_reviews', link: 'hotel-reviews' },
    { name: 'cities_accessibility', link: 'cities-accessibility' },
    { name: 'trends', link: 'fellow-travelers' },
    { name: 'share', link: 'share' },
  ]

  links$: Observable<NavLink[]> = combineLatest([
    of(this.links),
    this.loaderService.currentShareUrl
  ]).pipe(map(([links, url]) => {
    links[links.length - 1].link = `/share/${url}`
    return [...links]
  }))

  get isLoaded(): boolean {
    return this.translationService.isLoaded
  }

  get direction(): string {
    return this.translationService.direction
  }

  ngOnDestroy(): void {
    this.destroy.next()
  }

  ngOnInit(): void {
    this.translationService.loadTranslation
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        this.changeDetectorRef.markForCheck()
      })
  }
}
