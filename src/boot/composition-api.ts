import { boot } from 'quasar/wrappers';
import VueCompositionApi from '@vue/composition-api';

export default boot(({ Vue }) => {
  Vue.use(VueCompositionApi);
});
