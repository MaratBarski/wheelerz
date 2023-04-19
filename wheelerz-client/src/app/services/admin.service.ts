import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { ActivatedRouteSnapshot, UrlTree, createUrlTreeFromSnapshot } from '@angular/router';
import { Observable, of, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private userService: UserService) { }

  canActivate(next: ActivatedRouteSnapshot):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return of(this.userService.isAdmin)
      .pipe(
        map((isLogedIn) =>
          isLogedIn ? true : createUrlTreeFromSnapshot(next, ['/', 'login'])
        )
      )
  }
}
