import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { WizardItem } from '../models/accesability'

@Injectable({
  providedIn: 'root'
})
export class AccessibilityWizardService {

  constructor(private http: HttpClient) { }

  getWizard(): Observable<WizardItem[]> {
    return this.http.get<WizardItem[]>('./assets/data/accessibility.json')
  }
}
