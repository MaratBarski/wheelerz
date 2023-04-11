import { Country, State } from "./country"
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
    registrDate?: Date
    phone?: string
    mobilities?: MobilityType[]
    noWalk?: number
    chairInfo?: {
        seatHeight: number
        width: number
        length: number
        messure: string
    }
}