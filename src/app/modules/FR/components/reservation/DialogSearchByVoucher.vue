<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Search Reservation By Voucher Number</span>
      </div>

      <div
        class="bg-white q-px-xl q-py-lg row"
        style="max-height: 475px; overflow: auto"
      >
        <div class="col-3">
          <q-form @submit="onSearch">
            <SInput
              label-text="Reservation Name"
              v-model="formData.reservationName"
            />
            <SInput
              label-text="Voucher Number"
              v-model="formData.voucherNumber"
              :rules="[
                (val) =>
                  !!val || 'Enter at least voucher\'s first few characters',
              ]"
            />
            <q-btn
              block
              color="primary"
              max-height="28"
              icon="mdi-magnify"
              label="Search"
              class="q-mt-md full-width"
              type="submit"
            />
          </q-form>
        </div>
        <div class="col q-ml-xl">
          <STable
            class="table sticky-header"
            :columns="mainReservationTableHeaders"
            row-key="$_index"
            :data="mainReservationRows"
            :selected="mainReservationSelected"
            @row-click="
              (evt, row) => onRowClick(TableName.MainReservation, evt, row)
            "
            no-data-text="Fill the information then press search"
            no-pagination
          >
            <template #header="props">
              <q-tr><q-th colspan="3">Main Reservation</q-th></q-tr>
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
          </STable>

          <STable
            class="table sticky-header q-mt-lg"
            :columns="reservationMemberTableHeaders"
            row-key="$_index"
            :data="reservationMemberRows"
            :selected="reservationMemberSelected"
            @row-click="
              (evt, row) => onRowClick(TableName.ReservationMember, evt, row)
            "
            no-data-text="Fill the information then press search"
            no-pagination
          >
            <template #header="props">
              <q-tr><q-th colspan="4">Reservation Member</q-th></q-tr>
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
          </STable>
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn
          label="Cancel"
          color="primary"
          flat
          class="q-mr-sm"
          v-close-popup
        />
        <q-btn label="OK" color="primary" @click="onOk" />
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { TableHeader } from '~/components/VhpUI/typings';
import { useDirectSelectedRow } from '../../composables/selectedRow';
import {
  MainReservation,
  ReservationMember,
} from '../../models/reservation/searchByVoucher.model';

enum TableName {
  MainReservation,
  ReservationMember,
}

const mainReservationTableHeaders: TableHeader<MainReservation>[] = [
  { label: 'Reservation Name', field: 'NAME', name: 'NAME', align: 'left' },
  {
    label: 'Voucher Number',
    field: 'vesrdepot',
    name: 'vesrdepot',
    align: 'left',
  },
  { label: 'Reservation Number', field: 'resnr', name: 'resnr' },
];

const reservationMemberTableHeaders: TableHeader<ReservationMember>[] = [
  {
    label: 'Reservation Name',
    field: 'ta-name',
    name: 'ta-name',
    align: 'left',
  },
  { label: 'Guest Name', field: 'gname', name: 'gname', align: 'left' },
  { label: 'Reservation Number', field: 'resnr', name: 'resnr' },
  { label: 'Voucher Number', field: 'voucher', name: 'voucher', align: 'left' },
];

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const formData = reactive({
      reservationName: '',
      voucherNumber: '',
    });

    const mainReservations = ref<MainReservation[]>([]);
    const reservationMembers = ref<ReservationMember[]>([]);

    async function onSearch() {
      const data = await $api.frontOfficeReception.searchByVoucher({
        voucherNo: formData.voucherNumber,
        fname: formData.reservationName || ' ',
      });

      mainReservations.value = data.mainReservations;
      reservationMembers.value = data.reservationMembers;
    }

    const mainReservationSelectedRow = ref<MainReservation>(null);
    const {
      rowsWithIndex: mainReservationRows,
      selected: mainReservationSelected,
      onRowClick: onMainReservationRowClick,
    } = useDirectSelectedRow(mainReservations, mainReservationSelectedRow);

    const reservationMemberSelectedRow = ref<ReservationMember>(null);
    const {
      rowsWithIndex: reservationMemberRows,
      selected: reservationMemberSelected,
      onRowClick: onReservationMemberRowClick,
    } = useDirectSelectedRow(reservationMembers, reservationMemberSelectedRow);

    function onRowClick(tableName: TableName, evt, row) {
      if (tableName === TableName.MainReservation) {
        reservationMemberSelectedRow.value = null;
        onMainReservationRowClick(evt, row);
      } else {
        mainReservationSelectedRow.value = null;
        onReservationMemberRowClick(evt, row);
      }
    }

    async function onOk() {
      if (mainReservationSelectedRow.value !== null) {
        $q.loading.show();
        const reservationNumber = mainReservationSelectedRow.value.resnr;
        const reservationStatus = await $api.frontOfficeReception.getVoucherSorttype(
          reservationNumber
        );
        $q.loading.hide();
        emit('dataSelected', { reservationStatus, reservationNumber });
      } else if (reservationMemberSelectedRow.value !== null) {
        $q.loading.show();
        const reservationNumber = reservationMemberSelectedRow.value.resnr;
        const reservationStatus = await $api.frontOfficeReception.getVoucherSorttype(
          reservationNumber
        );
        $q.loading.hide();
        emit('dataSelected', { reservationStatus, reservationNumber });
      }

      showDialog.value = false;
    }

    return {
      mainReservationTableHeaders,
      reservationMemberTableHeaders,
      showDialog,
      formData,
      mainReservations,
      reservationMembers,
      onSearch,
      mainReservationRows,
      mainReservationSelected,
      reservationMemberRows,
      reservationMemberSelected,
      onRowClick,
      TableName,
      onOk,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 1048px;
}

.table {
  max-height: 196px;

  thead tr:nth-child(2) th {
    top: 28px;
  }
}
</style>
