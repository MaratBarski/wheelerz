import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { DataService } from 'src/app/services/data.service'
import { Observable, tap } from 'rxjs'
import { User } from 'src/app/models/user'
import { UserSelector } from 'src/app/models/user-selector'
import { PageResponse } from 'src/app/models/page-request'
import { PaginatorComponent } from 'src/app/components/paginator/paginator.component'
import { TopProfileComponent } from 'src/app/components/top-profile/top-profile.component'
import { SearchBoxComponent } from 'src/app/components/search-box/search-box.component'
import { AvatarComponent } from 'src/app/components/avatar/avatar.component'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TranslatePipe, RouterModule, PaginatorComponent, TopProfileComponent, SearchBoxComponent, AvatarComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  dataService = inject(DataService)
  data$!: Observable<PageResponse<User[]>>
  total = 0

  request: UserSelector = {
    cityId: 0,
    countryId: 0,
    q: '',
    page: {
      current: 0,
      size: 50
    }
  }

  search(): void {
    this.data$ = this.dataService.getUsers(this.request).pipe(tap(res => {
      this.total = res.total
    }))
  }

  ngOnInit(): void {
    this.search()
  }

  onPageChange(value: number): void {
    this.request.page.current = value

    this.search()
  }

  onSearch(text: string): void {
    this.request.q = text
    this.search()
  }
}
