import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  get onReload(): Observable<void> {
    return this._onReload.asObservable()
  }
  private _onReload = new Subject<void>()

  reload(): void {
    this._onReload.next()
  }

  get loading(): Observable<boolean> {
    return this._loading.asObservable()
  }
  private _loading = new BehaviorSubject<boolean>(false)

  load(f: boolean): void {
    this._loading.next(f)
  }

  get onShowTopMenu(): Observable<boolean> {
    return this._onShowTopMenu.asObservable()
  }
  private _onShowTopMenu = new BehaviorSubject<boolean>(true)

  showTopMenu(value: boolean): void {
    this._onShowTopMenu.next(value)
  }

  get currentShareUrl(): Observable<string> {
    return this._onShareUrl.asObservable()
  }
  private _onShareUrl = new BehaviorSubject<string>('story')

  setShareUrl(value: string) {
    this._onShareUrl.next(value)
  }
}
