<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">
          Guest Information
          {{ guestInformation && ` - ${guestInformation.name}` }}
        </span>
      </div>

      <div class="dialog__body">
        <div class="row bg-white q-pa-md q-col-gutter-x-lg">
          <template v-if="guestInformation">
            <div class="col">
              <div class="box-info">
                <div class="box-info__header text-center">
                  <span class="box-info__title">Reservation</span>
                </div>
                <div class="box-info__body">
                  <div class="q-pa-md">
                    <div class="row justify-between q-pb-sm q-col-gutter-x-lg">
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>Last Arrival</span>
                          <span>{{
                            date.formatDate(guestInformation.date1, 'DD/MM/YY')
                          }}</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>Last Reservation</span>
                          <span>{{
                            date.formatDate(
                              guestInformation['letzte-res'],
                              'DD/MM/YY'
                            )
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="row justify-between q-pb-sm q-col-gutter-x-lg">
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>Last Departure</span>
                          <span>{{
                            date.formatDate(guestInformation.date2, 'DD/MM/YY')
                          }}</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>First Reservation</span>
                          <span>{{
                            date.formatDate(
                              guestInformation['erste-res'],
                              'DD/MM/YY'
                            )
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="row justify-between q-pb-xl q-col-gutter-x-lg">
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>In-house</span>
                          <span>{{
                            guestInformation.resflag === 2
                              ? 'Yes'
                              : guestInformation.resflag
                          }}</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>Next Reservation</span>
                          <span>{{
                            date.formatDate(
                              guestInformation['naechste-res'],
                              'DD/MM/YY'
                            )
                          }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="row justify-between q-pb-sm q-col-gutter-x-lg">
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>Cancellations</span>
                          <span>{{ guestInformation.stornos }}</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>No Show</span>
                          <span>{{ guestInformation.noshows }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="row justify-between q-pb-xl q-col-gutter-x-lg">
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>Room Night</span>
                          <span>{{ guestInformation.logiernachte }}</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>Number of Stay</span>
                          <span>{{ guestInformation.zimmeranz }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="row justify-between q-pb-md q-col-gutter-x-lg">
                      <div class="col">
                        <div class="flex justify-between q-pb-sm border-bottom">
                          <span>City Ledger Payment</span>
                          <span>{{ guestInformation.payment }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="box-info q-mb-md">
                <div class="box-info__header text-center">
                  <span class="box-info__title">Guest Profile Created</span>
                </div>
                <div class="box-info__body">
                  <div class="q-pa-md">
                    <div class="row justify-between q-pb-sm q-col-gutter-x-lg">
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>Created Date</span>
                          <span>{{
                            date.formatDate(
                              guestInformation['anlage-datum'],
                              'DD/MM/YY'
                            )
                          }}</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>Created By</span>
                          <span>{{ guestInformation.char1 }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="row justify-between q-pb-sm q-col-gutter-x-lg">
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>Modified Date</span>
                          <span>{{
                            date.formatDate(
                              guestInformation['modif-datum'],
                              'DD/MM/YY'
                            )
                          }}</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="flex justify-between q-pb-xs border-bottom">
                          <span>Modified By</span>
                          <span>{{ guestInformation.char2 }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="box-info">
                <div class="box-info__header">
                  <div class="row">
                    <div class="col-4 text-h6">Turnover</div>
                    <span class="col-8 row">
                      <span class="col-7 text-right">
                        <div class="text-h6">
                          {{ formatterMoney(guestInformation.gesamtumsatz) }}
                        </div>
                        <span class="text-caption">Amount</span>
                      </span>
                      <span class="col-5 text-right">
                        <div class="text-h6">
                          {{ guestInformation.gesamtumsatz ? 100 : 0 }}
                        </div>
                        <span class="text-caption">Percentage</span>
                      </span>
                    </span>
                  </div>
                </div>
                <div class="box-info__body q-pa-lg">
                  <div class="row q-pb-xs q-mb-sm border-bottom">
                    <div class="col-4">Arrangement</div>
                    <span class="col-8 row">
                      <span class="col-7 text-right">
                        <div>
                          {{ formatterMoney(guestInformation.argtumsatz) }}
                        </div>
                      </span>
                      <span class="col-5 text-right">
                        <div>
                          {{
                            guestInformation.argtumsatz
                              ? (guestInformation.argtumsatz /
                                  guestInformation.gesamtumsatz) *
                                100
                              : 0
                          }}
                        </div>
                      </span>
                    </span>
                  </div>
                  <div class="row q-pb-xs q-mb-sm border-bottom">
                    <div class="col-4">Food & Beverage</div>
                    <span class="col-8 row">
                      <span class="col-7 text-right">
                        <div>
                          {{ formatterMoney(guestInformation['f-b-umsatz']) }}
                        </div>
                      </span>
                      <span class="col-5 text-right">
                        <div>
                          {{
                            guestInformation.argtumsatz
                              ? (guestInformation['f-b-umsatz'] /
                                  guestInformation.gesamtumsatz) *
                                100
                              : 0
                          }}
                        </div>
                      </span>
                    </span>
                  </div>
                  <div class="row q-pb-xs border-bottom">
                    <div class="col-4">Other</div>
                    <span class="col-8 row">
                      <span class="col-7 text-right">
                        <div>
                          {{ formatterMoney(guestInformation['sonst-umsatz']) }}
                        </div>
                      </span>
                      <span class="col-5 text-right">
                        <div>
                          {{
                            guestInformation.argtumsatz
                              ? (guestInformation['sonst-umsatz'] /
                                  guestInformation.gesamtumsatz) *
                                100
                              : 0
                          }}
                        </div>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="q-pa-md bg-white">
          <p>Revenue Breakdown</p>
          <STable
            :columns="tableHeaders"
            :data="rows"
            no-data-text="No Data"
            style="max-height: 250px"
            class="sticky-header"
            no-pagination
          >
            <template #header-cell-actions="props">
              <q-th :props="props" class="fixed-col right">
                {{ props.col.label }}
              </q-th>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props" class="fixed-col right">
                <q-btn
                  flat
                  round
                  size="sm"
                  padding="none"
                  @click="dialogOutletBill.open(props.row)"
                >
                  <TooltipIcon
                    name="mdi-alert-circle-outline"
                    tooltip-text="Bill Details"
                  />
                </q-btn>
              </q-td>
            </template>
          </STable>
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn label="OK" color="primary" class="q-mr-sm" v-close-popup />
      </div>

      <q-inner-loading
        :showing="isFetching"
        color="primary"
        style="z-index: 3"
      />
    </div>

    <DialogOutletBillDetails
      :show.sync="dialogOutletBill.state.show"
      :key="dialogOutletBill.state.key"
      :revenue-breakdown="dialogOutletBill.state.data"
    />
  </q-dialog>
</template>

<script lang="ts">
import { date } from 'quasar';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { TableHeader } from '~/components/VhpUI/typings';
import {
  GuestInformation,
  RevenueBreakdown,
} from '../../models/guest-profile/guestInformation.model';
import TooltipIcon from '../common/TooltipIcon.vue';
import { useDisposableDialog } from '../../composables/disposableDialog';

const tableHeaders: TableHeader<RevenueBreakdown>[] = [
  {
    label: 'Outlet',
    name: 'dept-str',
    field: 'dept-str',
    align: 'left',
  },
  {
    label: 'Food',
    name: 'food-str',
    field: 'food-str',
  },
  {
    label: 'Beverage',
    name: 'bev-str',
    field: 'bev-str',
  },
  {
    label: 'Other',
    name: 'oth-str',
    field: 'oth-str',
  },
  {
    label: 'Room Number',
    name: 'rmno',
    field: 'rmno',
    align: 'left',
  },
  {
    label: 'Room Type',
    name: 'rcat',
    field: 'rcat',
    align: 'left',
  },
  {
    label: 'Arrival',
    name: 'ci-str',
    field: 'ci-str',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Departure',
    name: 'co-str',
    field: 'co-str',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { name: 'actions' },
];

export default defineComponent({
  components: {
    TooltipIcon,
    DialogOutletBillDetails: () => import('./DialogOutletBillDetails.vue'),
  },
  props: {
    show: { type: Boolean, required: true },
    guestNumber: { type: Number, default: null },
  },
  setup(props, { emit, root: { $api } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const state = reactive({
      isFetching: false,
      guestInformation: null as GuestInformation | null,
      rows: [] as RevenueBreakdown[],
    });

    if (showDialog.value && props.guestNumber) {
      state.isFetching = true;
      $api.frontOfficeReception
        .searchGuestInformation({
          pvILanguage: 1,
          gastnr: props.guestNumber,
        })
        .then((value) => {
          state.guestInformation = value.guestInformation;
          state.rows = value.revenueBreakdown;
          state.isFetching = false;
        });
    }

    return {
      ...toRefs(state),
      dialogOutletBill: useDisposableDialog<RevenueBreakdown>(null),
      formatterMoney,
      tableHeaders,
      showDialog,
      date,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 1000px !important;

  &__body {
    max-height: 470px !important;
    overflow: auto;
  }
}

.box-info {
  &__header {
    background: $primary-grad;
    border-radius: 5px 5px 0 0;
    color: #fff;
    padding: 8px 24px;
  }

  &__title {
    font-size: 14px;
    font-weight: 700;
  }

  &__body {
    border-bottom: 1px solid $primary;
    border-left: 1px solid $primary;
    border-radius: 0 0 5px 5px;
    border-right: 1px solid $primary;
  }
}

.border-bottom {
  border-bottom: 1px solid grey;
}
</style>
