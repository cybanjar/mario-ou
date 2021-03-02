<template>
  <div>
    <q-form
      v-if="dateLimit.data.isLoading === false"
      @keydown.enter.prevent.self
      @submit="onChange"
      @reset="onReset"
    >
      <div class="row justify-between">
        <div class="col-5">
          <SDateInput
            label-text="Date"
            v-model="date"
            :options="dateOptions"
            :disable="isFixed('date')"
            :readonly="isFixed('date')"
            @keydown.enter="focusNext"
          />
        </div>
        <div class="col-5">
          <SInput
            label-text="Reference Number"
            v-model="referenceNo"
            :disable="isFixed('referenceNo')"
            :readonly="isFixed('referenceNo')"
            @keydown.enter="focusNext"
          ></SInput>
        </div>
      </div>
      <div class="col-5">
        <SInput
          label-text="Description"
          v-model="description"
          :disable="isFixed('description')"
          :readonly="isFixed('description')"
          @keydown.enter="focusNext"
        ></SInput>
      </div>
      <q-separator spaced />
      <div class="row justify-between">
        <div class="col-5">
          <SInput
            ref="accNoEl"
            mask="##.##.####"
            label-text="Account Number"
            unmasked-value
            v-model="accNo"
            :placeholder="accNoPhr"
            :disable="isFixed('accNo')"
            :readonly="isFixed('accNo')"
            @keydown.enter="focusNext"
          >
            <template v-slot:append>
              <q-btn
                @click="accDialog.show"
                round
                dense
                flat
                style="color: #167ec9;"
                icon="mdi-help-circle"
              />
            </template>
          </SInput>
        </div>
        <div class="col-5">
          <SInput
            label-text="Account Name"
            v-model="accName"
            dense
            autogrow
            :disable="isFixed('accName')"
            :readonly="isFixed('accName')"
            @keydown.enter="focusNext"
          ></SInput>
        </div>
      </div>
      <div class="col-5">
        <SInput
          label-text="Remark"
          v-model="remark"
          :disable="isFixed('remark')"
          :readonly="isFixed('remark')"
          @keydown.enter="focusNext"
        ></SInput>
      </div>
      <div class="row justify-between">
        <div class="col-5">
          <SInputMoney
            label-text="Credit"
            v-model="credit"
            :disable="isFixed('credit')"
            :readonly="isFixed('credit')"
            @keydown.enter="focusNext"
          ></SInputMoney>
        </div>
        <div class="col-5">
          <SInputMoney
            label-text="Debit"
            v-model="debit"
            :disable="isFixed('debit')"
            :readonly="isFixed('debit')"
            @keydown.enter="focusNext"
          ></SInputMoney>
        </div>
      </div>
      <div
        class="width-full q-py-sm row q-gutter-md q-mb-md items-center justify-center"
      >
        <q-btn
          type="submit"
          color="white"
          icon="mdi-export"
          class="col-7"
          text-color="black"
          :label="label"
          :disable="isFixed('btn')"
          :readonly="isFixed('btn')"
        />
      </div>
    </q-form>
    <div class="row justify-between">
      <div class="col-5">
        <SRemarkLeftDrawer
          right
          label="Total Debit"
          :value="formatterMoney(debits)"
        />
      </div>
      <div class="col-5">
        <SRemarkLeftDrawer
          right
          label="Total Credit"
          :value="formatterMoney(credits)"
        />
      </div>
    </div>
    <div class="row justify-between">
      <div class="col-5">
        <SRemarkLeftDrawer
          right
          label="Balance"
          :value="formatterMoney(remaining)"
        />
      </div>
      <div class="col-5">
        <q-checkbox v-model="print" left-label label="Summary Per Date" />
      </div>
    </div>
    <AccDialog
      :value="accDialog.status"
      @hide="accDialog.hide"
      @onOk="fillAccField"
    />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  watch,
} from '@vue/composition-api';
import { JournalTrans } from '../models/journal.model';
import { formatterMoney } from '../../helpers/formatterMoney.helper';
import { date } from 'quasar';
import { useDialog } from '../compositions/use-dialog.composition';
import { usePrepare } from '../compositions/use-prepare.composition';

export default defineComponent({
  props: {
    label: { type: String, required: true },
    journaltype: { type: Number, required: true },
    debits: { type: Number, required: false, default: 0 },
    credits: { type: Number, required: false, default: 0 },
    remaining: { type: Number, required: false, default: 0 },
    param: {
      type: Object as () => JournalTrans,
      required: true,
    },
    validator: { type: Function, required: false },
    disable: { type: Boolean, required: false, default: false },
    fixeds: {
      type: Array as () => string[],
      required: false,
      default: () => [],
    },
  },
  setup(props, { emit, root: { $api } }) {
    const accDialog = useDialog();
    const filter = reactive({ ...props.param });
    const accNoEl = ref();
    const accNoPhr = ref('99.99.9999');

    watch(
      () => props.param,
      (val) => {
        // focust to this first
        if (!val.accNo && !isFixed('accNo')) {
          accNoEl?.value.$children[0].focus(); // focust accNo
        }
        Object.assign(filter, val);
      }
    );

    const dateLimit = usePrepare(
      true,
      () =>
        Promise.all([
          $api.common.getGeneralParam(props.journaltype, 558),
          $api.common.getGeneralParam(props.journaltype, 110),
          $api.common.getGeneralParam(3, 977),
        ]),
      ([_, generalSatuSatuPuluh, accInit]) => {
        filter.date = new Date(generalSatuSatuPuluh.fdate);

        accNoPhr.value = accInit.fchar.replace(/\-/g, '.');
      },
      ([generalLimaLimaLapan, generalSatuSatuPuluh]) => {
        const closeMonth = date.formatDate(
          generalLimaLimaLapan.fdate,
          'YYYY/MM/DD'
        );
        const billingDate = date.formatDate(
          generalSatuSatuPuluh.fdate,
          'YYYY/MM/DD'
        );
        return {
          closeMonth,
          billingDate,
        };
      }
    );

    function fillAccField(account) {
      filter.accNo = account.accountNumber;
      filter.accName = account.accountName;
      accDialog.hide();
    }

    function isFixed(label) {
      return props.fixeds.includes(label) || props.disable;
    }

    function focusNext(e) {
      const inputs: any[] = Array.from(
        e.target.form.querySelectorAll('input, textarea')
      );
      const index = inputs.indexOf(e.target);

      if (index < inputs.length) {
        emit('stage', index, filter);
        inputs[index + 1].focus();
      }
    }
    function onChange() {
      // validate here
      const param = { ...filter };
      param.debit = param.debit | 0;
      param.credit = param.credit | 0;
      emit('commit', param);
    }

    function onReset() {
      Object.assign(filter, props.param);
      emit('reset', filter);
    }

    function pickAcc() {
      accDialog.show();
    }

    function dateOptions(date: string) {
      const { billingDate, closeMonth } = dateLimit.result.value;
      return date > closeMonth && date <= billingDate;
    }

    return {
      ...toRefs(filter),
      accNoEl,
      accNoPhr,
      isFixed,
      focusNext,
      onChange,
      pickAcc,
      accDialog,
      fillAccField,
      formatterMoney,
      onReset,
      dateOptions,
      dateLimit,
    };
  },
  components: {
    AccDialog: () => import('./AccDialog.vue'),
  },
});
</script>
