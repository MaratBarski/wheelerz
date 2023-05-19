import { KeyValue } from "@angular/common"

export interface MobilityType {
    name: string
    noWalk?: boolean
}
export interface ChairOption {
    name: string
    values: KeyValue<string, string>[]
    selectedKey: string
}
export interface ChairInfo {
    width: number
    length: number
    seatHeight: number
    values: KeyValue<string, string>[]
}
export interface UserMobility {
    types: MobilityType[]
    chairOptions: ChairOption[]
}
export interface MobilityDto {
    mobilities: MobilityType[]
    chairOptions: {
        key: string
        value: string
    }[],
    chairInfo: {
        width: number
        length: number
        seatHeight: number
        messure: string
    }
}