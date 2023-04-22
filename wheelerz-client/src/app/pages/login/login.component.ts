import { Component, inject, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { TopComponent } from 'src/app/components/top/top.component'
import { LoginService } from 'src/app/services/login.service'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'

@Component({
  selector: 'invalid-log',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TopComponent, TranslatePipe, MatDialogModule],
  template: `<h1 mat-dialog-title>{{'error'|translate}}</h1>
  <div mat-dialog-content>
    {{'invalid_login'|translate}}
  </div>
  <div mat-dialog-actions>
    <button class='main-btn' mat-button mat-dialog-close>{{'close'|translate}}</button>
  </div>`
})
export class InvalidLoginDialog { }

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe, TopComponent, MatDialogModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  constructor(public dialog: MatDialog) { }

  loginService = inject(LoginService);

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  get isvalid(): boolean {
    return this.form.valid
  }

  openDialog() {
    this.dialog.open(InvalidLoginDialog)
  }

  login(): void {
    this.loginService.login(this.form.getRawValue()).subscribe(res => {
      if (res.error) this.openDialog()
    })
  }
}
