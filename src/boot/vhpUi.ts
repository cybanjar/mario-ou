import { boot } from 'quasar/wrappers';

export default boot(async ({ Vue }) => {
  const requireComponents = require.context(
    '../components/VhpUI',
    true,
    /[\w-]+\.vue$/
  );

  requireComponents.keys().forEach((fileName: any) => {
    const componentConfig = requireComponents(fileName);
    const componentName = fileName
      .split('/')
      .pop()
      .replace(/\.\w+$/, '');

    Vue.component(componentName, componentConfig.default || componentConfig);
  });
});
