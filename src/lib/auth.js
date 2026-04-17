import {deleteCookie, getCookie} from 'cookies-next';
import log from 'xac-loglevel';

const AUTH = {
  info: () => {
    const info = getCookie('info');
    if (!info) return {};
    try {
      const auth = JSON.parse(atob(info));
      log.debug('AUTH.info', auth);
      return auth;
    } catch (e) {
      log.error('AUTH.info.error', e);
    }
    return {};
  },
  token: () => AUTH.info().groups_token,
  logout: () => {
    deleteCookie('info', {path: '/', domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, sameSite: "Lax"})
    sessionStorage.clear();
  },
};

export default AUTH;
