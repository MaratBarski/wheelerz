import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { SearchBoxComponent } from 'src/app/components/search-box/search-box.component';
import { StoryCardComponent } from 'src/app/components/story-card/story-card.component';
import { Story } from 'src/app/models/story';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { DataService } from 'src/app/services/data.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-cities-accessibility',
  standalone: true,
  imports: [CommonModule, StoryCardComponent, TranslatePipe, SearchBoxComponent],
  templateUrl: './cities-accessibility.component.html',
  styleUrls: ['./cities-accessibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CitiesAccessibilityComponent {
  dataService = inject(DataService)
  stories$!: Observable<Story[]>
  loader = inject(LoaderService)

  search(text: string): void {
    this.loader.load(true)
    this.stories$ = this.dataService.getStories('accessibilities', text).pipe(
      tap(() => {
        this.loader.load(false)
      }))
  }

  ngOnInit(): void {
    this.search('')
  }
}
