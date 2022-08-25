// Login
export interface LoginPackageMethods {
  clientJSToken: LoginMethodClientJSToken;
  storedPassword: string;
  regularPassword: string;
}

// Method Client JS Token
export interface LoginMethodClientJSToken {
  logged_in: boolean;
  steamid: string;
  accountid: number;
  account_name: string;
  token: string;
}

export interface LoginUserDetails {
  user: string
  username: string
  shouldRemember: boolean
  password: string
  steamGuard: string
  secretKey: string
  clientjstoken: LoginMethodClientJSToken
}

