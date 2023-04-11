import { ChangeDetectionStrategy, Component, HostListener, Input, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslationService } from 'src/app/services/translation.service'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { RouterModule } from '@angular/router'
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-top',
  standalone: true,
  imports: [CommonModule, TranslatePipe, RouterModule],
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopComponent {
  menuModes = [false, false];
  translationService = inject(TranslationService)
  userService = inject(UserService);
  @Input() isLogin = true

  isShow(i: number): boolean {
    return this.menuModes[i]
  }

  @HostListener('document:click', ['$event'])
  docClick(): void {
    this.menuModes = this.menuModes.map(x => false)
  }

  open(i: number, $event: MouseEvent): void {
    $event.stopPropagation()
    this.menuModes = this.menuModes.map(x => false)
    this.menuModes[i] = true
  }

  setLeng(lang: string): void {
    this.translationService.setTranslation(lang)
  }

  logout(): void {
    this.userService.logOut()
  }
}
