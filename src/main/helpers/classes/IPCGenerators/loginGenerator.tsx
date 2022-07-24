import { LoginCommand, LoginCommandReturnPackage, LoginOptions } from "shared/Interfaces.tsx/store";

class LoginGenerator {
  returnValue: LoginCommand = {
    responseStatus: 'defaultError',
    returnPackage: {}
  }

  setResponseStatus(responseStatus: keyof LoginOptions) {
    this.returnValue.responseStatus = responseStatus
  }
  setEmptyPackage() {
    this.returnValue.returnPackage = {}
  }

  setPackage(returnPackage: LoginCommandReturnPackage) {
    this.returnValue.returnPackage = returnPackage
  }

}

module.exports = {
  LoginGenerator
};
export { LoginGenerator };
