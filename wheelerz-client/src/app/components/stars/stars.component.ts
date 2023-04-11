import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarsComponent {
  translationService = inject(TranslationService)
  @Input() set estimation(value: number) {
    this.stars = [];
    for (let i = 0; i < Math.floor(value * 5 / 10); i++) this.stars.push('star-full');
    if (value % 2) this.stars.push('star-half');
    while (this.stars.length < 5) this.stars.push('star-empty');
  }
  stars: string[] = [];
}
