import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router, UrlTree, createUrlTreeFromSnapshot } from '@angular/router'
import { Observable, of, map } from 'rxjs'

const TOKEN = 'token'
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private router: Router) { }

  logOut(): void {
    localStorage.removeItem(TOKEN)
    this.router.navigateByUrl('/login')
  }

  login(token: string): void {
    localStorage.setItem(TOKEN, token)
    this.router.navigateByUrl('/home')
  }

  get isLogedIn(): boolean {
    return !!localStorage.getItem(TOKEN)
  }

  get token(): string | undefined | null{
    return localStorage.getItem(TOKEN)
  }

  canActivate(next: ActivatedRouteSnapshot):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return of(this.isLogedIn)
      .pipe(
        map((isLogedIn) =>
          isLogedIn ? true : createUrlTreeFromSnapshot(next, ['/', 'login'])
        )
      )
  }
}
