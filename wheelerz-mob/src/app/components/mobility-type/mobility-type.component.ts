import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MobilityType } from 'src/app/models/user-accessibility'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'

@Component({
  selector: 'app-mobility-type',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './mobility-type.component.html',
  styleUrls: ['./mobility-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobilityTypeComponent implements OnInit {
  @Input() types!: MobilityType[]
  @Input() mobilitySet = new Set<string>()

  @Output() onChange = new EventEmitter<Set<string>>()
  @Output() onNowalk = new EventEmitter<boolean>()

  noWalk = false

  update(t: MobilityType): void {
    if (this.mobilitySet.has(t.name)) this.mobilitySet.delete(t.name)
    else this.mobilitySet.add(t.name)
    if (t.noWalk) {
      this.noWalk = this.mobilitySet.has(t.name)
      this.onNowalk.emit(this.noWalk)
    }
    this.onChange.emit(this.mobilitySet)
  }

  isSelected(t: MobilityType): boolean {
    return this.mobilitySet.has(t.name)
  }

  ngOnInit(): void {
    this.noWalk = !!this.types.find(x => x.noWalk && this.isSelected(x))
    this.onNowalk.emit(this.noWalk)
  }
}
