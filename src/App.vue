<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { formatterMoney } from './app/helpers/formatterMoney.helper';

// Todo: use pattern to register filter
Vue.filter('money', formatterMoney);
Vue.filter('joinStr', (value: string[], separator = ',', init = 'None') => {
  return value.join(separator) || init;
});

export default Vue.extend({});
</script>
