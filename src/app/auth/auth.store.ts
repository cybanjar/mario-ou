import {
  defineModule,
  defineMutations,
  defineActions,
  defineGetters,
  localActionContext,
} from 'direct-vuex';
import { Notify, Cookies } from 'quasar';
import Router from '~/router';
import { omit } from '~/app/helpers/objectManipulations.helpers';
import { AuthState } from './models/store.model';
import { ResLogin } from './models/response.model';
import API from '~/api/config/http';

const state: AuthState = {
  user: null,
};

const mutations = defineMutations<AuthState>()({
  SET_AUTH(state, auth) {
    const newAuth: any = {};
    Object.keys(auth).forEach((key) => {
      newAuth[key] = auth[key];
    });
    state.user = newAuth;
  },
  RESET_AUTH(state) {
    state.user = null;
  },
});

const actions = defineActions({
  async doLogin(ctx, { countryId, userName, userPswd }) {
    const { commit } = authActionContext(ctx);
    let hasCredentials = false;
    const resCredentials: ResLogin = await API.auth.getLoginAuth({
      countryId: countryId,
      userName: userName,
      userPswd: userPswd,
    });

    if (resCredentials) {
      if (resCredentials.iResult === 1) {
        Notify.create({
          message: 'Incorrect username/password',
          color: 'red',
        });
      } else if (resCredentials.iResult === 0) {
        const authObj = {
          ...omit(
            ['errMess', 'errorCode', 'languagesList', 'iResult'],
            resCredentials
          ),
          userName: userName.substring(0, userName.indexOf('@')),
        };
        commit.SET_AUTH(authObj);
        Cookies.set('userAuth', JSON.stringify(authObj));
        hasCredentials = true;
        Router.push('/');
      }
    }

    return hasCredentials;
  },
  doLogout(ctx) {
    const { commit } = authActionContext(ctx);
    commit.RESET_AUTH();
    Cookies.remove('userAuth');
    Router.push('/login');
  },
});

const getters = defineGetters<AuthState>()({
  getCoaFormat(state) {
    if (state.user) {
      // TODO: Need to comunicate to backend for hardcoding the number 9
      return state.user.coaFormat.replace(/9/g, '#');
    }

    return null;
  },
});

const authModule = defineModule({
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
});

const authActionContext = (context: any) =>
  localActionContext(context, authModule);

export default authModule;
