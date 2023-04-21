import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnDestroy, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { ActivatedRoute } from '@angular/router'
import { Observable, first, map, tap } from 'rxjs'
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
import { InputCommentComponent } from 'src/app/components/input-comment/input-comment.component'
import { FormControl, FormGroup } from '@angular/forms'
import { StoryComment } from 'src/app/models/story-comment'
import { AvatarComponent } from 'src/app/components/avatar/avatar.component'

@Component({
  selector: 'app-story-view',
  standalone: true,
  imports: [CommonModule,
    TranslatePipe,
    StarsComponent,
    StoryImgComponent,
    ImageComponent,
    BigImageComponent,
    AvatarComponent,
    TopProfileComponent,
    AccessibilityViewComponent,
    InputCommentComponent,
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
  cd = inject(ChangeDetectorRef)


  comments: StoryComment[] = []
  id = 0
  story$!: Observable<Story>
  form = new FormGroup({
    comments: new FormControl('')
  })

  ngOnInit(): void {
    this.id = +(this.activatedRoute.snapshot.paramMap.get('id') || '0')
    this.loadStory()
    this.loader.showTopMenu(false)
  }

  loadStory(): void {
    this.loader.load(true)
    this.story$ = this.dataService.getStoryById(this.id).pipe(map((res) => {
      return { ...res, photos: res.storyPhotos?.map(x => ({ id: x.id, small: x.small, fileName: x.fileName })) }
    }),
      tap(res => this.comments = res.userComments || []),
      tap(() => this.loader.load(false)))
  }

  ngOnDestroy(): void {
    this.loader.showTopMenu(true)
  }

  addComment(): void {
    const v = (this.form.get('comments')?.value || '').trim();
    if (!v) return
    const comment: StoryComment = {
      text: v,
      storyId: this.id
    }
    this.form.patchValue({ comments: '' })
    this.loader.load(true)
    this.dataService.addComment(comment).pipe(first()).subscribe((res) => {
      this.comments = res
      this.loader.load(false)
      this.cd.markForCheck()
    })
  }
}
