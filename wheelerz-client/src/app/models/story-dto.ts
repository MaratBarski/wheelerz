import { BaseRequest } from "./base-request";
import { PageRequest } from "./page-request";

export interface StoryRequest extends BaseRequest {
    type: number
    page: PageRequest
}
