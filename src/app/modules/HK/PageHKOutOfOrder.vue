<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchOutOfOrder
        @onChangeFilter="onChangeFilter"
        @onChangedDate="onChangedDate"
      />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <STable
        class="table-out-of-order"
        :loading="isFetching"
        :columns="tableHeaders"
        :data="tableData"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        :filter="filterRoom"
        :filter-method="filterTable"
      >
        <template #header-cell-actions="props">
          <q-th :props="props" class="fixed-col right">
            {{ props.col.label }}
          </q-th>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="fixed-col right">
            <q-icon name="mdi-dots-vertical" size="16px">
              <q-menu anchor="bottom right" self="top right">
                <q-list>
                  <q-item clickable v-ripple @click="onEdit(props.row)">
                    <q-item-section side>
                      <q-icon name="mdi-eye" style="color: #52c41a;" />
                    </q-item-section>
                    <q-item-section>View in Detail</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple @click="onClickRelease(props.row)">
                    <q-item-section side>
                      <q-icon
                        name="mdi-clipboard-check-outline"
                        style="color: #52c41a;"
                      />
                    </q-item-section>
                    <q-item-section>Release OOO Status</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </template>

        <template #body-cell-roomNumber="props">
          <q-td
            :props="props"
            class="text-white room-cell"
            :class="[setBgColor(props.row.ind)]"
          >
            {{ props.row.zinr }}
          </q-td>
        </template>

        <template #body-cell-reason="props">
          <q-td :props="props" class="ellipsis cursor-pointer">
            {{ props.row.gespgrund }}

            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[0, 0]"
            >
              {{ props.row.gespgrund }}
            </q-tooltip>
          </q-td>
        </template>
      </STable>
    </div>

    <DialogEditOutOfOrder
      :dialog.sync="dialog"
      :selected-room="selectedRoom"
      @onUpdate="onUpdate"
    />

    <q-dialog v-model="confirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="mdi-warning" color="primary" text-color="white" />
          <span class="q-ml-sm">Release this room ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            outline
            label="No"
            color="primary"
            v-close-popup
            size="md"
            dense
            :loading="isReleaseLoading"
            :disable="isReleaseLoading"
          />
          <q-btn
            label="Yes"
            color="primary"
            style=""
            size="md"
            dense
            @click="onReleaseRoom"
            :loading="isReleaseLoading"
            :disable="isReleaseLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { tableHeaders } from './tables/outOfOrder.table';
import { date } from 'quasar';

interface State {
  isFetching: boolean;
  tableData: any[];
  filterRoom: {
    status: any;
    search: string;
  };
  filterDate: {
    start: string;
    end: string;
  };
  dialog: boolean;
  confirmDialog: boolean;
  selectedRoom: any;
  isReleaseLoading: boolean;
}

const today = new Date();
const defaultFromDate = date.subtractFromDate(today, { year: 5 });
const dateFormat = 'MM/DD/YYYY';

export default defineComponent({
  setup(_, { root: { $api, $q } }) {
    const state = reactive<State>({
      isFetching: true,
      tableData: [],
      filterRoom: {
        status: 0,
        search: '',
      },
      filterDate: {
        start: date.formatDate(defaultFromDate, dateFormat),
        end: date.formatDate(today, dateFormat),
      },
      dialog: false,
      confirmDialog: false,
      selectedRoom: null,
      isReleaseLoading: false,
    });

    const onChangeFilter = (filterRoom) => {
      state.filterRoom.status = filterRoom.status;
      state.filterRoom.search = filterRoom.search;
    };

    const fetchColumns = async () => {
      state.isFetching = true;
      const body = {
        disptype: state.filterRoom.status,
        fdate: state.filterDate.start,
        tdate: state.filterDate.end,
        sorttype: '1',
      };

      const res = await $api.housekeeping.getOOOandOM(body);
      if (res) {
        state.tableData = res;
      }
      state.isFetching = false;
    };

    fetchColumns();

    const filterTable = (rows, terms, cols, cellValue) =>
      rows.filter((row) => {
        let hasStatus = true;

        switch (terms.status) {
          case 1:
            hasStatus = row.ind !== 3;
            break;
          case 2:
            hasStatus = row.ind === 3;
            break;
          default:
            break;
        }

        return (
          hasStatus &&
          cols.some(
            (col) =>
              (cellValue(col, row) + '')
                .toLowerCase()
                .indexOf(terms.search.toLowerCase()) !== -1
          )
        );
      });

    const setBgColor = (ind) => {
      switch (ind) {
        case 2:
          return 'bg-ooo';
        case 3:
          return 'bg-off';
        default:
          return 'bg-ofs';
      }
    };

    const onDialog = (val) => {
      state.dialog = val;
    };

    const onEdit = (room) => {
      state.selectedRoom = room;
      onDialog(true);
    };

    const onUpdate = () => {
      fetchColumns();
    };

    const onClickRelease = (room) => {
      state.confirmDialog = true;
      state.selectedRoom = room;
    };

    const onReleaseRoom = async () => {
      state.isReleaseLoading = true;
      const [err] = await $api.housekeeping.deactivateOOOandOM({
        recId: state.selectedRoom['rec-id'],
        userinit: '01',
      });

      let notifyPayload = {
        type: 'positive',
        message: 'Deleted successfully',
      };

      if (err) {
        notifyPayload = {
          type: 'negative',
          message: 'Failed to delete',
        };
      }

      $q.notify(notifyPayload);
      state.isReleaseLoading = false;
      state.confirmDialog = false;

      fetchColumns();
    };

    const onChangedDate = (newDate) => {
      state.filterDate.start = date.formatDate(newDate.start, dateFormat);
      state.filterDate.end = date.formatDate(newDate.end, dateFormat);
      fetchColumns();
    };

    return {
      ...toRefs(state),
      tableHeaders,
      onChangeFilter,
      filterTable,
      pagination: { page: 1, rowsPerPage: 0 },
      setBgColor,
      onDialog,
      onEdit,
      onUpdate,
      onClickRelease,
      onChangedDate,
      onReleaseRoom,
    };
  },
  components: {
    SearchOutOfOrder: () => import('./components/SearchOutOfOrder.vue'),
    DialogEditOutOfOrder: () => import('./components/DialogEditOutOfOrder.vue'),
  },
});
</script>

<style lang="scss" scoped>
::v-deep .table-out-of-order {
  max-height: 75vh;

  thead tr th {
    position: sticky;
    z-index: 3;
  }

  thead tr:first-child th {
    top: 0;
  }
}

.room-cell {
  border-bottom-color: #e8e8e8;
  border-right-color: #e8e8e8;
}

.bg-ooo {
  background-color: rgb(255, 0, 0);
}
.bg-off {
  background-color: rgb(128, 0, 0);
}
.bg-ofs {
  background-color: rgb(255, 0, 255);
}
</style>
