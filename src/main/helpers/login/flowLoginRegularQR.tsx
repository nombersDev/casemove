import { EAuthTokenPlatformType, LoginSession } from 'steam-session';
import { LoginOptions } from '../../../shared/Interfaces.tsx/store';
import { storeRefreshToken } from '../classes/steam/settings';
import { emitterAccount } from '../../../emitters';

export async function flowLoginRegularQR(doStoreLogin: boolean): Promise<{
  responseStatus: keyof LoginOptions;
  session?: LoginSession;
}> {
  return new Promise(async (resolve) => {
    let session = new LoginSession(EAuthTokenPlatformType.SteamClient);
    console.log('Start with QR');

    session.on('authenticated', async () => {
      console.log(`Logged into Steam as ${session.accountName}`);

      if (doStoreLogin) {
        storeRefreshToken(session.accountName, session.refreshToken);
      }

      resolve({
        responseStatus: 'loggedIn',
        session,
      });
    });

    session.once('timeout', () => {
      resolve({
        responseStatus: 'defaultError',
      });
    });

    session.once('error', (_err) => {
      console.log('Error');
      resolve({
        responseStatus: 'defaultError',
      });
    });
    try {
      emitterAccount.once('qrLogin:cancel', () => {
        session.removeAllListeners('authenticated');
        session.removeAllListeners('timeout');
        session.removeAllListeners('error');
        session.cancelLoginAttempt();
      });
      const { qrChallengeUrl } = await session.startWithQR();
      emitterAccount.emit('qrLogin:show', qrChallengeUrl);
    } catch {
      resolve({
        responseStatus: 'defaultError',
      });
    }
  });
}
