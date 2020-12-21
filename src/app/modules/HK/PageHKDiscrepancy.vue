<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchDiscrepancy @onSearchChange="onSearchChange" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="dialog = true">
          <img :src="require('~/app/icons/Icon-Add.svg')" height="30" />
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 5]">
            Add
          </q-tooltip>
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 5]">
            Refresh
          </q-tooltip>
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 5]">
            Print
          </q-tooltip>
        </q-btn>
      </div>

      <!-- not using STable due to the expanded is not working -->
      <q-table
        class="s-table"
        :loading="isFetching"
        :columns="tableHeaders"
        :data="tableData"
        :filter="search"
        row-key="zinr"
        separator="cell"
        dense
        hide-pagination
        :rows-per-page-options="[0]"
        :pagination="{ page: 1, rowsPerPage: 0 }"
      >
        <template #header="props">
          <q-tr :props="props">
            <q-th rowspan="3" width="37" />
            <q-th :props="props" key="roomNumber" rowspan="3">
              {{ props.colsMap.roomNumber.label }}
            </q-th>
            <q-th colspan="3">Front Office</q-th>
            <q-th colspan="3">Houskeeping</q-th>
            <q-th :props="props" key="explanation" rowspan="3">
              {{ props.colsMap.explanation.label }}
            </q-th>
          </q-tr>

          <q-tr :props="props">
            <q-th :props="props" key="statusFO" rowspan="2">
              {{ props.colsMap.statusFO.label }}
            </q-th>
            <q-th colspan="2">Pax</q-th>

            <q-th :props="props" key="statusHK" rowspan="2">
              {{ props.colsMap.statusHK.label }}
            </q-th>
            <q-th colspan="2">Pax</q-th>
          </q-tr>

          <q-tr :props="props">
            <q-th :props="props" key="adultFO">
              {{ props.colsMap.adultFO.label }}
            </q-th>
            <q-th :props="props" key="childFO">
              {{ props.colsMap.childFO.label }}
            </q-th>
            <q-th :props="props" key="adultHK">
              {{ props.colsMap.adultHK.label }}
            </q-th>
            <q-th :props="props" key="childHK">
              {{ props.colsMap.childHK.label }}
            </q-th>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                round
                dense
                flat
                @click="props.expand = !props.expand"
                :icon="
                  props.expand
                    ? 'mdi-arrow-up-drop-circle-outline'
                    : 'mdi-arrow-down-drop-circle-outline'
                "
              />
            </q-td>
            <q-td
              v-for="col in props.cols.filter(
                (col) => col.name !== 'explanation'
              )"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>

            <q-td key="explanation" :props="props">
              <div class="flex justify-between items-center">
                <span>{{ props.row.explanation }}</span>
                <q-btn
                  round
                  dense
                  flat
                  size="sm"
                  color="red"
                  icon="mdi-delete"
                />
              </div>
            </q-td>
          </q-tr>

          <q-tr v-show="props.expand" :props="props" class="expanded">
            <q-td></q-td>
            <q-td colspan="100%">
              <table width="100%" class="expandable">
                <tbody>
                  <tr class="expanded">
                    <td>
                      <b>Floor</b>
                      <span class="q-pl-sm q-pr-lg">{{ props.row.etage }}</span>
                      <b class="text-uppercase">time</b>
                      <span class="q-pl-sm q-pr-lg">{{ props.row.times }}</span>
                      <b class="text-uppercase">id</b>
                      <span class="q-pl-sm q-pr-lg">{{ props.row.id }}</span>
                    </td>
                  </tr>
                  <tr class="expanded">
                    <td>
                      <b>Room Type</b>
                      <span class="q-pl-sm q-pr-lg">
                        {{ props.row.bezeich }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </q-td>
          </q-tr>
          <!-- hack for the striped rows -->
          <q-tr style="height: 0;"></q-tr>
        </template>

        <template v-slot:loading>
          <div class="q-mb-xl q-mt-xl q-pt-xl q-pb-xl" style="z-index: 2;">
            <q-inner-loading showing color="primary" />
          </div>
        </template>

        <template v-slot:no-data>
          <div class="full-width column flex-center text-grey q-pa-lg">
            <q-icon size="2em" name="mdi-information" />
            <span>Set the filter value then press search</span>
          </div>
        </template>
      </q-table>

      <DialogAddDiscrepancy
        :dialog.sync="dialog"
        @onAddDiscrepancy="onAddDiscrepancy"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { tableHeaders } from './tables/discrepancy.table';
import { ResDiscrepancy } from './models/responseDiscrepancy.model';

interface State {
  search: string;
  isFetching: boolean;
  tableData: ResDiscrepancy[];
  dialog: boolean;
  confirmDialog: boolean;
}

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive<State>({
      search: '',
      tableData: [],
      isFetching: true,
      dialog: false,
      confirmDialog: false,
    });

    async function fetchColumns() {
      const [, res] = await $api.housekeeping.getStoreRoomDiscrepancyList();

      if (res) {
        state.tableData = res.hkDiscrepancyList?.['hk-discrepancy-list'];
      }
      state.isFetching = false;
    }
    fetchColumns();

    function onSearchChange(searchVal) {
      state.search = searchVal;
    }

    function onAddDiscrepancy() {
      fetchColumns();
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearchChange,
      onAddDiscrepancy,
    };
  },
  components: {
    SearchDiscrepancy: () => import('./components/SearchDiscrepancy.vue'),
    DialogAddDiscrepancy: () => import('./components/DialogAddDiscrepancy.vue'),
  },
});
</script>
