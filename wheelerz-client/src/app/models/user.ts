import { Country, State } from "./country"
import { Story } from "./story"
import { MobilityType } from "./user-accessibility"

export interface User {
    id?: number
    role?: number
    avatar?: string
    countryId?: number
    stateId?: number
    country?: Country
    state?: State
    sex?: number
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    key?: string
    birthDay?: Date
    birthYear?: number
    registrDate?: Date
    lastVisit?: Date
    birthDayDisplay?: string | null | undefined
    phone?: string
    mobilities?: MobilityType[]
    noWalk?: number
    stories?: Story[]
    chairInfo?: {
        seatHeight: number
        width: number
        length: number
        messure: string
    }
}