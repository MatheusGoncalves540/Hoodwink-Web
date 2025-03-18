"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidations = void 0;
class LoginValidations {
    constructor() { }
    static passwordValidation(password, login) {
        if (!password) {
            return false;
        }
        if (password.length < 8 || password.length > 41) {
            return false;
        }
        if (password === login) {
            return false;
        }
        return true;
    }
}
exports.LoginValidations = LoginValidations;
//# sourceMappingURL=loginValidations.js.map