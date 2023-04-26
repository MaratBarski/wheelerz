import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, map, of, tap } from 'rxjs'
import { Country, State } from '../models/country'
import { SERVER_URL } from '../consts'
import { Story } from '../models/story'
import { User } from '../models/user'
import { FileImage } from '../models/fileImage'
import { MobilityDto, UserMobility } from '../models/user-accessibility'
import { PageResponse } from '../models/page-request'
import { StorySelector } from '../models/story-selector'
import { UserSelector } from '../models/user-selector'
import { StoryComment } from '../models/story-comment'
import { Translation } from '../models/translation'
import { ChangePassowrd } from '../models/change-pwd'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private _countries?: Country[];
  private _cities: { [key: number]: State[] } = {}

  getCoutries(exists = false, type = 0): Observable<Country[]> {
    if (this._countries?.length) return of(this._countries)
    return this.http.get<Country[]>(`${SERVER_URL}/country/countries/?exists=${exists}&type=${type}`)
      .pipe(tap(res => this._countries = res))
  }

  getStates(countryId: number, exists = false, type = 0): Observable<State[]> {
    if (this._cities[countryId]?.length) return of(this._cities[countryId])
    return countryId ? this.http.get<State[]>(`${SERVER_URL}/country/states/${countryId}/?exists=${exists}&type=${type}`)
      .pipe(tap(res => this._cities[countryId] = res))
      : of([]);
  }

  post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(`${SERVER_URL}/${url}`, data)
  }

  put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(`${SERVER_URL}/${url}`, data)
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${SERVER_URL}/${url}`)
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${SERVER_URL}/${url}`)
  }

  addStory(story: Story): Observable<Story> {
    return this.post<Story>('story', story)
  }

  getMyProfile(id: any = 0): Observable<User> {
    if (!id) id = 0
    return this.get<User>(`User/my-profile/${id}`)
  }

  changeAvatar(file: FileImage, uid: number): Observable<string> {
    return this.post<string>(`User/avatar/?uid=${uid}`, file)
  }

  getModilityDefinition(): Observable<UserMobility> {
    return this.http.get<UserMobility>('./assets/data/user-accessibility.json')
  }

  updateUserMobility(mob: MobilityDto): Observable<any> {
    return this.post<any>('User/mobility', mob)
  }

  getUserMobility(): Observable<MobilityDto> {
    return this.get<MobilityDto>('User/mobility')
  }

  getStoryById(id: number): Observable<Story> {
    return this.get<Story>(`Story/${id}`)
  }

  updateStory(story: Story): Observable<any> {
    return this.put('story', story)
  }

  deleteStory(id: number): Observable<any> {
    return this.delete(`story/${id}`)
  }

  updateProfile(user: User): Observable<any> {
    return this.put('user', user)
  }

  getUserInfo(id: any = 0): Observable<User> {
    if (!id) id = 0
    return this.get(`user/info/${id}`)
  }

  selectStories(selector: StorySelector): Observable<PageResponse<Story[]>> {
    return this.post<PageResponse<Story[]>>(`story/select`, selector)
  }

  getUsers(selector: UserSelector): Observable<PageResponse<User[]>> {
    return this.post('user', selector)
  }

  deleteUser(id: number): Observable<any> {
    return this.delete(`user/${id}`)
  }

  hasMod(): Observable<boolean> {
    return this.get('user/hasmob').pipe(map((x: any) => x.count))
  }

  addComment(comment: StoryComment): Observable<StoryComment[]> {
    return this.post('story/add-comment', comment)
  }

  deleteComment(id: number, storyId: number): Observable<StoryComment[]> {
    return this.delete(`story/delete-comment/${id}/${storyId}`)
  }

  getTranslations(lang: string = ''): Observable<Translation[]> {
    return this.get(`translation/all?lang=${lang}`)
  }

  changePassword(pwd: ChangePassowrd): Observable<any> {
    return this.post('auth/change-password', pwd)
  }

  updateTranslation(t: { key: string, lang: string, text: string }): Observable<any> {
    return this.post('translation', t)
  }

  deleteTranslation(key: string): Observable<any> {
    return this.delete(`translation/${key}`)
  }

  translateAll(lang: string) {
    this.http.get('./assets/translations/' + lang + '.json').subscribe((res: any) => {
      const tr = res
      Object.keys(tr).forEach(k => {
        const t = { key: k, text: tr[k], lang: lang }
        this.post('translation', t).subscribe()
      })
    })
  }

  addCountries(): void {
    this.http.get('./assets/data/countries.json')
      .subscribe((res: any) => {
        const countries = res.map((x: any) => {
          return {
            name: x.country,
            states: x.cities.map((y: any) => {
              return {
                name: y
              }
            })
          }
        })

        this.post('Country', countries).subscribe(() => {
          alert('end')
        })
      })
  }
}
