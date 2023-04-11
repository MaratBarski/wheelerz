import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-input-line',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './input-line.component.html',
  styleUrls: ['./input-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputLineComponent {
  @Input() name = ''
}
