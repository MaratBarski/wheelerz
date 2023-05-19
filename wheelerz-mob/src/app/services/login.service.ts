import { Injectable, inject } from '@angular/core';
import { UrlTree } from '@angular/router';
import { BehaviorSubject, Observable, first, tap } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../consts';
import { User } from '../models/user';
import { LoginResponse } from '../models/login-response';

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

  get onLogin(): Observable<boolean> {
    return this._onLogin.asObservable()
  }
  private _onLogin = new BehaviorSubject<boolean>(this.isLogedIn)

  registr(data: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${SERVER_URL}/auth/registr`, data).pipe(first())
  }

  get isLogedIn(): boolean {
    return this.userService.isLogedIn
  }

  get token(): string | undefined | null {
    return this.userService.token
  }

  logOut(): void {
    this._onLogin.next(false)
    this.userService.logOut()
  }

  login(data: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${SERVER_URL}/auth/login`, data).pipe(
      first(),
      tap(res => this.loginSucc(res))
    )
  }

  loginSucc(data: LoginResponse): void {
    if (data.error) return

    this.userService.login(data)
    this._onLogin.next(true)
  }
}
