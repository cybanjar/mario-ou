<template>
  <DialogJournalAdd
    v-bind="$attrs"
    v-on="$listeners"
    :disable-inputs="inFixeds"
    :acc-num="inFillAdd"
    :transactions="transactions"
    @onOKClick="saveRecord"
    @chgRecord="onChange"
    @delRecord="removeOnTable"
    @setRecord="addToTable"
    @clearRecord="clearTable"
  >
  </DialogJournalAdd>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { date } from 'quasar';
import {
  Journal,
  JournalTrans,
  Trans,
  TransTable,
} from '../../models/journal.model';
import { reformSaveParam } from '../utils/reformParam';
export default defineComponent({
  inheritAttrs: true,
  setup(_, { root: { $api, $q } }) {
    const transactions = ref<TransTable[]>([]);
    const inFillAdd = ref(false);
    const fixedField = ['date', 'referenceNo', 'description'];
    const allDynamic = ['accNo', 'btn', 'remark', 'accName', 'debit', 'credit'];

    const inFixeds = ref(allDynamic);

    async function uniqRefNo(params: JournalTrans) {
      const dupRefNo = await $api.common.glJourtransPostJournal({
        refno: params.referenceNo,
      });
      const refDate = date.formatDate(dupRefNo.datum, 'DD/MM/YY');

      if (dupRefNo.flCode === 1) {
        $q.notify({
          type: 'negative',
          message: `Same reference number exists, date = ${refDate}`,
        });
        return false;
      }
      return true;
    }

    function addToTable(params: JournalTrans, exist: boolean, cleanField) {
      inFixeds.value = fixedField;
      inFillAdd.value = true;
      if (exist) {
        transactions.value = transactions.value.map((val) => {
          if (val.key === params.key) {
            return { ...params };
          }
          return val;
        });
      } else {
        transactions.value = [...transactions.value, params];
      }
      cleanField(...allDynamic);
    }

    async function onChange(index, params: JournalTrans) {
      if (inFillAdd.value === false) {
        const uniqRef = await uniqRefNo(params);
        if (
          params.date &&
          params.referenceNo !== '' &&
          params.description !== '' &&
          index < 3 &&
          uniqRef
        ) {
          inFixeds.value = fixedField;
          inFillAdd.value = true;
        } else {
          $q.notify({
            type: 'negative',
            message: 'Fill date, referenceNo, and description',
          });
        }
      }
    }

    async function saveRecord(journal: Journal, trans: Trans[]) {
      if (trans.length > 0) {
        const paramSave = reformSaveParam(journal, trans);
        // make server save data
        const saveResult = await $api.common.glJourtransPostJournalBtnGo(
          paramSave
        );

        if (saveResult.errorFlag !== 'false') {
          $q.notify({
            type: 'negative',
            message: saveResult.msgStr,
          });

          return;
        }
        $q.notify({
          type: 'positive',
          message: 'Succesfully add new journal',
        });
        return;
      }
    }

    function removeOnTable(params: JournalTrans, cleanField) {
      transactions.value = transactions.value.filter(
        (t) => t.key !== params.key
      );

      // reset form because auto emit edit
      if (transactions.value.length > 0) {
        inFixeds.value = fixedField;
        inFillAdd.value = true;
        cleanField(...allDynamic);
      } else {
        clearTable(cleanField);
      }
    }

    function clearTable(cleanField) {
      transactions.value = [];
      inFixeds.value = allDynamic;
      inFillAdd.value = false;
      cleanField(...allDynamic, ...fixedField);
    }

    return {
      clearTable,
      saveRecord,
      uniqRefNo,
      onChange,
      transactions,
      inFixeds,
      inFillAdd,
      allDynamic,
      fixedField,
      addToTable,
      removeOnTable,
    };
  },
  components: {
    DialogJournalAdd: () => import('../../components/DialogJournalAdd.vue'),
  },
});
</script>
