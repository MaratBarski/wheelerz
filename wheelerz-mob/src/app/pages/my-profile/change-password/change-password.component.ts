import { Component, ChangeDetectionStrategy, inject, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { LoaderService } from 'src/app/services/loader.service'
import { first } from 'rxjs'
import { Router } from '@angular/router'



@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  dataService = inject(DataService)
  loader = inject(LoaderService)
  router = inject(Router)


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
          // this.dialog.open(InvalidLoginDialog, { data: res }).afterClosed().pipe(first()).subscribe(res => {
          //   this.form.reset()
          // })
        }, error: (er) => {
          this.loader.load(false)
        }
      })
  }
}
