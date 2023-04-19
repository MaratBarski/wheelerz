import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { Country, State } from '../models/country'
import { SERVER_URL } from '../consts'
import { Story } from '../models/story'
import { User } from '../models/user'
import { FileImage } from '../models/fileImage'
import { MobilityDto, UserMobility } from '../models/user-accessibility'
import { StoryRequest } from '../models/story-dto'
import { PageResponse } from '../models/page-request'
import { StorySelector } from '../models/story-selector'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getCoutries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${SERVER_URL}/country/countries`)
  }

  getStates(countryId: number): Observable<State[]> {
    return countryId ? this.http.get<State[]>(`${SERVER_URL}/country/states/${countryId}`) : of([]);
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

  getStories(request: StoryRequest): Observable<PageResponse<Story[]>> {
    return this.post<PageResponse<Story[]>>(`story/search`, request)
  }

  getMyProfile(): Observable<User> {
    return this.get<User>('User/my-profile')
  }

  changeAvatar(file: FileImage): Observable<string> {
    return this.post<string>('User/avatar', file)
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

  getUserInfo(): Observable<User> {
    return this.get('user/info')
  }

  selectStories(selector: StorySelector): Observable<PageResponse<Story[]>> {
    return this.post<PageResponse<Story[]>>(`story/select`, selector)
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
