<template>
  <SDialog v-bind="$attrs" v-on="restListener" @hide="resetHide">
    <template #title>
      {{ title }}
    </template>
    <template #body>
      <div class="row q-col-gutter-lg">
        <div class="col-5">
          <div class="row justify-between">
            <DialogJournalForm
              ref="cForm"
              :param="form"
              :journaltype="journaltype"
              :fixeds="disableInputs"
              :label="label"
              :debits="debits"
              :credits="credits"
              :remaining="remaining"
              :disable="disabled"
              @stage="onStage"
              @commit="onCommit"
            ></DialogJournalForm>
          </div>
        </div>
        <div class="col-7">
          <slot />
          <DialogJournalTable
            :data="transactions"
            :columns="columns"
            :shape="shape"
            height="350px"
            @delete="delRecord"
            @row-click="editRecord"
          ></DialogJournalTable>
        </div>
      </div>
    </template>
    <template #action-cancel>
      <q-btn
        @click="onCancelClick"
        label="Cancel"
        color="primary"
        flat
        class="q-mr-sm"
      />
    </template>
    <template #action-ok>
      <q-btn ref="okBtn" @click="onOKClick" label="Save" color="primary" />
    </template>
  </SDialog>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  unref,
  watch,
} from '@vue/composition-api';
import { TransTable, Journal } from '../models/journal.model';

type JournalTrans = Journal & TransTable;
const INIT_POINTER = -1;
const SET_RECORD = 'setRecord';
const DEL_RECORD = 'delRecord';
const CHG_RECORD = 'chgRecord';
export const initForm: JournalTrans = {
  key: INIT_POINTER,
  date: new Date(),
  referenceNo: '',
  description: '',
  debits: 0,
  credits: 0,
  remaining: 0,
  recid: '',
  accNo: '',
  accName: '',
  debit: 0,
  credit: 0,
  remark: '',
};

export default defineComponent<any>({
  inheritAttrs: true,
  props: {
    title: { type: String, required: true },
    journaltype: { type: Number, required: true },
    showSaveNotif: { type: Boolean, required: false },
    columns: { type: Array, required: false, default: () => [] },
    shape: { type: Array, required: false, default: () => [] },
    label: { type: String, required: true },
    disabled: { type: Boolean, required: false, default: false },
    disableInputs: {
      type: Array,
      required: false,
      default: () => [],
    },
    initForm: {
      type: Object,
      required: false,
      default: () => initForm,
    },
    transactions: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  setup(props, { root: { $q }, emit, listeners }) {
    const { hide, ...restListener } = listeners;
    const printForm = ref(false);
    const cForm = ref();
    const formPointer = ref<number>(INIT_POINTER);
    const records = ref<Map<number, JournalTrans>>(
      new Map([[INIT_POINTER, props.initForm]])
    );

    watch(
      () => props.initForm,
      (val) => {
        // we need some way to trigger formPointer
        // to activate the form computed
        formPointer.value = Number.MAX_VALUE;
        records.value.set(INIT_POINTER, val);
        formPointer.value = INIT_POINTER;
      }
    );

    const debits = computed(() => {
      let start = 0;
      props.transactions.forEach((it) => {
        start += Number.isInteger(it.debit) ? it.debit : parseInt(it.debit);
      });

      return start;
    });
    const credits = computed(() => {
      let start = 0;
      props.transactions.forEach((it) => {
        start += Number.isInteger(it.credit) ? it.credit : parseInt(it.credit);
      });

      return start;
    });
    const remaining = computed(() => {
      return debits.value - credits.value;
    });

    const form = computed(() => {
      const vRecord = unref(records);
      if (vRecord.size > 0) {
        const { credits, debits, remaining, ...item } = vRecord.get(
          formPointer.value
        );
        return {
          print: printForm.value,
          ...item,
        };
      }
    });

    function resetForm() {
      formPointer.value = Number.MAX_VALUE;
      records.value.set(INIT_POINTER, { key: INIT_POINTER, ...props.initForm });
      formPointer.value = INIT_POINTER;
    }

    function resetHide() {
      resetForm(); // make form into init state
      records.value.clear(); // clear all record
      emit('clearRecord', resetField);
      hide();
    }

    function onStage(pos, data) {
      emit(CHG_RECORD, pos, data);
    }

    async function delRecord(trans: TransTable) {
      $q.dialog({
        message: `Do You Want to Delete This Transaction?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        records.value.delete(trans.key);
        emit(DEL_RECORD, trans, resetField);
      });
    }

    function resetField(...keys) {
      const baseGroup = { ...form.value };

      keys.forEach((key) => {
        baseGroup[key] = props.initForm[key];
      });
      records.value.set(INIT_POINTER, { ...baseGroup, key: INIT_POINTER });
      formPointer.value = INIT_POINTER;
    }

    // add or replace in table
    async function onCommit(trans: JournalTrans) {
      let nKey, nVal;
      const vRecords = unref(records);
      const recordExist = vRecords.has(trans.key) && trans.key !== INIT_POINTER;
      // in edit mode
      if (recordExist) {
        nKey = trans.key;
        nVal = { ...trans };
      } else {
        // FIXED THIS KEY SYSTEM
        nKey = Math.abs(trans.key) + props.transactions.length;
        nVal = { ...trans, key: nKey };
      }

      vRecords.set(nKey, nVal);
      formPointer.value = nKey;
      if (props.showSaveNotif) {
        $q.notify({
          message: 'Click Save to apply change',
          onDismiss: () => {
            emit(SET_RECORD, nVal, recordExist, resetField);
          },
        });
      } else {
        emit(SET_RECORD, nVal, recordExist, resetField);
      }
    }

    // user click transaction on table
    async function editRecord(_, trans: TransTable) {
      let record;
      const vRecord = new Map(unref(records));
      const vInitForm = props.initForm;
      // edit record
      if (vRecord.has(trans.key)) {
        record = vRecord.get(trans.key);
      } else {
        // add new one record
        record = {
          ...vInitForm,
          ...trans,
        };
      }
      // update record
      records.value.set(trans.key, record);
      // set pointer
      formPointer.value = trans.key;
      emit('editRecord', record);
    }

    function onOKClick() {
      if (remaining.value !== 0) {
        $q.dialog({
          title: 'Journal Transacation not yet balance',
        });
      } else {
        $q.dialog({
          title: 'Confirm save',
          message: `Do you want to save entries this journal?`,
          ok: 'Save',
          cancel: 'Cancel',
        }).onOk(async () => {
          // FIXME: Transaksi tidak terkirim ke emiiter
          // FIXME: add new not terclean up after close dialog
          const vRecords = new Map(unref(records));
          const form = vRecords.get(INIT_POINTER);
          vRecords.delete(INIT_POINTER); //doest include the form just records

          emit('onOKClick', form, Array.of(...vRecords.values()));
        });
      }
    }

    function onCancelClick() {
      const total = records.value.size;
      if (total > 1) {
        $q.dialog({
          title: 'Unsafe Change',
          message: `there are ${total}`,
          ok: 'Save and Close',
          cancel: 'Cancel',
        }).onOk(() => onOKClick());
      } else {
        emit('onCancelClick');
      }
    }

    return {
      cForm,
      form,
      onCommit,
      delRecord,
      onOKClick,
      editRecord,
      onCancelClick,
      restListener,
      onStage,
      formPointer,
      resetHide,
      debits,
      credits,
      remaining,
      records,
      resetForm,
      printForm,
    };
  },
  components: {
    DialogJournalForm: () => import('./DialogJournalForm.vue'),
    DialogJournalTable: () => import('./DialogJournalTable.vue'),
  },
});
</script>
