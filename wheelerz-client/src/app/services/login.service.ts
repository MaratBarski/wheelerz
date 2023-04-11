import { Injectable, inject } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable, first, tap } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../consts';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  http = inject(HttpClient)
  constructor(private userService: UserService) { }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return !this.userService.isLogedIn
  }

  registr(data: User): Observable<any> {
    return this.http.post(`${SERVER_URL}/auth/registr`, data).pipe(first())
  }

  get isLogedIn(): boolean {
    return this.userService.isLogedIn
  }

  get token(): string | undefined | null {
    return this.userService.token
  }

  logOut(): void {
    this.userService.logOut()
  }

  login(data: { email: string, password: string }): Observable<any> {
    return this.http.post(`${SERVER_URL}/auth/login`, data).pipe(
      first(),
      tap(res => this.loginSucc(res))
    )
  }

  loginSucc(data: any): void {
    if (data.error) return

    this.userService.login(data.token)
  }
}
