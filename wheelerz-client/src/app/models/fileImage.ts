export interface FileImage {
    small: string
    big: string
}
export interface StoryPhoto {
    id?: number
    storyId?: number
    small: string
    fileName: string
}
export interface AccessibilityPhoto {
    id?: number
    accessibilityId?: number
    small: string
    userId: string
    fileName: string
}