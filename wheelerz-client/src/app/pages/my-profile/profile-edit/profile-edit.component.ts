import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { User } from 'src/app/models/user'
import { UserFormComponent } from 'src/app/components/user-form/user-form.component'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/services/data.service'

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileEditComponent implements OnInit {
  user$!: Observable<User>;

  dataService = inject(DataService)
  router = inject(Router)

  ngOnInit(): void {
    this.user$ = this.dataService.getUserInfo()
  }

  save(event: User): void {
    this.dataService.updateProfile(event).subscribe(res => {
      this.router.navigateByUrl('/my-profile')
    })
  }
}

