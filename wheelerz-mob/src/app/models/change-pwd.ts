export interface ChangePassowrd {
    email?: string | null
    oldPwd: string | null
    newPwd: string | null
    confirmPwd: string | null
}