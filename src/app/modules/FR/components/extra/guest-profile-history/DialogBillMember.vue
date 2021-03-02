<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">View History</span>
      </div>

      <div class="dialog__body">
        <div class="bg-white q-pa-lg">
          <div class="row q-col-gutter-x-lg">
            <div class="col-3 dialog__sidebar q-pr-md">
              <RemarkContent label="Remark" :value="remark" />
            </div>

            <div class="col-9">
              <q-btn flat round class="block q-mb-md">
                <img :src="require(`~/app/icons/Icon-Print.svg`)" height="25" />
              </q-btn>

              <span class="q-mt-md"
                >Reservation Number:
                {{ guestProfileHistoryData && guestProfileHistoryData.resnr }}
              </span>
              <STable
                row-key="$_index"
                :columns="tableHeaderReservationNumber"
                :data="rowsWithIndex"
                :loading="isLoading"
                :selected.sync="selected"
                @row-click="onRowClick"
                no-data-text="No Data"
                no-pagination
                class="sticky-header"
                style="max-height: 208px"
              />

              <div class="row q-col-gutter-x-md q-mt-lg">
                <div class="col-5">
                  <span class="q-mt-md">Guest Bill</span>
                  <STable
                    :columns="tableHeaderGuestBill"
                    :loading="isLoadingGuestBill"
                    row-key="$_index"
                    :data="guestBillRowsWithIndex"
                    :selected.sync="selectedGuestBill"
                    @row-click="onRowClickGuestBill"
                    no-pagination
                    no-data-text="No Data"
                    class="sticky-header"
                    style="max-height: 188px"
                  />
                </div>
                <div class="col-7">
                  <span class="q-mt-md">Bill Details</span>
                  <STable
                    :columns="tableHeaderBillDetails"
                    :loading="isLoadingBillDetail"
                    :data="billDetailRows"
                    no-pagination
                    no-data-text="No Data"
                    class="sticky-header"
                    style="max-height: 188px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn label="Ok" color="primary" v-close-popup />
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  toRefs,
  ref,
  watch,
} from '@vue/composition-api';
import {
  GuestProfileHistory,
  HistoryList,
  ReqHistoryList,
  GuestBill,
  BillDetail,
} from '../../../models/extra/guest-profile-guest-history/guestProfileGuestHistory.model';
import RemarkContent from '../../common/RemarkContent.vue';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { TableHeader } from '~/components/VhpUI/typings';
import {
  RowWithIndex,
  useDirectSelectedRow,
} from '../../../composables/selectedRow';
import { date } from 'quasar';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { displayTime } from '~/app/helpers/displayTime.helper';

const tableHeaderReservationNumber: TableHeader<HistoryList>[] = [
  {
    label: 'Arrival',
    align: 'left',
    name: 'ankunft',
    field: 'ankunft',
    format: (value: string) => date.formatDate(value, 'DD/MM/YY'),
  },
  {
    label: 'Departure',
    align: 'left',
    name: 'abreise',
    field: 'abreise',
    format: (value: string) => date.formatDate(value, 'DD/MM/YY'),
  },
  { label: 'Time', align: 'left', name: 'abreisezeit', field: 'abreisezeit' },
  { label: 'Room Type', align: 'left', name: 'zikateg', field: 'zikateg' },
  {
    label: 'Room Rate',
    name: 'zipreis',
    field: 'zipreis',
    format: (value: number) => formatterMoney(value),
  },
  {
    label: 'Arrangement Code',
    align: 'left',
    name: 'arrangement',
    field: 'arrangement',
  },
  {
    label: 'Total Turnover',
    name: 'gesamtumsatz',
    field: 'gesamtumsatz',
    format: (value: number) => formatterMoney(value),
  },
  {
    label: 'Arrangement Turnover',
    name: 'argtumsatz',
    field: 'argtumsatz',
    format: (value: number) => formatterMoney(value),
  },
  {
    label: 'Food & Beverage Turnover',
    name: 'f-b-umsatz',
    field: 'f-b-umsatz',
    format: (value: number) => formatterMoney(value),
  },
  {
    label: 'Miscellaneous Turnover',
    name: 'sonst-umsatz',
    field: 'sonst-umsatz',
    format: (value: number) => formatterMoney(value),
  },
  {
    label: 'Payment',
    name: 'zahlungsart',
    field: 'zahlungsart',
  },
  {
    label: 'Segment Code',
    align: 'left',
    name: 'segmentcode',
    field: 'segmentcode',
  },
  {
    label: 'Room Change',
    align: 'left',
    name: 'zi-wechsel',
    field: 'zi-wechsel',
    format: (val: boolean) => (val ? 'Yes' : 'No'),
  },
  { label: 'Guest Name', align: 'left', name: 'gastinfo', field: 'gastinfo' },
  {
    label: 'Address',
    align: 'left',
    // TODO: Field unavailable on issue ticket
  },
];

const tableHeaderGuestBill: TableHeader<GuestBill>[] = [
  { label: 'Bill Number', name: 'rechnr', field: 'rechnr' },
  { label: 'Number', name: 'billnr', field: 'billnr' },
  { label: 'Bill Name', align: 'left', name: 'name', field: 'name' },
  { label: 'Room Number', align: 'left', name: 'zinr', field: 'zinr' },
  {
    label: 'Date',
    align: 'left',
    name: 'datum',
    field: 'datum',
    format: (value) => date.formatDate(value, 'DD/MM/YY'),
  },
];

