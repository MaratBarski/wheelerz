import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';
import { UserFormComponent } from 'src/app/components/user-form/user-form.component';
import { TranslateAsyncPipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, TranslateAsyncPipe, UserFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationPage {
  loginService = inject(LoginService)
  router = inject(Router)
  isAlertOpen = false
  alertButtons = ['close']

  save(event: User): void {
    this.loginService.registr(event).subscribe(res => {
      if (res.error) {
        alert('error')
        return
      }
      this.loginService.loginSucc(res)
      this.router.navigateByUrl('/my-profile/accessibility')
    })
  }

}
