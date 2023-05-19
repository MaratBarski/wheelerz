import { BaseRequest } from "./base-request"
import { PageRequest } from "./page-request"

export interface UserSelector extends BaseRequest {
    countryId?: number
    cityId?: number
    page: PageRequest
}