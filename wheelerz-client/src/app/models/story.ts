import { WizardItem } from "./accesability"
import { Country, State } from "./country"
import { FileImage, StoryPhoto } from "./fileImage"
import { StoryComment } from "./story-comment"
import { User } from "./user"
import { MobilityType } from "./user-accessibility"

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
    startDateDisplay?: string | null
    endDateDisplay?: string | null
    dateAdd?: Date
    stories?: Story[]
    accessibility?: WizardItem[]
    links?: Link[]
    images?: Attachment[]
    photos?: FileImage[]
    storyPhotos?: StoryPhoto[]
    user?: User
    country?: Country
    city?: State
    mobilities?: MobilityType[]
    phone?: string
    address?: string
    map?: string
    mail?: string
    link?: string
    mainImage?: string
    userComments?: StoryComment[]
}
