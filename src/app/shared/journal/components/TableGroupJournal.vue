<template>
  <section class="row q-gutter-md group-table">
    <div class="col">
      <STable
        v-bind="$attrs"
        :columns="activeJournalColumns"
        virtual-scroll
        :data="data"
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        fixed-header
        @row-click="fetchJourDetail"
        row-key="key"
      >
        <template v-slot:header="props">
          <q-tr class="label-group-table">
            <q-th colspan="6" class="text-left">
              {{ tableTitle }}
            </q-th>
            <q-th :key="props.cols[6].name" :rowspan="2" :props="props">
              <q-icon name="mdi-dots-vertical" />
            </q-th>
          </q-tr>
          <q-tr>
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
        :columns="detailColumns"
        :shape="detailShape"
        :loading="detailPrep.data.isLoading"
        :data="detailPrep.result"
      />
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from '@vue/composition-api';
import { activeJournalColumns } from '../table/active-journal.table';
import { transDetailColumns, colShape } from '../table/trans-detail.table';
import { usePrepare } from '../../compositions/use-prepare.composition';
import { reformDetailData } from '../utils/reformData';

export default defineComponent({
  inheritAttrs: true,
  props: {
    data: { type: Array, required: true },
    sortType: { type: Number, required: false, default: 0 },
  },
  setup(props, { root: { $api, $q }, emit }) {
    const pagination = ref();
    const detailPrep = usePrepare(
      false,
      (jnr) =>
        $api.common.glJourtransOnclick({
          jnr,
        }),
      (tempData) => {
        emit('detail', tempData);
      },
      (tempData) =>
        reformDetailData(tempData, [
          '0',
          '0',
          '.',
          '0',
          '0',
          '.',
          '0',
          '0',
          '0',
          '0',
        ]),
      []
    );

    watch(
      () => props.data,
      (nVal) => {
        if (nVal.length <= 0) {
          detailPrep.refetch();
        }
      }
    );

    const tableTitle = computed(() =>
      props.sortType === 0 ? 'Active journal' : 'Closed Journal'
    );

    const delPrep = usePrepare(
      false,
      async (jnr) => {
        const access = await $api.common.checkPermission({
          arrayNr: '68',
          expectedNr: '2',
        });
        const { flTemp, msgStr } = await $api.common.glJourtransNewjour({
          pvILanguage: '1',
        });
        if (access.zugriff === 'false') {
          $q.notify({
            type: 'negative',
            message: access.msgStr,
          });
          throw new Error(access.msgStr);
        } else if (flTemp === 'true') {
          if (detailPrep.data.raw.length > 0) {
            const message = 'Journal entries exist, deleting not possible';
            $q.dialog({
              title: message,
            });
            throw new Error(message);
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
      detailColumns: transDetailColumns,
      detailShape: colShape,
      fetchJourDetail,
      detailPrep,
      tableTitle,
      deleteJournal,
      editJournal,
      pagination,
    };
  },
  components: {
    DialogJournalTable: () => import('../../components/DialogJournalTable.vue'),
  },
});
</script>
<style lang="scss">
.group-table .label-group-table {
  height: 48px !important;
}
</style>
