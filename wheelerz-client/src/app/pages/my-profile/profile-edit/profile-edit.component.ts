import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { User } from 'src/app/models/user'
import { UserFormComponent } from 'src/app/components/user-form/user-form.component'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, first, tap } from 'rxjs'
import { DataService } from 'src/app/services/data.service'
import { UserPermissionsComponent } from 'src/app/components/user-permissions/user-permissions.component'
import { PermissionDirective } from 'src/app/directives/permission.directive'
import { UserPermissins } from 'src/app/models/permissions'

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, UserFormComponent, UserPermissionsComponent, PermissionDirective],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileEditComponent implements OnInit {
  dataService = inject(DataService)
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)

  permission = 0
  user$!: Observable<User>;
  id = 0

  get changePermissions(): number {
    return UserPermissins['changePermissions']
  }

  ngOnInit(): void {
    this.id = +(this.activatedRoute.snapshot.paramMap.get('id') || 0)
    this.user$ = this.dataService.getUserInfo(this.id).pipe(tap(res => {
      this.permission = res.permission || 0
    }))
  }

  save(event: User): void {
    this.dataService.updateProfile({ ...event, permission: this.permission }, this.id)
      .pipe(first())
      .subscribe(res => {
        this.router.navigateByUrl('/my-profile/accessibility')
      })
  }

  updatePermissions(value: number): void {
    this.permission = value
  }

  onDelete(): void {
    this.dataService.deleteUser(this.id).pipe(first()).subscribe(() => {

    })
  }
}

