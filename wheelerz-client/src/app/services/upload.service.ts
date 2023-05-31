import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { SERVER_URL } from '../consts';
import { BehaviorSubject, Observable, first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  get uploadStateChanged(): Observable<number> {
    return this._uploadStateChanged.asObservable()
  }
  private _uploadStateChanged = new BehaviorSubject<number>(0)

  get uploadProgressChanged(): Observable<number> {
    return this._uploadProgressChanged.asObservable()
  }
  private _uploadProgressChanged = new BehaviorSubject<number>(0)

  deleteFile(name: string | undefined): Observable<any> {
    return this.http.delete(`${SERVER_URL}/upload/${name}`).pipe(first())
  }

  async upload(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      this.http.post(`${SERVER_URL}/upload`, formData, { reportProgress: true, observe: 'events' })
        .subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress)
              this._uploadProgressChanged.next(Math.round(100 * event.loaded / (event.total || 1)));
            else if (event.type === HttpEventType.Response)
              resolve(event.body)
          },
          error: (err: HttpErrorResponse) => {
            this._uploadStateChanged.next(0)
          }
        });
    })

  }
}