const tableHeaderBillDetails: TableHeader<BillDetail>[] = [
  { label: 'Bill Number', name: 'rechnr', field: 'rechnr' },
  { label: 'Article Number', name: 'artnr', field: 'artnr' },
  { label: 'Description', align: 'left', name: 'bezeich', field: 'bezeich' },
  {
    label: 'Bill Date',
    align: 'left',
    name: 'bill-datum',
    field: 'bill-datum',
    format: (value: string) => date.formatDate(value, 'DD/MM/YY'),
  },
  {
    label: 'Unit Price',
    name: 'epreis',
    field: 'epreis',
    format: (value: number) => formatterMoney(value),
  },
  {
    label: 'Amount',
    name: 'betrag',
    field: 'betrag',
    format: (value: number) => formatterMoney(value),
  },
  {
    label: 'Foreign Amount',
    name: 'fremdwbetrag',
    field: 'fremdwbetrag',
    format: (value: number) => formatterMoney(value),
  },
  { label: 'ID', align: 'left', name: 'userinit', field: 'userinit' },
  {
    label: 'System Date',
    align: 'left',
    name: 'sysdate',
    field: 'sysdate',
    format: (value) => date.formatDate(value, 'DD/MM/YY'),
  },
  {
    label: 'Time',
    align: 'left',
    name: 'zeit',
    field: 'zeit',
    format: (value) => displayTime(value),
  },
];

export default defineComponent({
  components: {
    RemarkContent,
  },
  props: {
    show: { type: Boolean, required: true },
    guestProfileHistoryData: {
      type: Object as PropType<GuestProfileHistory>,
      default: null,
    },
  },
  setup(props, { emit, root: { $api, $route } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const state = reactive({
      isLoading: false,
      isLoadingGuestBill: false,
      isLoadingBillDetail: false,
      remark: '',
    });
    let historyListData: HistoryList = null;
    const historyListRows = ref<HistoryList[]>([]);

    if (showDialog.value) {
      getData();
    }

    async function getData() {
      state.isLoading = true;
      const reqHistoryList: ReqHistoryList = {
        caseType: 1,
        gastNo: Number($route.params.id),
        resNo: props.guestProfileHistoryData.resnr,
        reslinNo: props.guestProfileHistoryData.reslinnr,
        rmNo: ' ',
        arrive: date.formatDate(
          props.guestProfileHistoryData.ankunft,
          'MM/DD/YY'
        ),
        depart: date.formatDate(
          props.guestProfileHistoryData.abreise,
          'MM/DD/YY'
        ),
      };
      historyListData = await $api.frontOfficeReception.readHistoryList(
        reqHistoryList
      );
      historyListRows.value = await $api.frontOfficeReception.getViewHistory(
        props.guestProfileHistoryData.resnr,
        historyListData
      );
      state.isLoading = false;
    }

    const historyListSelectedRow = ref<RowWithIndex<HistoryList>>(null);
    const { rowsWithIndex, selected, onRowClick } = useDirectSelectedRow(
      historyListRows,
      historyListSelectedRow,
      true
    );

    const guestBillRows = ref<GuestBill[]>([]);
    const billDetailRows = ref<BillDetail[]>([]);
    watch(historyListSelectedRow, async (newValue) => {
      state.remark = newValue.gastinfo;
      let tempReslinnr: number;
      if (newValue.$_index !== 0) {
        tempReslinnr = 1;
      } else {
        tempReslinnr = newValue.reslinnr === 999 ? 0 : newValue.reslinnr;
      }

      state.isLoadingGuestBill = true;
      guestBillRows.value = await $api.frontOfficeReception.getGuestBill(
        newValue.resnr,
        tempReslinnr
      );
      billDetailRows.value = [];
      guestBillSelectedRow.value = null;
      state.isLoadingGuestBill = false;
    });

    const guestBillSelectedRow = ref<GuestBill>(null);
    const {
      rowsWithIndex: guestBillRowsWithIndex,
      selected: selectedGuestBill,
      onRowClick: onRowClickGuestBill,
    } = useDirectSelectedRow(guestBillRows, guestBillSelectedRow, true);

    watch(guestBillSelectedRow, async (newValue) => {
      if (newValue) {
        state.isLoadingBillDetail = true;
        billDetailRows.value = await $api.frontOfficeReception.getBillDetail(
          newValue.rechnr,
          historyListData
        );
        state.isLoadingBillDetail = false;
      }
    });

    return {
      ...toRefs(state),
      showDialog,
      tableHeaderReservationNumber,
      tableHeaderGuestBill,
      tableHeaderBillDetails,

      guestBillSelectedRow,
      guestBillRowsWithIndex,
      selectedGuestBill,
      onRowClickGuestBill,

      historyListRows,
      guestBillRows,
      billDetailRows,

      rowsWithIndex,
      selected,
      onRowClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 980px !important;

  &__body {
    max-height: 460px !important;
    overflow: auto;
  }

  &__sidebar {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
  }
}
</style>
