import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {

  addZero(i: number): string {
    return i > 9 ? `${i}` : `0${i}`
  }

  dateToString(date: Date | undefined): string | null {
    if (!date) return null
    date = new Date(date)
    return `${this.addZero(date.getDate())}/${this.addZero(1 + date.getMonth())}/${date.getFullYear()}`
  }
}
