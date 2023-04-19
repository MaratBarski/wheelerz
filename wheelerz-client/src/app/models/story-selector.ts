import { BaseRequest } from "./base-request"
import { PageRequest } from "./page-request"

export interface StorySelector extends BaseRequest {
    countryId?: number
    cityId?: number
    type: number
    mobilities: Record<string, boolean>,
    page: PageRequest
    isMyInclude?: boolean
}