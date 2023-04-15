import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router, UrlTree, createUrlTreeFromSnapshot } from '@angular/router'
import { Observable, of, map } from 'rxjs'
import { User } from '../models/user'
import { LoginResponse } from '../models/login-response'

const TOKEN = 'token'
const ROLE = 'role'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private router: Router) { }

  logOut(): void {
    localStorage.clear()
    this.router.navigateByUrl('/login')
  }

  login(user: LoginResponse): void {
    if (!user.token) return
    localStorage.setItem(TOKEN, user.token)
    localStorage.setItem(ROLE, `${user.role}`)
    this.router.navigateByUrl('/home')
  }

  get isLogedIn(): boolean {
    return !!localStorage.getItem(TOKEN)
  }

  get token(): string | undefined | null {
    return localStorage.getItem(TOKEN)
  }

  get isAdmin(): boolean {
    return localStorage.getItem(ROLE) === '1'
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
