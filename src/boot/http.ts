import { boot } from 'quasar/wrappers';
import API from '../api/config/http';

export default boot(({ Vue }) => {
  Vue.prototype.$api = API;
});
