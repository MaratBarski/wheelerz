import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnDestroy, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataService } from 'src/app/services/data.service'
import { ActivatedRoute } from '@angular/router'
import { Observable, Subject, first, map, takeUntil, tap } from 'rxjs'
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
import { UserService } from 'src/app/services/user.service'
import { WizardItem } from 'src/app/models/accesability'
import { PhotoGalleryComponent } from 'src/app/components/photo-gallery/photo-gallery.component'
import { SocketService } from 'src/app/services/socket.service'
import { Rooms } from 'src/app/models/topic'
import { MapComponent } from 'src/app/components/map/map.component'
import { IonicModule } from '@ionic/angular'

@Component({
  selector: 'app-story-view',
  standalone: true,
  imports: [
    CommonModule,
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
    PhotoGalleryComponent,
    FileImageComponent,
    MapComponent,
    IonicModule
  ],
  templateUrl: './story-view.component.html',
  styleUrls: ['./story-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryViewComponent implements OnInit, OnDestroy {
  dataService = inject(DataService)
  activatedRoute = inject(ActivatedRoute)
  loader = inject(LoaderService)
  cd = inject(ChangeDetectorRef)
  userService = inject(UserService)
  socket = inject(SocketService)
  isModalOpen = false
  currentAccItem: any | undefined

  private destroy = new Subject<void>()

  comments: StoryComment[] = []
  id = 0
  story$!: Observable<Story>
  isHotel = false
  form = new FormGroup({
    comments: new FormControl('')
  })

  ngOnInit(): void {
    this.id = +(this.activatedRoute.snapshot.paramMap.get('id') || '0')
    this.loadStory()
    this.loadComments()
    //this.loader.showTopMenu(false)

    this.socket.subscribe(`${Rooms.deleteComment}-${this.id}`)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        this.comments = this.comments.filter(x => x.id !== res.data)
        this.cd.markForCheck()
      })

    this.socket.subscribe(`${Rooms.addComment}-${this.id}`)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        this.comments = res.data
        this.cd.markForCheck()
      })
  }

  loadComments(): void {
    this.dataService.getStoryComments(this.id)
      .pipe(tap(() => this.cd.markForCheck()), first())
      .subscribe(res => this.comments = res)
  }

  loadStory(): void {
    this.loader.load(true)
    this.cd.markForCheck()
    this.story$ = this.dataService.getStoryById(this.id).pipe(map((res) => {
      return { ...res, photos: res.storyPhotos?.map(x => ({ id: x.id, small: x.small, fileName: x.fileName })) }
    }),
      tap(res => this.isHotel = res.storyType === 2),
      tap(() => this.loader.load(false)))
  }

  ngOnDestroy(): void {
    this.loader.showTopMenu(true)
    this.destroy.next()
    this.socket.unsubscribe(`${Rooms.deleteComment}-${this.id}`)
    this.socket.unsubscribe(`${Rooms.addComment}-${this.id}`)
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
      this.loadComments()
      this.loader.load(false)
      this.cd.markForCheck()
    })
  }

  isDeleteEnable(item: StoryComment): boolean {
    return this.userService.isAdmin || !!item.isMy
  }

  deleteComment(com: StoryComment): void {
    if (!com.id) return
    this.loader.load(true)
    this.dataService.deleteComment(com.id, this.id).pipe(first()).subscribe(res => {
      this.comments = this.comments.filter(x => x.id !== com.id)
      this.loader.load(false)
      this.cd.markForCheck()
    })
  }

  openAcc(item: WizardItem): void {
    if (!item.id) return

    this.loader.load(true)
    this.cd.markForCheck()
    this.dataService.getAccessibilityFiles(item.id)
      .pipe(
        first(),
        tap(() => this.loader.load(false))
      )
      .subscribe(res => {
        item = { ...item, files: res }
        this.isModalOpen = true
        this.currentAccItem = {
          ...item, files: item.files?.map(x => x.fileName)
        }
        this.cd.markForCheck()
      })
  }
}
