<template>
  <PageLedger :module="ModuleAbbr.AR"></PageLedger>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { ModuleAbbr } from '~/app/constants/module.constant';

export default defineComponent({
  setup() {
    return {
      ModuleAbbr,
    };
  },
  components: {
    PageLedger: () => import('../../shared/ledger/PageLedger.vue'),
  },
});
</script>
