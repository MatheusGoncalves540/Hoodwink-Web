export class LoginValidations {
    constructor() { }

    static passwordValidation(password: string, login: string): boolean {
        if (!password) {
            return false
        }

        if (password.length < 8 || password.length > 41) {
            return false
        }

        if (password === login) {
            return false
        }

        return true
    }
}
