export class RegisterValidations {
  constructor() {}

  static passwordValidation(password: string, nickname: string): boolean {
    if (!password) {
      return false;
    }

    if (password.length < 8 || password.length > 41) {
      return false;
    }

    if (password === nickname) {
      return false;
    }

    return true;
  }

  static emailValidation(email: string): boolean {
    if (!email) {
      return false;
    }

    if (email.length < 5 || email.length > 41) {
      return false;
    }

    if (!email.includes("@")) {
      return false;
    }

    return true;
  }

  static nicknameValidation(nickname: string): boolean {
    if (!nickname) {
      return false;
    }

    if (nickname.length < 5 || nickname.length > 20) {
      return false;
    }

    return true;
  }
}
