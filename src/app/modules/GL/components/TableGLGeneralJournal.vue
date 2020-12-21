<template>
  <div class="row q-col-gutter-sm">
    <div class="col-6">
      <STable :loading="false" :columns="journalColumn" :data="[]">
        <template #header="props">
          <q-tr>
            <q-th :colspan="isActive ? 7 : 6" class="text-left text-capitalize">
              {{ display }} Journal
            </q-th>
          </q-tr>

          <q-tr>
            <q-th
              v-for="th in props.cols.filter((col) => col.name !== 'actions')"
              :key="th.name"
              :props="props"
            >
              {{ th.label }}
            </q-th>
            <q-th :props="props" class="fixed-col right" key="actions" />
          </q-tr>
        </template>
      </STable>
    </div>

    <div class="col-6">
      <STable :loading="false" :columns="detailHeaders" :data="[]">
        <template v-slot:no-data>
          <div class="full-width column flex-center text-grey q-pa-lg">
            <q-icon size="2em" name="mdi-info" />
            <span> Set the filter value then press search </span>
          </div>
        </template>
      </STable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { journalHeaders, detailHeaders } from '../tables/generalJournal.table';

export default defineComponent({
  props: {
    display: { type: String, required: true },
  },
  setup(props) {
    const isActive = computed(() => props.display === 'active');
    const journalColumn = computed(() =>
      isActive.value
        ? journalHeaders.activeJournal
        : journalHeaders.closedJournal
    );

    return {
      isActive,
      journalColumn,
      detailHeaders,
    };
  },
});
</script>
