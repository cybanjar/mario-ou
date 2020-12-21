import ky, { Options } from 'ky';
import { store } from '~/store';

interface FetchArgs {
  url: string;
  body?: any;
  options?: Options;
  withAuth?: boolean;
}

export type DoRequest = (params: FetchArgs) => Promise<any>;

const doFetch = async ({ url, body, options, withAuth = true }: FetchArgs) => {
  let requestBody = body || {};
  const httpOptions: Options = options || {};
  const { user } = store.state.auth;

  if (withAuth && user) {
    httpOptions.prefixUrl = user.htlUrl;

    requestBody = {
      ...requestBody,
      inputUserkey: user.userKey,
      inputUsername: user.userName,
    };
  }

  httpOptions.json = {
    request: requestBody,
  };

  try {
    const response = await ky.post(url, httpOptions);
    const data = await response.json();

    return [null, data.response];
  } catch (error) {
    return [{ errorMessage: error.message }, null];
  }
};

export default doFetch;
