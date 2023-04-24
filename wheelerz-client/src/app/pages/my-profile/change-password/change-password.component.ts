import { Component, ChangeDetectionStrategy, inject, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { LoaderService } from 'src/app/services/loader.service'
import { first } from 'rxjs'
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { PhotoGalleryComponent } from 'src/app/components/photo-gallery/photo-gallery.component'
import { Router } from '@angular/router'

@Component({
  selector: 'pwd-log',
  providers: [MatDialogConfig],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslatePipe, MatDialogModule],
  template: `<h1 mat-dialog-title>{{'change_password_title_dialog'|translate}}</h1>
  <div mat-dialog-content>
    {{message|translate}}
  </div>
  <div mat-dialog-actions>
    <button class='main-btn' mat-button mat-dialog-close>{{'close'|translate}}</button>
  </div>`
})
export class InvalidLoginDialog {
  message = ''
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PhotoGalleryComponent>) {
    this.message = data.message
  }
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, MatDialogModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  dataService = inject(DataService)
  loader = inject(LoaderService)
  router = inject(Router)

  constructor(public dialog: MatDialog) { }

  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    oldPwd: new FormControl('', [Validators.required]),
    newPwd: new FormControl('', [Validators.required]),
    confirmPwd: new FormControl('', [Validators.required]),
  })

  get isValid(): boolean {
    if (this.form.get('newPwd')?.value !== this.form.get('confirmPwd')?.value) return false
    return this.form.valid
  }

  change(): void {
    this.loader.load(true)
    this.dataService.changePassword(this.form.getRawValue()).pipe(first())
      .subscribe({
        next: (res) => {
          this.loader.load(false)
          this.dialog.open(InvalidLoginDialog, { data: res }).afterClosed().pipe(first()).subscribe(res => {
            this.form.reset()
          })
        }, error: (er) => {
          this.loader.load(false)
        }
      })
  }
}
