import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core'
import { TabulatorComponent } from './components/tabulator/tabulator.component'
import { RouterOutlet, RouterLinkWithHref, RouterModule } from '@angular/router'
import { NavBarComponent } from './components/nav-bar/nav-bar.component'
import { StarsComponent } from './components/stars/stars.component'
import { TopComponent } from './components/top/top.component'
import { TranslationService } from './services/translation.service'
import { combineLatest, Observable, Subject, of, takeUntil, map, filter, delay } from 'rxjs'
import { TranslateAsyncPipe, TranslatePipe } from './pipes/translate.pipe'
import { UserService } from './services/user.service'
import { LoaderService } from './services/loader.service'
import { NavLink } from './models/navigation'
import { SocketService } from './services/socket.service'
import { Rooms } from './models/topic'
import { LoginService } from './services/login.service'
import { IS_SOCKET_DISABLE } from './consts'

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
    TranslateAsyncPipe,
    TranslatePipe,
    RouterModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>()
  changeDetectorRef = inject(ChangeDetectorRef)
  userService = inject(UserService)
  loaderService = inject(LoaderService)
  translationService = inject(TranslationService)
  socketService = inject(SocketService)
  loginService = inject(LoginService)

  addText = 'Add review'
  addUrl = ''

  links: NavLink[] = [
    { name: 'road_trip_stories', link: 'stories' },
    { name: 'hotel_reviews', link: 'hotel-reviews' },
    { name: 'cities_accessibility', link: 'cities-accessibility' },
    // { name: 'trends', link: 'fellow-travelers' },
  ]

  links$: Observable<NavLink[]> = combineLatest([
    of(this.links),
    this.loaderService.currentShareUrl
  ]).pipe(map(([links, url]) => {
    this.addUrl = `/share/${url}`
    this.addText = `add_${url}`
    return [...links]
  }))

  get isSocketEnable(): boolean {
    return !IS_SOCKET_DISABLE
  }

  get isLoaded(): boolean {
    return this.translationService.isLoaded
  }

  get direction(): string {
    return this.translationService.direction
  }

  ngOnDestroy(): void {
    this.destroy.next()
    this.socketService.unsubscribe(Rooms.addStory)
  }

  ngOnInit(): void {
    combineLatest([
      this.translationService.loadTranslation,
      this.loaderService.onShowTopMenu,
      this.loaderService.loading
    ])
      .pipe(delay(10), takeUntil(this.destroy))
      .subscribe(() => {
        this.changeDetectorRef.markForCheck()
      })

    this.loginService.onLogin.pipe(
      takeUntil(this.destroy)
    ).subscribe(res => {
      try {
        if (res)
          this.socketService.subscribe(Rooms.addStory)
            .pipe(takeUntil(this.destroy))
            .subscribe(res => {
              console.log(res)
            })
        else
          this.socketService.unsubscribe(Rooms.addStory)
      } catch (e) { }
    })
  }
}
