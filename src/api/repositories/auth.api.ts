import { DoRequest } from '../config/repository';

const LOGIN_URL = 'http://54.251.169.160:8080/logserver/rest/loginServer';

export interface AuthEndpoints {
  getLoginAuth: any;
  getLanguages: any;
}

export default (doFetch: DoRequest): AuthEndpoints => ({
  getLoginAuth: (body) =>
    doFetch({ url: `${LOGIN_URL}/loginAuth`, body, withAuth: false }).then(
      ([, res]) => res
    ),
  getLanguages: () =>
    doFetch({
      url: `${LOGIN_URL}/loadLanguages`,
      body: { iCase: 1 },
      withAuth: false,
    }).then(([, res]) => res?.tLanguages?.['t-languages']),
});
