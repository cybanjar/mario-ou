<template>
  <DialogJournalAdd
    ref="journalAddEl"
    v-bind="$attrs"
    v-on="restListener"
    :title="title"
    :label="label"
    :disable-inputs="inFixeds"
    :init-form="form"
    :transactions="transactions"
    :acc-num="inFillAdd || !inAdd"
    :show-save-notif="inFillAdd || !inAdd"
    @show="refetch"
    @chgRecord="onChange"
    @setRecord="updateTable"
    @onOKClick="collectRecord"
    @delRecord="removeOnTable"
    @editRecord="doEdit"
    @clearRecord="clearAll"
  >
    <div class="q-mb-md">
      <q-btn v-if="!inAdd" flat round @click="setInAdd(true)" class="q-mr-lg">
        <img :src="require('~/app/icons/Icon-Add.svg')" height="30" />
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 5]">
          Add
        </q-tooltip>
      </q-btn>
      <q-btn
        v-else
        flat
        round
        @click="setInAdd(false)"
        class="q-mr-lg bg-blue inline text-white bold"
      >
        X
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 5]">
          Delete
        </q-tooltip>
      </q-btn>
    </div>
  </DialogJournalAdd>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { usePrepare } from '../compositions/use-prepare.composition';
import { reformChgGLJournal } from '../helpers/reformData.helper';
import { TransTable, JournalTrans, Journal } from '../models/journal.model';
import { initForm } from './DialogJournal.vue';

export default defineComponent({
  inheritAttrs: true,
  props: {
    jnr: { type: Number, required: true },
    title: { type: String, required: false, default: 'Edit' },
  },
  setup(props, { root: { $api, $q }, listeners }) {
    const form = ref<JournalTrans>();
    const delTrans = ref<any[]>([]);
    const transactions = ref<TransTable[]>([]);
    const transAdd = ref<TransTable[]>([]);
    const inAdd = ref(false);
    const journalAddEl = ref();
    const inFillAdd = ref(false);
    const label = computed(() => (inAdd.value ? 'Add' : 'Edit'));

    const { onOKClick, setRecord, delRecord, ...restListener } = listeners;

    const { refetch } = usePrepare(
      true,
      () => $api.common.prepareChgGLJournal(props.jnr),
      (content) => {
        const { trans, form: preForm } = reformChgGLJournal(content, [
          '0',
          '0',
          '.',
          '0',
          '0',
          '.',
          '0',
          '0',
          '0',
          '0',
        ]);
        form.value = { ...initForm, ...preForm };
        transactions.value = trans;
        journalAddEl?.value.chgTouchEdit(true);
      },
      undefined,
      []
    );

    const allFixed = [
      'date',
      'referenceNo',
      'description',
      'accNo',
      'remark',
      'accName',
      'debit',
      'credit',
    ];

    const inFixeds = ref(allFixed);

    function onChange(params: JournalTrans) {
      if (inAdd.value === true) {
        if (
          params.date &&
          params.referenceNo !== '' &&
          params.description !== ''
        ) {
          inFixeds.value = ['date', 'referenceNo'];
          inFillAdd.value = true;
        } else {
          $q.notify({
            type: 'negative',
            message: 'Fill date, referenceNo, and description',
          });
        }
      }
    }

    function removeOnTable(params: JournalTrans) {
      transactions.value = transactions.value.filter(
        (t) => t.key !== params.key
      );

      if (params.recid) {
        delTrans.value = [...delTrans.value, params];
      }

      setDisable(true);
      journalAddEl?.value.$children[0].resetForm();
    }

    function updateTable(params: JournalTrans, recordExist) {
      if (recordExist) {
        transactions.value = transactions.value.map((val) => {
          if (val.key === params.key) {
            return { ...params };
          }
          return val;
        });
      } else {
        transactions.value = [...transactions.value, params];
      }
      setInAdd(false);
      setRecord && setRecord(params, recordExist);
    }

    function setDisable(disable: boolean) {
      inFixeds.value = disable ? allFixed : ['date'];
      journalAddEl?.value.chgTouchEdit(disable);
    }

    const setInAdd = (add: boolean) => {
      inAdd.value = add;
      setDisable(!add); // enable
      journalAddEl?.value.chgTouchEdit(!add);
      journalAddEl?.value.$children[0].resetForm();
    };

    function doEdit() {
      inAdd.value = false;
      setDisable(false);
      journalAddEl?.value.chgTouchEdit(true);
    }

    function clearAll(resetField) {
      setDisable(true);
      resetField(allFixed);
    }

    async function collectRecord(journal: Journal, tranList: JournalTrans[]) {
      delTrans.value.forEach((trans) => delRecord && delRecord(trans));
      onOKClick && onOKClick(journal, tranList);
    }

    return {
      form,
      journalAddEl,
      inAdd,
      removeOnTable,
      inFillAdd,
      doEdit,
      clearAll,
      setInAdd,
      refetch,
      transactions,
      collectRecord,
      label,
      onChange,
      updateTable,
      transAdd,
      restListener,
      inFixeds,
      setDisable,
    };
  },
  components: {
    DialogJournalAdd: () => import('./DialogJournalAdd.vue'),
  },
});
</script>
