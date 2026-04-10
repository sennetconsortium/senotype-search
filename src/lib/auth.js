import { deleteCookie } from 'cookies-next';
import { getCookie } from 'cookies-next';
import log from 'xac-loglevel';

const AUTH = {
  info: () => {
    const info = getCookie('info');
    if (!info) return {};
    try {
      const auth = JSON.parse(atob(info));
      log.debug('lib.getAuth', auth);
      return auth;
    } catch (e) {
      log.error('lib.getAuth.error', e);
    }
    return {};
  },
  token: () => AUTH.info().groups_token,
  logout: () => {
    deleteCookie('info');
    sessionStorage.clear();
  },
};

export default AUTH;
