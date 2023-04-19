import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { User } from 'src/app/models/user'
import { UserFormComponent } from 'src/app/components/user-form/user-form.component'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, first } from 'rxjs'
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
  dataService = inject(DataService)
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)

  user$!: Observable<User>;
  id = 0

  ngOnInit(): void {
    this.id = +(this.activatedRoute.snapshot.paramMap.get('id') || 0)
    this.user$ = this.dataService.getUserInfo(this.id)
  }

  save(event: User): void {
    this.dataService.updateProfile(event).subscribe(res => {
      this.router.navigateByUrl('/my-profile')
    })
  }

  onDelete(): void {
    this.dataService.deleteUser(this.id).pipe(first()).subscribe(() => {

    })
  }
}

