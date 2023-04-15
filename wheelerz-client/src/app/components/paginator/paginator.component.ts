import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule,TranslatePipe],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {
  @Input() current = 0
  @Input() total = 0
  @Input() size = 1

  @Output() onPageChange = new EventEmitter<number>()

  get isFirst(): boolean {
    return this.current === 0
  }

  get isLast(): boolean {
    return (this.current + 1) * this.size >= this.total
  }

  get totalPages(): number {
    let p = Math.floor(this.total / this.size)
    if (this.total % this.size) p++;
    return p
  }

  next(value: -1 | 1): void {
    this.current += value
    this.onPageChange.emit(this.current)
  }
}
