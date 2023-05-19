import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateAsyncPipe } from 'src/app/pipes/translate.pipe';
import { LoginService } from 'src/app/services/login.service';
import { RouterModule } from '@angular/router';
import { TranslationService } from 'src/app/services/translation.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, TranslateAsyncPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage implements OnInit, OnDestroy {
  cd = inject(ChangeDetectorRef)
  private destroy = new Subject<void>()
  ngOnDestroy(): void {
    this.destroy.next()
  }

  ngOnInit(): void {
    this.translateService.loadTranslation
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        this.alertButtons = [this.translateService.translate('close')]
      })
  }

  loginService = inject(LoginService);
  translateService = inject(TranslationService)

  get isValid(): boolean {
    return this.form.valid
  }

  isAlertOpen = false

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  get isvalid(): boolean {
    return this.form.valid
  }

  login(): void {
    this.loginService.login(this.form.getRawValue()).subscribe(res => {
      this.form.reset()
      if (res.error) {
        this.isAlertOpen = true
        this.cd.markForCheck()
      }
    })
  }

  alertButtons = ['close'];

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen
  }
}
