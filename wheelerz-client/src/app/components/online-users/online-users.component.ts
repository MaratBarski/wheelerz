import { Component, ChangeDetectionStrategy, inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SocketService } from 'src/app/services/socket.service'
import { Rooms } from 'src/app/models/topic'
import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'app-online-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnlineUsersComponent implements OnInit, OnDestroy {
  socket = inject(SocketService)
  cd = inject(ChangeDetectorRef)

  private destroy = new Subject<void>()

  users = []

  ngOnDestroy(): void {
    this.destroy.next()
    this.socket.unsubscribe(Rooms.onlineUsers)
  }

  ngOnInit(): void {
    this.socket.subscribe(Rooms.onlineUsers)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        this.users = res.data
        this.cd.markForCheck()
      })
  }

}
