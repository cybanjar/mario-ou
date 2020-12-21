<template>
  <q-drawer
    side="right"
    v-model="reportDrawer"
    overlay
    behavior="mobile"
    :width="360"
  >
    <q-toolbar class="justify-between shadow-2">
      <span class="text-weight-medium">
        {{ currentModule && currentModule.title }} Report List
      </span>
      <q-btn flat round icon="mdi-close" @click="reportDrawer = false" />
    </q-toolbar>

    <div class="q-pa-lg">
      <SInput label-text="Search" v-model="reportFilter" />

      <STable
        :columns="tableHeaders"
        :data="currentModule ? currentModule.reports : []"
        hide-bottom
        :filter="reportFilter"
        @row-click="onRowClick"
      />
    </div>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import { tableHeaders } from '../tables/reportList.table';
import { store } from '~/store';

export default defineComponent({
  props: {
    drawer: { type: Boolean, required: true },
  },
  setup(props, { root, emit }) {
    const reportFilter = ref('');
    const reportDrawer = computed({
      get: () => props.drawer,
      set: (val) => {
        emit('update:drawer', val);
      },
    });

    const currentModule = computed(() => store.state.layout.currentModule);

    function onRowClick(_, row) {
      if (root.$route.path !== row.path) {
        root.$router.push(row.path);
      }
    }

    return {
      reportFilter,
      onRowClick,
      tableHeaders,
      reportDrawer,
      currentModule,
    };
  },
});
</script>
