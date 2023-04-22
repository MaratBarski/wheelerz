import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router'
import { NavLink } from 'src/app/models/navigation'
import { TabulatorComponent } from 'src/app/components/tabulator/tabulator.component'
import { ShareWizardService } from './share-wizard.service'

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TabulatorComponent],
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
  providers: [ShareWizardService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareComponent implements OnInit {

  shareWizardService = inject(ShareWizardService)
  router = inject(Router)

  tabs: NavLink[] = [
    { link: 'story', name: 'add_a_story', image: 'story' },
    { link: 'hotel-review', name: 'add_a_hotel_review', image: 'addhotel' },
    { link: 'cities-accessibility', name: 'add_a_city_review', image: 'addcity' },
    //{ link: 'trends', name: 'add_a_new_activity', image: 'addactivity' }
  ]

  ngOnInit(): void {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //   }
    //   if (event instanceof NavigationEnd) {
    //     alert(this.router.url)
    //   }
    //   if (event instanceof NavigationError) {
    //   }
    // })
  }
}
