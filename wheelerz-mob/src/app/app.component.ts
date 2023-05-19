import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Subject, combineLatest, delay, filter, takeUntil } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { LoginService } from './services/login.service';
import { SocketService } from './services/socket.service';
import { TranslationService } from './services/translation.service';
import { UserService } from './services/user.service';
import { Rooms } from './models/topic';
import { TranslateAsyncPipe } from './pipes/translate.pipe';
import { titles } from './consts';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule, TranslateAsyncPipe],
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
  isLoaded = false

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
        this.isLoaded = true
        this.bindMenu()
        this.changeDetectorRef.markForCheck()
      })

    this.loginService.onLogin.pipe(
      takeUntil(this.destroy)
    ).subscribe(res => {
      this.bindMenu()
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

  logout(): void {
    this.loginService.logOut()
  }

  private bindMenu() {
    if (this.userService.isLogedIn) {
      this.appPages = [
        { title: this.translationService.translate(titles[0]), url: 'stories/road', icon: 'airplane-outline' },
        { title: this.translationService.translate(titles[1]), url: 'stories/hotel', icon: 'airplane-outline' },
        { title: this.translationService.translate(titles[2]), url: 'stories/city', icon: 'airplane-outline' },
      ]
    }
    else {
      this.appPages = [
        { title: 'Login', url: '/login', icon: 'accessibility' },
      ]
    }
    this.changeDetectorRef.markForCheck()
  }

  setLeng(lang: string): void {
    this.translationService.setTranslation(lang)
    window.location.href = './'
  }

  appPages: any[] = [
    { title: 'Login', url: '/login', icon: 'archive' },
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() { }
}
