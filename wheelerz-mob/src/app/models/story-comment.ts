import { User } from "./user";

export interface StoryComment {
    user?: User
    id?: number
    text: string
    dateAdd?: Date
    storyId?: number
    isMy?: boolean
}