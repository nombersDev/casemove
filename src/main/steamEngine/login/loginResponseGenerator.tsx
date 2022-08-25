import {
  LoginCommand,
  ReturnLoginPackage,
  ReturnLoginStatus,
} from 'shared/Interfaces.tsx/loginInterface';

class LoginGenerator {
  returnValue: LoginCommand = {
    responseStatus: 'defaultError',
    returnPackage: {},
  };

  setResponseStatus(responseStatus: keyof ReturnLoginStatus) {
    this.returnValue.responseStatus = responseStatus;
  }
  setEmptyPackage() {
    this.returnValue.returnPackage = {};
  }

  setPackage(returnPackage: ReturnLoginPackage) {
    this.returnValue.returnPackage = returnPackage;
  }
}

module.exports = {
  LoginGenerator,
};
export { LoginGenerator };
