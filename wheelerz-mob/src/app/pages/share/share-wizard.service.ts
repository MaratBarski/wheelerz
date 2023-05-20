import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class ShareWizardService {

  get isShowTabs(): Observable<boolean> {
    return this._onShowTabs.asObservable()
  }
  private _onShowTabs = new BehaviorSubject<boolean>(true)

  showTabs(value: boolean): void {
    this._onShowTabs.next(value)
  }
}
