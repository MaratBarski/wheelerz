import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, first, map } from 'rxjs';

const langs = ['en', 'he'];
const deflang = 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private http: HttpClient) {
    this.setDefaultTranslation();
  }

  setDefaultTranslation(): void {
    if (!localStorage.getItem('lang')) localStorage.setItem('lang', deflang);
    let l = localStorage.getItem('lang') || 'none'
    if (langs.indexOf(l) === -1) localStorage.setItem('lang', deflang);
    l = localStorage.getItem('lang') || deflang;
    this.setTranslation(l);
  }

  get isLoaded(): boolean {
    return this._loaded;
  }

  get lang(): string {
    return localStorage.getItem('lang') || deflang;
  }

  get direction(): string {
    return this.lang === 'he' ? 'rtl' : 'ltr';
  }

  get isRtl(): boolean {
    return this.direction === 'rtl';
  }

  get loadTranslation(): Observable<any> {
    return this._loadTranslation.asObservable();
  }

  private _loadTranslation = new BehaviorSubject<any>({});
  private translation: any = {};
  private _loaded = false;

  translate(key: string): any {
    return this.translation[key] || key;
  }

  translateAsync(key: string): Observable<any> {
    return this.loadTranslation.pipe(map(res => res[key]));
  }

  setTranslation(lang: string): void {
    if (langs.indexOf(lang) === -1) return;
    this._loaded = false;
    localStorage.setItem('lang', lang);
    this.http.get(`./assets/translations/${lang}.json`)
      .pipe(first())
      .subscribe(res => {
        this.translation = res;
        this._loaded = true;
        this._loadTranslation.next(res)
      })
  }
}
