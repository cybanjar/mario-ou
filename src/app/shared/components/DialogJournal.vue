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
              :param="form"
              :fixeds="disableInputs"
              :label="label"
              :debits="debits"
              :credits="credits"
              :remaining="remaining"
              :disable="disabled"
              @commit="onCommit"
            ></DialogJournalForm>
          </div>
        </div>
        <div class="col-7">
          <slot />
          <DialogJournalTable
            :is-fixed="false"
            :data="transactions"
            @delete="delRecord"
            @row-click="editRecord"
          ></DialogJournalTable>
        </div>
      </div>
    </template>
    <template #action-cancel="props">
      <q-btn
        @click="() => onCancelClick(props.handler)"
        label="Cancel"
        color="primary"
        flat
        class="q-mr-sm"
      />
    </template>
    <template #action-ok="props">
      <q-btn
        ref="okBtn"
        @click="() => onOKClick(props.handler)"
        label="Save"
        color="primary"
      />
    </template>
  </SDialog>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from '@vue/composition-api';
import { TransTable, Journal } from '../models/journal.model';
import { date } from 'quasar';

type JournalTrans = Journal & TransTable;

const initForm: JournalTrans = {
  key: -1,
  date: date.formatDate(new Date(), 'YYYY-MM-DD'),
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

export default defineComponent({
  inheritAttrs: true,
  props: {
    title: { type: String, required: true },
    label: { type: String, required: true },
    disabled: { type: Boolean, required: false, default: false },
    disableInputs: {
      type: Array as () => string[],
      required: false,
      default: () => [],
    },
    initForm: {
      type: Object as () => JournalTrans,
      required: false,
      default: () => initForm,
    },
    transactions: {
      type: Array as () => TransTable[],
      required: false,
      default: () => [],
    },
  },
  setup(props, { root: { $q }, emit, listeners }) {
    const { hide, ...restListener } = listeners;

    const formPointer = ref<number | 'init'>('init');
    const records = ref<Map<number, JournalTrans>>(new Map());
    const debits = computed(() => {
      let start = 0;
      props.transactions.forEach((it) => {
        start += it.debit;
      });

      return start;
    });
    const credits = computed(() => {
      let start = 0;
      props.transactions.forEach((it) => {
        start += it.credit;
      });

      return start;
    });
    const remaining = computed(() => {
      return debits.value - credits.value;
    });

    const form = computed(() => {
      const vFormPointer = unref(formPointer);
      const vRecord = unref(records);

      if (vFormPointer === 'init') {
        return props.initForm;
      } else {
        return vRecord.get(vFormPointer);
      }
    });

    function resetHide() {
      formPointer.value = 'init';
      records.value.clear();
      hide();
    }

    async function delRecord(trans: TransTable) {
      $q.dialog({
        title: 'Confirm delete',
        message: `Do you want to delete this transaction?`,
        ok: 'Delete',
        cancel: 'Cancel',
      }).onOk(async () => {
        emit('delrecord', trans);
      });
    }

    // add or replace in table
    async function onCommit(trans: JournalTrans) {
      const vRecords = unref(records);
      vRecords.set(trans.key, trans);
      formPointer.value = 'init';
      $q.notify({
        message: 'Click Save to apply change',
        onDismiss: () => {
          const exists = vRecords.has(-1);
          emit('setRecord', trans, exists);
          vRecords.delete(-1);
          emit('clearForm');
        },
      });
    }

    async function editRecord(_, trans: TransTable) {
      let record;
      const vRecord = unref(records);
      const vInitForm = props.initForm;

      formPointer.value = 'init';
      if (vRecord.has(trans.key)) {
        record = vRecord.get(trans.key);
        vRecord.set(-1, record);
      } else {
        record = {
          ...vInitForm,
          ...trans,
        };
        vRecord.set(-1, record);
      }
      formPointer.value = -1;
      emit('editRecord', record);
    }

    function onOKClick() {
      $q.dialog({
        title: 'Confirm save',
        message: `Do you want to save entries this journal?`,
        ok: 'Save',
        cancel: 'Cancel',
      }).onOk(async () => {
        const vRecords = unref(records);
        if (vRecords.has(-1)) {
          vRecords.delete(-1);
        }
        const transRaw: JournalTrans[] = Array.of(...vRecords.values());
        emit('onOKClick', transRaw);
      });
    }

    function onCancelClick() {
      const total = props.transactions.length;
      if (total > 2) {
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
      form,
      onCommit,
      delRecord,
      onOKClick,
      editRecord,
      onCancelClick,
      restListener,
      resetHide,
      debits,
      credits,
      remaining,
    };
  },
  components: {
    DialogJournalForm: () => import('./DialogJournalForm.vue'),
    DialogJournalTable: () => import('./DialogJournalTable.vue'),
  },
});
</script>
