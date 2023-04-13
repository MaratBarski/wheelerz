import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core'
import { TabulatorComponent } from './components/tabulator/tabulator.component'

import { RouterOutlet, RouterLinkWithHref } from '@angular/router'
import { NavBarComponent } from './components/nav-bar/nav-bar.component'
import { StarsComponent } from './components/stars/stars.component'
import { TopComponent } from './components/top/top.component'
import { TranslationService } from './services/translation.service'
import { Subject, takeUntil } from 'rxjs'
import { TranslateAsyncPipe } from './pipes/translate.pipe'
import { UserService } from './services/user.service'
import { LoaderService } from './services/loader.service'

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
  ngOnDestroy(): void {
    this.destroy.next()
  }
  changeDetectorRef = inject(ChangeDetectorRef)
  userService = inject(UserService)
  loaderService = inject(LoaderService)
  translationService = inject(TranslationService)

  ngOnInit(): void {
    this.translationService.loadTranslation
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        this.changeDetectorRef.markForCheck()
      })
  }
  
  get isLoaded(): boolean {
    return this.translationService.isLoaded
  }

  get direction(): string {
    return this.translationService.direction
  }
}
