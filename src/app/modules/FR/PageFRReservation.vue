<template>
  <q-page>
    <q-drawer side="left" bordered :width="250" persistent v-model="showDrawer">
      <SearchReservation
        :is-preparing="isPreparing"
        :prepare-data="prepareData"
        @search="onSearch"
        :selected-row="selectedRow"
        @changeCheckin="(val) => (checkinEnabled = val)"
        @editReservationRemark="dialogReservationRemark.open()"
        :search-by-voucher="searchByVoucher"
      />
      <q-btn
        @click="showDrawer = !showDrawer"
        icon="mdi-format-indent-decrease"
        color="primary"
        class="drawer-toggle"
      ></q-btn>
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-ml-xl row justify-between items-start">
        <SharedModuleActions
          :actions="[{ name: 'Add', position: 'prefix' }]"
          @onActions="onActions"
        />
        <DropdownDashboard :data="tableRows" />
      </div>

      <TableReservation
        :is-fetching="isFetching"
        :rows="tableRows"
        :selected-row.sync="selectedRow"
        :checkin-enabled="checkinEnabled"
        :prepare-data="prepareData"
        :search-data="searchData"
      />
    </div>

    <DialogSearchByVoucher
      :show.sync="dialogSearchByVoucher.state.show"
      :key="dialogSearchByVoucher.state.key"
      @dataSelected="onSearchByVoucherData"
    />

    <DialogRefreshRoom
      :show.sync="dialogRefreshRoom.state.show"
      :key="dialogRefreshRoom.state.key"
    />

    <DialogReservationRemark
      :show.sync="dialogReservationRemark.state.show"
      :key="dialogReservationRemark.state.key"
      :resnr="selectedRow && selectedRow.resnr"
      :reslinnr="selectedRow && selectedRow.reslinnr"
      @newData="onReservationRemarkNewData"
    />

    <DialogQueueingRooms
      :show.sync="dialogQueueingRooms.state.show"
      :key="dialogQueueingRooms.state.key"
    />
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  reactive,
  ref,
  toRefs,
} from '@vue/composition-api';
import { date } from 'quasar';
import { toNumber } from '~/app/helpers/typeConverter.helper';
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';
import type { SearchReservation } from './components/reservation/SearchReservation.vue';
import { useDisposableDialog } from './composables/disposableDialog';
import { RowWithIndex } from './composables/selectedRow';
import { ReservationRemark } from './models/common/dialogReservationRemark.model';
import {
  PrepareReservation,
  ReqSearchReservation,
  Reservation,
  reservationKey,
  SearchBy,
  SearchByVoucherProps,
} from './models/reservation/reservation.model';

export default defineComponent({
  components: {
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
    SearchReservation: () =>
      import('./components/reservation/SearchReservation.vue'),
    DropdownDashboard: () =>
      import('./components/reservation/DropdownDashboard.vue'),
    TableReservation: () =>
      import('./components/reservation/TableReservation.vue'),
    DialogSearchByVoucher: () =>
      import('./components/reservation/DialogSearchByVoucher.vue'),
    DialogRefreshRoom: () =>
      import('./components/reservation/DialogRefreshRoom.vue'),
    DialogReservationRemark: () =>
      import('./components/common/DialogReservationRemark.vue'),
    DialogQueueingRooms: () =>
      import('./components/reservation/DialogQueueingRooms.vue'),
  },

  setup(_, { root: { $api, $router } }) {
    /* Init Data */
    const state = reactive({
      isPreparing: true,
      isFetching: false,
      prepareData: null as PrepareReservation | null,
      tableRows: [] as Reservation[],
      selectedRow: null as Reservation | null,
      searchData: null as SearchReservation | null,
    });

    $api.frontOfficeReception.prepareReservation().then((value) => {
      state.prepareData = value;
      state.isPreparing = false;
    });

    async function onSearch(searches: SearchReservation) {
      state.searchData = searches;
      state.isFetching = true;

      const usedName =
        searches.searchBy === SearchBy.ReservationName
          ? searches.reservationName
          : searches.guestName;

      const requestData: ReqSearchReservation = {
        showRate: true,
        lastSort: searches.searchBy,
        lresnr: toNumber(searches.reservationNumber),
        longStay: state.prepareData.longStay,
        ciDate: date.formatDate(new Date(state.prepareData.ciDate), 'MM/DD/YY'),
        grpFlag: searches.groupReservation,
        room: searches.roomNumber || ' ',
        lname: usedName || ' ',
        sorttype: searches.reservationStatus,
        fdate1: date.formatDate(searches.arrivalDate.start, 'MM/DD/YY'),
        fdate2: date.formatDate(searches.arrivalDate.end, 'MM/DD/YY'),
        fdate: date.formatDate(searches.date, 'MM/DD/YY'),
      };

      state.tableRows = await $api.frontOfficeReception.searchReservation(
        requestData
      );

      state.isFetching = false;
    }

    /* UI State */
    const showDrawer = ref(true);
    const checkinEnabled = ref(false);

    const dialogReservationRemark = useDisposableDialog();
    function onReservationRemarkNewData(data: ReservationRemark) {
      const newRemark = (data.resCom ?? '') + '\n' + (data.reslCom ?? '');

      // Update selected row value
      state.selectedRow.comments = newRemark;

      // Update table row
      const castSelectedRow = state.selectedRow as RowWithIndex<Reservation>;
      state.tableRows[castSelectedRow.$_index].comments = newRemark;
    }

    const dialogSearchByVoucher = useDisposableDialog();
    const searchByVoucher = ref<SearchByVoucherProps>(null);
    function onSearchByVoucherData(data: SearchByVoucherProps) {
      searchByVoucher.value = data;
    }

    const dialogRefreshRoom = useDisposableDialog();
    const dialogQueueingRooms = useDisposableDialog();

    useExtraMenu([
      {
        handler: () => dialogSearchByVoucher.open(),
        icon: 'FR/Icon-SearchVoucher',
      },
      {
        handler: () => dialogRefreshRoom.open(),
        icon: 'FR/Icon-RefreshRoom',
      },
    ]);

    /* Provider */
    provide(reservationKey, {
      SET_RESERVATION_LIST: (callback) => {
        const newData = callback(state.tableRows);
        state.tableRows = newData;
      },
      SHOW_DIALOG_QUEUEING_ROOMS: dialogQueueingRooms.open,
    });

    function onActions(actions: string) {
      switch (actions) {
        case 'onAdd':
          $router.push('/fr/create-reservation/1');
          break;
        case 'onRefresh':
          // onSearch();
          break;
        case 'onPrint':
          // TODO: put print logic here
          break;
        default:
          break;
      }
    }

    return {
      ...toRefs(state),
      onSearch,
      showDrawer,
      onActions,
      checkinEnabled,
      dialogReservationRemark,
      onReservationRemarkNewData,
      dialogSearchByVoucher,
      searchByVoucher,
      onSearchByVoucherData,
      dialogRefreshRoom,
      dialogQueueingRooms,
    };
  },
});
</script>

<style lang="scss" scoped>
.drawer-toggle {
  border-radius: 0 20px 20px 0;
  padding: 4px 0;
  position: absolute;
  right: -55px;
  top: 14px;
  visibility: visible;
}
</style>
