import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { Subject, debounceTime, fromEvent, takeUntil } from 'rxjs'

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>()
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>
  @Input() minLength = 2
  @Input() pause = 500
  @Input() text = ''
  prevText = ''
  @Output() onSearch = new EventEmitter<string>()

  get textTrim(): string {
    return (this.text || '').trim();
  }

  ngOnInit(): void {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(this.pause), takeUntil(this.destroy))
      .subscribe(() => {
        if (this.prevText === this.text) return
        if (this.text.length < this.minLength && this.text != '') return
        this.prevText = this.text
        this.onSearch.emit(this.textTrim)
      })
  }

  ngOnDestroy(): void {
    this.destroy.next()
  }
}
