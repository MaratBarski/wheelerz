import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http'
import { catchError, throwError } from 'rxjs'
import { LoginService } from './login.service'

@Injectable({
  providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private loginService: LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    if (this.loginService.isLogedIn) {
      request = request = request.clone({
        setHeaders: { Authorization: `${this.loginService.token}` }
      })
    }
    return (next.handle(request) as any).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) this.loginService.logOut()
        return throwError(() => error)
      })
    );
  }
}
