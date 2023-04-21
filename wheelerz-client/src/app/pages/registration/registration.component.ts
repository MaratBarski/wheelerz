import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TopComponent } from 'src/app/components/top/top.component'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { UserFormComponent } from 'src/app/components/user-form/user-form.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { User } from 'src/app/models/user'
import { LoginService } from 'src/app/services/login.service'
import { Router } from '@angular/router'

@Component({
  selector: 'dialog-content-example-dialog',
  standalone: true,
  imports: [CommonModule, TopComponent, TranslatePipe, UserFormComponent, MatDialogModule],
  template: `<h1 mat-dialog-title>Error</h1>
  <div mat-dialog-content>
    User allready exists
  </div>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close>{{'no'|translate}}</button>
    <button mat-button mat-dialog-close cdkFocusInitial>{{'yes'|translate}}</button>
  </div>`
})
export class DialogContentExampleDialog { }

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, TopComponent, TranslatePipe, UserFormComponent, MatDialogModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  constructor(public dialog: MatDialog) { }
  loginService = inject(LoginService)
  router = inject(Router)

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, { data: '1321' })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    });
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

