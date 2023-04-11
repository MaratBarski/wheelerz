import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavLink } from 'src/app/models/navigation';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {
  @Input() links: NavLink[] = [
    { name: 'road_trip_stories', link: 'stories' },
    { name: 'hotel_reviews', link: 'hotel-reviews' },
    { name: 'cities_accessibility', link: 'cities-accessibility' },
    { name: 'trends', link: 'fellow-travelers' },
    { name: 'share', link: 'share' },
  ]

}
