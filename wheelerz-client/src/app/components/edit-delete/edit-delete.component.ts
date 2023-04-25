import { Component, ChangeDetectionStrategy, Input, inject, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateAsyncPipe } from 'src/app/pipes/translate.pipe'
import { ImageComponent } from '../image/image.component'
import { RouterModule } from '@angular/router'
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-edit-delete',
  standalone: true,
  imports: [CommonModule, TranslateAsyncPipe, RouterModule, ImageComponent],
  templateUrl: './edit-delete.component.html',
  styleUrls: ['./edit-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class EditDeleteComponent {
  userService = inject(UserService)

  @Input() editable = false
  @Input() post!: any
  @Input() editUrl!: string
  @Output() onDelete = new EventEmitter<any>()
  @Output() onEdit = new EventEmitter<any>()
}
