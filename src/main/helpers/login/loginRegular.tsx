import { EAuthTokenPlatformType, LoginSession } from 'steam-session';
import { StartLoginSessionWithCredentialsDetails } from 'steam-session/dist/interfaces-external';
import { LoginOptions } from '../../../shared/Interfaces.tsx/store';
import { storeRefreshToken } from '../classes/steam/settings';

export async function flowLoginRegular(
  loginDetails: StartLoginSessionWithCredentialsDetails,
  doStoreLogin: boolean
): Promise<{
  responseStatus: keyof LoginOptions;
  refreshToken?: string;
}> {
  return new Promise(async (resolve) => {
    let session = new LoginSession(EAuthTokenPlatformType.SteamClient);
    session.on('authenticated', async () => {
      console.log(
        `Logged into Steam as authenticated -  ${session.accountName}`
      );

      if (doStoreLogin) {
        storeRefreshToken(session.accountName, session.refreshToken);
      }

      resolve({
        responseStatus: 'loggedIn',
        refreshToken: session.refreshToken,
      });
    });

    session.once('timeout', () => {
      resolve({
        responseStatus: 'defaultError',
      });
    });

    session.once('error', (err) => {
      console.log('Error', err);
      resolve({
        responseStatus: 'defaultError',
      });
    });
    try {
      await session.startWithCredentials(loginDetails);
    } catch (e) {
      console.log(e);
      resolve({
        responseStatus: 'defaultError',
      });
    }
  });
}
