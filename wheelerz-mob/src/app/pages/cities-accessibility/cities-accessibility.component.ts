import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { LoaderService } from 'src/app/services/loader.service';
import { StoryListComponent } from 'src/app/components/story-list/story-list.component';

@Component({
  selector: 'app-cities-accessibility',
  standalone: true,
  imports: [CommonModule, StoryListComponent, TranslatePipe ],
  templateUrl: './cities-accessibility.component.html',
  styleUrls: ['./cities-accessibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CitiesAccessibilityComponent {
  loader = inject(LoaderService)

  ngOnInit(): void {
    this.loader.setShareUrl('cities-accessibility')
  }
}
