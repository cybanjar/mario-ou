<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Outlet Bill</span>
      </div>

      <div class="q-pa-md bg-white dialog__body">
        <STable
          :loading="isFetching"
          :data="rows"
          :columns="tableHeaders"
          no-data-text="No Data"
          no-pagination
          class="sticky-header"
          style="max-height: 200px"
        />
      </div>

      <div class="dialog__footer">
        <q-btn label="OK" color="primary" class="q-mr-sm" v-close-popup />
      </div>

      <q-inner-loading :showing="false" color="primary" />
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { TableHeader } from '~/components/VhpUI/typings';
import { date } from 'quasar';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { displayTime } from '~/app/helpers/displayTime.helper';
import {
  RevenueBreakdown,
  ReqOutletBill,
  OutletBill,
} from '../../models/guest-profile/guestInformation.model';

const tableHeaders: TableHeader<OutletBill>[] = [
  {
    label: 'Article Number',
    name: 'artnr',
    field: 'artnr',
  },
  {
    label: 'Quantity',
    name: 'anzahl',
    field: 'anzahl',
  },
  {
    label: 'Description',
    name: 'bezeich',
    field: 'bezeich',
    align: 'left',
  },
  {
    label: 'Price',
    name: 'epreis',
    field: 'epreis',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Balance',
    name: 'betrag',
    field: 'betrag',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Number',
    name: 'waehrungsnr',
    field: 'waehrungsnr',
  },
  {
    label: 'Bill Date',
    name: 'bill-datum',
    field: 'bill-datum',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Time',
    name: 'zeit',
    field: 'zeit',
    align: 'left',
    format: (val: number) => displayTime(val),
  },
];

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    revenueBreakdown: {
      type: Object as PropType<RevenueBreakdown>,
      default: null,
    },
  },
  setup(props, { emit, root: { $api } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const rows = ref<OutletBill[]>([]);
    const isFetching = ref(true);

    if (showDialog.value && props.revenueBreakdown) {
      const requestData: ReqOutletBill = {
        caseType: '1',
        billNo: String(props.revenueBreakdown.rechnr),
        artNo: '0',
        dept: String(props.revenueBreakdown.dept),
        datum: date.formatDate(props.revenueBreakdown.datum, 'MM/DD/YY'),
        waehrungNo: '0',
      };

      $api.frontOfficeReception.searchOutletBill(requestData).then((value) => {
        rows.value = value;
        isFetching.value = false;
      });
    }

    return {
      tableHeaders,
      showDialog,
      rows,
      isFetching,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 1000px !important;

  &__body {
    max-height: 250px !important;
    overflow: auto;
  }
}
</style>
