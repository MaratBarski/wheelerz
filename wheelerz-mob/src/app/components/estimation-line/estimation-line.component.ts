import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estimation-line',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estimation-line.component.html',
  styleUrls: ['./estimation-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationLineComponent {
  @Input() estimation!: number;
  @Input() estimations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  @Output() change = new EventEmitter<number>();
}
