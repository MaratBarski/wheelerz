import { Injectable, inject } from '@angular/core';

import * as signalr from '@microsoft/signalr';
import { LoginService } from './login.service';
import { IS_SOCKET_DISABLE, SERVER_URL } from '../consts';
import { BehaviorSubject, Observable, Subject, filter, first } from 'rxjs';
import { Rooms } from '../models/topic';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  loginService = inject(LoginService)

  constructor() {
    this.loginService.onLogin.subscribe(res => {
      if (res) this.connectToHub()
      else this.disconnect()
    })
  }

  get isConnected(): boolean {
    return this.connection?.state === 'Connected'
  }

  get onConnect(): Observable<boolean> {
    return this._onConnect.asObservable()
  }
  private _onConnect = new BehaviorSubject<boolean>(false)

  connection?: signalr.HubConnection;

  subjects: { [key: string]: Subject<any> } = {
    [Rooms.userNewComment]: new Subject<any>()
  }

  async unsubscribe(room: string) {
    this.invoke('LeaveRoom', room)

    this.subjects[room].complete()
    delete this.subjects[room]

    console.log(`Unsubscribe from ${room}`)
    console.log(Object.keys(this.subjects))
  }

  subscribe(room: string): Subject<any> {
    const subject = new Subject<any>()
    this.subjects[`${room}`] = subject
    this.invoke('JoinRoom', room)

    console.log(`Subscribe to ${room}`)
    console.log(Object.keys(this.subjects))

    return subject
  }

  invoke(func: string, room: string): void {
    if (IS_SOCKET_DISABLE) return

    this.onConnect
      .pipe(filter(res => res), first())
      .subscribe(async () => {
        if (!this.isConnected) return
        await this.connection?.invoke(func, room)
      })
  }

  async createConnection() {
    if (IS_SOCKET_DISABLE) return
    if (this.connection?.state === 'Connected') return
    //await this.disconnect()

    let sr = new signalr.HubConnectionBuilder();
    this.connection = sr.withUrl(`${SERVER_URL}/chatHub?token=${this.loginService.token}&iang=${localStorage.getItem('lang')}`, {
      withCredentials: true
    }).build();
    try {
      await this.connection.start()
      this._onConnect.next(true)
    } catch (e) {
      console.error(e)
    }
    this.connection?.on('message', ((res) => {
      this.subjects[res.room].next(res)
    }))

    this.connection?.on('notification', ((res) => {
      this.subjects[Rooms.userNewComment].next(res)
      console.log(res)
    }))

    this.connection?.on('Connected', ((res) => {
      console.log(res)
    }));
  }

  async connectToHub() {
    if (this.connection) return
    await this.createConnection()
  }

  async disconnect() {
    if (this.connection) await this.connection.stop()
    this.connection = undefined
    this._onConnect.next(false)
  }

}
