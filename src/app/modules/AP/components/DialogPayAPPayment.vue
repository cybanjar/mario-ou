<template>
  <q-dialog :value="show" @hide="hide">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Payment Record</span>
      </div>
      <div class="bg-white q-pa-lg">
        <div class="row">
          <div class="col-3">
            <q-form @submit="onSubmit" :novalidate="true">
              <div class="input-field">
                <SInput
                  label-text="Payment Date"
                  input-classes="q-mb-sm"
                  v-model="formData.date"
                  hide-bottom-space
                  readonly
                  :rules="['date']"
                >
                  <template #append>
                    <q-icon name="mdi-calendar" />
                  </template>

                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="formData.date"
                      mask="DD/MM/YYYY"
                      today-btn
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </SInput>
              </div>

              <q-separator class="q-mb-sm" />
              <div class="input-field">
                <SelectFilter
                  label-text="Payment Article"
                  :options="paymentArticleOptions"
                  option-value="artnr"
                  option-label="bezeich"
                  v-model="formData.article"
                  hide-bottom-space
                  lazy-rules
                  :rules="[(val) => val || 'Please select payment article']"
                />

                <SInput
                  label-text="In Percentage"
                  suffix="%"
                  @input="onPercentageInput"
                  v-model.number="formData.percentage"
                  type="number"
                  input-class="text-right"
                  hide-bottom-space
                  :rules="[
                    (val) =>
                      (val > 0 && val <= 100) ||
                      'Percentage must between 0 and 100',
                  ]"
                />

                <SInput
                  label-text="In Amount"
                  @input="onAmountInput"
                  :value="formData.amount"
                  type="number"
                  input-class="text-right"
                  hide-bottom-space
                />

                <SInput label-text="Payment Remark" v-model="formData.remark" />

                <q-btn
                  block
                  color="primary"
                  max-height="28"
                  label="Add Payment"
                  type="submit"
                  class="full-width"
                />
              </div>
            </q-form>
            <q-separator class="q-mb-sm q-mt-md" />
            <div class="input-field">
              <SRemarkLeftDrawer
                label="Total"
                :value="formatterMoney(total)"
                right
              />
              <SRemarkLeftDrawer
                label="Balance"
                :value="formatterMoney(balance)"
                right
              />
            </div>
          </div>
          <div class="col-9 q-px-sm">
            <STable
              :columns="dialogPaymentColumns"
              :data="records"
              :pagination="{ rowsPerPage: 0 }"
              :rows-per-page-options="[0]"
            >
              <template #header-cell-actions="props">
                <q-th :props="props" class="fixed-col right">
                  {{ props.col.label }}
                </q-th>
              </template>

              <template #body-cell-actions="props">
                <q-td :props="props" class="fixed-col right">
                  <q-icon name="mdi-dots-vertical" size="16px">
                    <q-menu auto-close anchor="bottom right" self="top right">
                      <q-list>
                        <q-item
                          clickable
                          v-ripple
                          @click="deleteRecord(props.row.key)"
                        >
                          <q-item-section>Delete</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-icon>
                </q-td>
              </template>
            </STable>
          </div>
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
        <q-btn label="Save" color="primary" />
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watch,
  computed,
} from '@vue/composition-api';
import { date } from 'quasar';
import {
  ResPaymentArticle,
  ResPaymentList,
  PaymentRecord,
} from '../models/payment.model';
import { formatterMoney } from '../../../helpers/formatterMoney.helper';
import { dialogPaymentColumns } from '../tables/dialog-payment.table';

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    selectedRow: { type: Array, required: true },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const hide = () => emit('hide');

    const formData = reactive({
      date: date.formatDate(new Date('01/14/2019'), 'DD/MM/YYYY'),
      article: null as number | null,
      percentage: 0,
      amount: 0,
      remark: '',
    });

    const initialBalance = computed(() =>
      (props.selectedRow as ResPaymentList[]).reduce(
        (accumulator, currentValue) => accumulator + currentValue['tot-debt'],
        0
      )
    );

    // Start setup form options
    const paymentArticleOptions = ref<ResPaymentArticle[]>([]);
    watch(
      () => props.show,
      async (show) => {
        if (!show) return;
        paymentArticleOptions.value = await $api.accountsPayable.getPaymentArticle(
          {
            ageList: { 'age-list': props.selectedRow as ResPaymentList[] },
            rundung: 2,
            outstand: initialBalance.value,
          }
        );
      }
    );
    // End setup form options

    function onPercentageInput(e) {
      if (!e) return;

      formData.percentage = parseFloat(e);
      formData.amount = -Math.abs(
        initialBalance.value * (formData.percentage / 100)
      );
    }

    function onAmountInput(e) {
      if (!e) return;

      formData.amount = -Math.abs(parseInt(e));
      const percentage = Math.abs(formData.amount / initialBalance.value) * 100;
      formData.percentage = parseFloat(percentage.toFixed(2));
    }

    const records = ref<(PaymentRecord & { key: number })[]>([]);

    const total = computed(() =>
      records.value.reduce(
        (accumulator, currentValue) => accumulator + currentValue.betrag,
        0
      )
    );
    const balance = computed(() => initialBalance.value + total.value);

    function onSubmit() {
      if (!formData.article) return;
      if (Math.abs(formData.amount) > balance.value) {
        $q.notify({
          type: 'warning',
          message: 'Total paid cannot be greater than Balance',
          timeout: 2000,
        });
        return;
      }

      records.value.push({
        key: records.value.length,
        artnr: formData.article,
        bezeich:
          paymentArticleOptions.value.find(
            (item) => item.artnr == formData.article
          )?.bezeich ?? '',
        proz: formData.percentage,
        betrag: formData.amount,
        dummy: formData.remark,
      });
    }

    function deleteRecord(recordKey: number) {
      records.value = records.value.filter((item) => item.key !== recordKey);
    }

    return {
      hide,
      formData,
      paymentArticleOptions,
      initialBalance,
      formatterMoney,
      dialogPaymentColumns,
      onPercentageInput,
      onAmountInput,
      records,
      balance,
      total,
      onSubmit,
      deleteRecord,
    };
  },
  components: {
    SelectFilter: () => import('./SelectFilter.vue'),
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 1000px !important;

  .input-field {
    padding-left: 24px;
    padding-right: 32px;
  }
}
</style>
