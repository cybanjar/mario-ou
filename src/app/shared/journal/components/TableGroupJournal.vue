<template>
  <section class="row q-gutter-md">
    <div class="col">
      <STable
        v-bind="$attrs"
        :columns="activeJournalColumns"
        :pagination="{ rowsPerPage: 10 }"
        :rows-per-page-options="[10]"
        @row-click="fetchJourDetail"
        row-key="key"
      >
        <template v-slot:header="props">
          <q-tr>
            <q-th colspan="6" class="text-left">
              {{ tableTitle }}
            </q-th>
            <q-th :key="props.cols[6].name" :rowspan="2" :props="props">
              <q-icon name="mdi-dots-vertical" />
            </q-th>
          </q-tr>
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols.slice(0, 6)"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props" class="fixed-col right">
            <q-icon name="mdi-dots-vertical" size="16px">
              <q-menu auto-close anchor="bottom right" self="top right">
                <q-list>
                  <q-item clickable @click="editJournal(props.row)" v-ripple>
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                  <q-item clickable @click="deleteJournal(props.row)" v-ripple>
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>Copy</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </template>
      </STable>
    </div>
    <div class="col">
      <DialogJournalTable
        :loading="detailPrep.data.isLoading"
        :data="detailPrep.result"
        :pagination="{ rowsPerPage: 10 }"
        :rows-per-page-options="[10]"
      />
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { activeJournalColumns } from '../table/active-journal.table';
import { usePrepare } from '../../compositions/use-prepare.composition';
import { reformDetailData } from '../utils/reformData';

export default defineComponent({
  inheritAttrs: true,
  props: {
    sortType: { type: Number, required: false, default: 0 },
  },
  setup(props, { root: { $api, $q }, emit }) {
    const detailPrep = usePrepare<any[]>(
      false,
      (jnr) =>
        $api.common.glJourtransOnclick({
          jnr,
        }),
      (tempData) => {
        emit('detail', tempData);
      },
      (tempData) => reformDetailData(tempData, []),
      []
    );

    const tableTitle = computed(() =>
      props.sortType === 0 ? 'Active journal' : 'Closed Journal'
    );

    const delPrep = usePrepare(
      false,
      async (jnr) => {
        const { flTemp, msgStr } = await $api.common.glJourtransNewjour({
          pvILanguage: '1',
        });

        if (flTemp === 'true') {
          if (detailPrep.data.raw.length > 0) {
            $q.dialog({
              title: 'Journal entries exist, deleting not possible',
            });
            throw new Error();
          } else {
            $api.common.glJourtransDelJouhdr({
              caseType: 3,
              int1: jnr,
              int2: '',
              char1: '',
              date1: '',
            });
          }
        } else {
          throw new Error(msgStr);
        }
      },
      () => {
        $q.notify({
          type: 'positive',
          message: 'delete succesfuly',
        });
      }
    );

    function fetchJourDetail(_, row) {
      detailPrep.refetch(row.jnr);
    }

    function deleteJournal(row) {
      $q.dialog({
        title: 'Do you want to delete this journal?',
      }).onOk(() => delPrep.refetch(row.jnr));
    }

    function editJournal(row) {
      emit('edit-journal', row.jnr);
    }

    return {
      activeJournalColumns,
      fetchJourDetail,
      detailPrep,
      tableTitle,
      deleteJournal,
      editJournal,
    };
  },
  components: {
    DialogJournalTable: () => import('../../components/DialogJournalTable.vue'),
  },
});
</script>
