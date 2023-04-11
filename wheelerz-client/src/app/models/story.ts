import { WizardItem } from "./accesability"
import { Country, State } from "./country"
import { FileImage, StoryPhoto } from "./fileImage"
import { User } from "./user"

export enum StoryType {
    story = 1,
    hotel = 2,
    city = 3,
    activity = 4
}
export interface BaseItem {
    id?: number
    name?: string
}
export interface Link extends BaseItem {
    url: string
}
export interface Attachment extends Link {
}
export interface Story extends BaseItem {
    cityId?: number
    countryId?: number
    estimation?: number
    title?: string
    comments?: string
    storyType?: StoryType
    startDate?: Date
    endDate?: Date
    stories?: Story[]
    accessibility?: WizardItem[]
    links?: Link[]
    images?: Attachment[]
    photos?: FileImage[]
    storyPhotos?: StoryPhoto[]
    user?: User
    country?: Country
    city?: State
}
