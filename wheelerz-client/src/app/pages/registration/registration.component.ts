import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TopComponent } from 'src/app/components/top/top.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { UserFormComponent } from 'src/app/components/user-form/user-form.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { User } from 'src/app/models/user'
import { LoginService } from 'src/app/services/login.service'
import { Router } from '@angular/router'
import { first } from 'rxjs'

@Component({
  selector: 'invalid-reg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TopComponent, TranslatePipe, UserFormComponent, MatDialogModule],
  template: `<h1 mat-dialog-title>{{'error'|translate}}</h1>
  <div mat-dialog-content>
    {{'mail_exists'|translate}}
  </div>
  <div mat-dialog-actions>
    <button class='main-btn' mat-button mat-dialog-close>{{'close'|translate}}</button>
  </div>`
})
export class InvalidRegistrationDialog { }

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, TopComponent, TranslatePipe, UserFormComponent, MatDialogModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent {
  constructor(public dialog: MatDialog) { }
  loginService = inject(LoginService)
  router = inject(Router)

  openDialog() {
    const dialogRef = this.dialog.open(InvalidRegistrationDialog)
    dialogRef.afterClosed()
      .pipe(first())
      .subscribe(result => {
        console.log(`Dialog result: ${result}`)
      })
  }

  save(event: User): void {
    this.loginService.registr(event).subscribe(res => {
      if (res.error) {
        this.openDialog()
        return
      }
      this.loginService.loginSucc(res)
      this.router.navigateByUrl('/my-profile/accessibility')
    })
  }
}

