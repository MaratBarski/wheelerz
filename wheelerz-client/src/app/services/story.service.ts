import { Injectable, inject } from '@angular/core'
import { ActivatedRouteSnapshot, UrlTree, createUrlTreeFromSnapshot } from '@angular/router'
import { Observable, map } from 'rxjs'
import { DataService } from './data.service'

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  dataService = inject(DataService)

  canActivate(next: ActivatedRouteSnapshot):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.dataService.hasMod()
      .pipe(
        map((count) =>
          count ? true : createUrlTreeFromSnapshot(next, ['/', 'my-profile', 'accessibility'])
        )
      )
  }
}
