import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { Observable, first, forkJoin, tap } from 'rxjs'
import { Translation } from 'src/app/models/translation'
import { FormsModule } from '@angular/forms'
import { LoaderService } from 'src/app/services/loader.service'

@Component({
  selector: 'app-translation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TranslationComponent implements OnInit, OnDestroy {
  dataService = inject(DataService)
  cd = inject(ChangeDetectorRef)
  loader = inject(LoaderService)

  translations$!: Observable<Translation[]>;
  trans: { he: string; en: string; key: string }[] = []
  key = ''
  eng = ''
  heb = ''

  ngOnInit(): void {
    this.load()
    this.loader.showTopMenu(false)
    //this.dataService.translateAll('en')
    //this.dataService.translateAll('he')
  }

  ngOnDestroy(): void {
    this.loader.showTopMenu(true)
  }

  load(): void {
    this.loader.load(true)
    const he: any = {}
    const en: any = {}
    this.translations$ = this.dataService.getTranslations().pipe(tap(res => {
      res.forEach(x => {
        if (!x.key) return
        if (x.lang === 'he') he[x.key] = x.text
        if (x.lang === 'en') en[x.key] = x.text
      })
      this.trans = []
      Object.keys(he).forEach(k => {
        const th = he[k]
        const te = en[k]
        this.trans.push({ key: k, en: te, he: th })
      })
      this.loader.load(false)
      this.cd.markForCheck()
    }))
  }

  update(t: { he: string; en: string; key: string }, l: 'en' | 'he'): void {
    this.dataService.updateTranslation({ key: t.key, lang: l, text: t[l] }).pipe(first()).subscribe()
  }

  delete(key: string): void {
    if (confirm('Are you sure?')) {
      this.dataService.deleteTranslation(key).pipe(first()).subscribe(() => {
        this.load()
        this.cd.markForCheck()
      })
    }
  }

  add(): void {
    if (!this.key) return
    if (!this.eng) return
    if (!this.heb) return
    this.loader.load(true)
    forkJoin([
      this.dataService.updateTranslation({ key: this.key, lang: 'en', text: this.eng }),
      this.dataService.updateTranslation({ key: this.key, lang: 'he', text: this.heb })
    ]).pipe(first()).subscribe(() => {
      this.key = ''
      this.eng = ''
      this.heb = ''
      this.load()
      this.cd.markForCheck()
    })
  }
}
