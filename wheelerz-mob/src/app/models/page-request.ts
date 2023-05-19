export interface PageRequest {
    size: number
    current: number
}
export interface PageResponse<T> {
    total: number
    result: T
}