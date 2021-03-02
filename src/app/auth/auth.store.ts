import {
  defineModule,
  defineMutations,
  defineActions,
  defineGetters,
  localActionContext,
} from 'direct-vuex';
import { Notify, Cookies, Dialog } from 'quasar';
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
        const date2 = new Date(resCredentials.vhpLicensedate).getTime();
        const date1 = Date.now();
        const difftime = Math.abs(date2 - date1);
        const diffdays = Math.ceil(difftime / (1000 * 60 * 60 * 24));
        if (diffdays === 0) {
          Dialog.create({
            message: 'Your license has been expired. Please contact our support.',
            persistent: true,
          }).onOk(() => {
            Router.push('/login');
          });
        } else if (diffdays >= 1 && diffdays < 30) {
          Dialog.create({
            message: 'Your license will be expired in ' + diffdays + ' more day(s).',
            persistent: true,
          }).onOk(() => {
            const authObj = {
              ...omit(
                ['errMess', 'errorCode', 'languagesList', 'iResult'],
                resCredentials
              ),
              userName: userName.substring(0, userName.indexOf('@')),
            };
            commit.SET_AUTH(authObj);
            Cookies.set('userAuth', JSON.stringify(authObj));
            localStorage.setItem('langs', JSON.stringify(resCredentials.languagesList['languages-list']));
            hasCredentials = true;
            Router.push('/');
            });
        } else {
          const authObj = {
            ...omit(
              ['errMess', 'errorCode', 'languagesList', 'iResult'],
              resCredentials
            ),
            userName: userName.substring(0, userName.indexOf('@')),
          };
          commit.SET_AUTH(authObj);
          Cookies.set('userAuth', JSON.stringify(authObj));
          localStorage.setItem('langs', JSON.stringify(resCredentials.languagesList['languages-list']));
          hasCredentials = true;
          Router.push('/');
        }
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
