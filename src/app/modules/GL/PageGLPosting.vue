<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchPosting />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="row q-col-gutter-sm">
        <div class="col-6">
          <STable
            :loading="false"
            :columns="tableHeaders.activeJournal"
            :data="[]"
          >
            <template #header="props">
              <q-tr>
                <q-th colspan="4" class="text-left">Active Journal</q-th>
              </q-tr>

              <q-tr>
                <q-th v-for="th in props.cols" :key="th.name" :props="props">
                  {{ th.label }}
                </q-th>
              </q-tr>
            </template>
          </STable>
        </div>

        <div class="col-6">
          <STable :loading="false" :columns="tableHeaders.note" :data="[]">
          </STable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  setup() {
    const tableHeaders = {
      activeJournal: [
        { label: 'Date', name: 'date', align: 'left' },
        { label: 'Reference Number', name: 'reference', align: 'left' },
        { label: 'Description', name: 'description', align: 'left' },
        { name: 'actions', field: 'actions' },
      ],
      note: [
        { label: 'Account Number', align: 'left' },
        { label: 'Debit', align: 'left' },
        { label: 'Credit', align: 'left' },
        { label: 'Remark', align: 'left' },
      ],
    };

    return {
      tableHeaders,
    };
  },
  components: {
    SearchPosting: () => import('./components/SearchPosting.vue'),
  },
});
</script>
