import { Component, Input, ChangeDetectionStrategy, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserPermissins } from 'src/app/models/permissions';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-permissions',
  standalone: true,
  imports: [CommonModule, TranslatePipe, FormsModule],
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPermissionsComponent implements OnChanges {
  @Input() permission = 0

  @Output() onChanged = new EventEmitter<number>()

  checkBoxes: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.init()
  }

  init(): void {
    this.checkBoxes =
      Object.keys(UserPermissins).map(k => ({ name: k, value: UserPermissins[k], state: (UserPermissins[k] & (this.permission || 0)) }))
  }

  update(item: { state: boolean, value: number }): void {
    this.permission = this.permission || 0
    if (item.state) this.permission |= item.value
    else this.permission -= item.value
    this.onChanged.emit(this.permission)
  }
}
