import { KeyValue } from "@angular/common"
import { AccessibilityPhoto, FileImage } from "./fileImage"

export interface WizardRadioItem {
    items?: KeyValue<string, string>[]
    selectedKey?: string
    selectedValue?: string
    name?: string
    key?: string
}
export interface WizardItem {
    id?: number;
    img?: string
    name?: string
    key?: string
    comments?: string
    accessibilityItems?: WizardRadioItem[]
    photos?: FileImage[]
    files?: AccessibilityPhoto[]
}