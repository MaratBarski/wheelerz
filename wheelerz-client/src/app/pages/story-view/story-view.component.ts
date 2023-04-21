import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { ActivatedRoute } from '@angular/router'
import { Observable, map } from 'rxjs'
import { Story } from 'src/app/models/story'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { TopProfileComponent } from 'src/app/components/top-profile/top-profile.component'
import { StarsComponent } from 'src/app/components/stars/stars.component'
import { AccessibilityViewComponent } from 'src/app/components/accessibility-view/accessibility-view.component'
import { LoaderService } from 'src/app/services/loader.service'
import { FileImageComponent } from 'src/app/components/file-image/file-image.component'
import { BigImageComponent } from 'src/app/components/big-image/big-image.component'
import { ImageComponent } from 'src/app/components/image/image.component'
import { StoryImgComponent } from 'src/app/components/story-img/story-img.component'
import { AddressComponent } from 'src/app/components/address/address.component'

@Component({
  selector: 'app-story-view',
  standalone: true,
  imports: [CommonModule,
    TranslatePipe,
    StarsComponent,
    StoryImgComponent,
    ImageComponent,
    BigImageComponent,
    TopProfileComponent,
    AccessibilityViewComponent,
    AddressComponent,
    FileImageComponent],
  templateUrl: './story-view.component.html',
  styleUrls: ['./story-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryViewComponent implements OnInit, OnDestroy {
  dataService = inject(DataService)
  activatedRoute = inject(ActivatedRoute)
  loader = inject(LoaderService)
  story$!: Observable<Story>

  ngOnInit(): void {
    const id = +(this.activatedRoute.snapshot.paramMap.get('id') || '0')
    this.story$ = this.dataService.getStoryById(id).pipe(map((res) => {
      return { ...res, photos: res.storyPhotos?.map(x => ({ id: x.id, small: x.small, fileName: x.fileName })) }
    }))
    this.loader.showTopMenu(false)
  }

  ngOnDestroy(): void {
    this.loader.showTopMenu(true)
  }

}
