<template>
  <PageJournal :module="ModuleAbbr.AR"></PageJournal>
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
    PageJournal: () => import('../../shared/journal/PageJournal.vue'),
  },
});
</script>
