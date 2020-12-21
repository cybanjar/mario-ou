<template>
  <div>
    <q-form @submit="onChange" @reset="onReset">
      <div class="row justify-between">
        <div class="col-5">
          <SInput
            label-text="Date"
            type="date"
            v-model="record.date"
            :disable="isFixed('date')"
            :readonly="isFixed('date')"
          ></SInput>
        </div>
        <div class="col-5">
          <SInput
            label-text="Reference Number"
            v-model="record.referenceNo"
            :disable="isFixed('referenceNo')"
            :readonly="isFixed('referenceNo')"
          ></SInput>
        </div>
      </div>
      <div class="col-5">
        <SInput
          label-text="Description"
          v-model="record.description"
          :disable="isFixed('description')"
          :readonly="isFixed('description')"
        ></SInput>
      </div>
      <q-separator spaced />
      <div class="row justify-between">
        <div class="col-5">
          <SInput
            mask="##.##.####"
            placeholder="00.00.0000"
            label-text="Account Number"
            unmasked-value
            v-model="record.accNo"
            :disable="isFixed('accNo')"
            :readonly="isFixed('accNo')"
          >
            <template v-slot:append>
              <q-btn
                @click="accDialog.show"
                round
                dense
                flat
                icon="mdi-magnify"
              />
            </template>
          </SInput>
        </div>
        <div class="col-5">
          <SInput
            label-text="Account Name"
            v-model="record.accName"
            dense
            autogrow
            :disable="isFixed('accName')"
            :readonly="isFixed('accName')"
          ></SInput>
        </div>
      </div>
      <div class="col-5">
        <SInput
          label-text="Remark"
          v-model="record.remark"
          :disable="isFixed('remark')"
          :readonly="isFixed('remark')"
        ></SInput>
      </div>
      <div class="row justify-between">
        <div class="col-5">
          <SInputMoney
            label-text="Credit"
            v-model="record.credit"
            :disable="isFixed('credit')"
            :readonly="isFixed('credit')"
          ></SInputMoney>
        </div>
        <div class="col-5">
          <SInputMoney
            label-text="Debit"
            v-model="record.debit"
            :disable="isFixed('debit')"
            :readonly="isFixed('debit')"
          ></SInputMoney>
        </div>
      </div>
      <div class="width-full row q-gutter-md q-mb-md">
        <q-btn
          outline
          flat
          type="reset"
          color="white"
          class="col"
          text-color="black"
          label="Reset"
          :disable="isFixed('btn')"
          :readonly="isFixed('btn')"
        />
        <q-btn
          type="submit"
          color="white"
          icon="mdi-export"
          class="col"
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
          :value="formatterMoney(credits)"
        />
      </div>
      <div class="col-5">
        <SRemarkLeftDrawer
          right
          label="Total Credit"
          :value="formatterMoney(debits)"
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
        <q-checkbox
          v-model="record.print"
          left-label
          label="Summary Per Date"
        />
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
  watchEffect,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { JournalTrans } from '../models/journal.model';
import { formatterMoney } from '../../helpers/formatterMoney.helper';
import { date } from 'quasar';
import { useDialog } from '../compositions/use-dialog.composition';

const journalTrans: JournalTrans = {
  key: -1,
  date: date.formatDate(new Date(), 'YYYY-MM-DD'),
  referenceNo: '',
  description: '',
  debits: 0,
  credits: 0,
  remaining: 0,
  accNo: '',
  accName: '',
  debit: 0,
  credit: 0,
  remark: '',
  jnr: 0,
  recid: '',
};

export default defineComponent({
  props: {
    label: { type: String, required: true },
    debits: { type: Number, required: false, default: 0 },
    credits: { type: Number, required: false, default: 0 },
    remaining: { type: Number, required: false, default: 0 },
    param: {
      type: Object as () => JournalTrans,
      required: false,
      default: () => journalTrans,
    },
    validator: { type: Function, required: false },
    disable: { type: Boolean, required: false, default: true },
    fixeds: {
      type: Array as () => string[],
      required: false,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const accDialog = useDialog();
    const state = reactive({
      record: props.param,
    });

    watchEffect(() => {
      state.record = props.param;
    });

    function fillAccField(account) {
      state.record.accNo = account.accountNumber;
      state.record.accName = account.accountName;
      accDialog.hide();
    }

    function isFixed(label) {
      return props.fixeds.includes(label) || props.disable;
    }

    function onChange() {
      emit('commit', state.record);
    }

    function onReset() {
      state.record = props.param;
      emit('reset', state.record);
    }

    function pickAcc() {
      accDialog.show();
    }

    return {
      ...toRefs(state),
      isFixed,
      onChange,
      pickAcc,
      accDialog,
      fillAccField,
      formatterMoney,
      onReset,
    };
  },
  components: {
    AccDialog: () => import('./AccDialog.vue'),
  },
});
</script>
