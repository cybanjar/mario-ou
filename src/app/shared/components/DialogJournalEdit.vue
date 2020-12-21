<template>
  <DialogJournalAdd
    v-bind="$attrs"
    v-on="restListener"
    :title="title"
    :label="title"
    :disabled="inDisable"
    :init-form="form"
    :transactions="transactions"
    @show="refetch"
    @setRecord="reloadTable"
    @onOKClick="isBalance"
    @onCancelClick="isBalance"
    @editRecord="setDisable(false)"
    @clearForm="setDisable(true)"
  >
    <div class="q-mb-md">
      <q-btn flat round @click="addDialog.show" class="q-mr-lg">
        <img :src="require('~/app/icons/Icon-Add.svg')" height="30" />
      </q-btn>
    </div>
    <DialogJournalAdd
      v-bind="$attrs"
      v-on="restListener"
      title="Add"
      :value="addDialog.status"
      label="Add"
      :disabled="false"
      :init-form="form"
      :transactions="transAdd"
      @setRecord="reloadTable"
      @onOkClick="isBalance"
      @onCancelClick="isBalance"
      @hide="addDialog.hide"
    />
  </DialogJournalAdd>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { usePrepare } from '../compositions/use-prepare.composition';
import { reformChgGLJournal } from '../helpers/reformData.helper';
import { useDialog } from '../compositions/use-dialog.composition';
import { TransTable, JournalTrans } from '../models/journal.model';

export default defineComponent({
  inheritAttrs: true,
  props: {
    jnr: { type: Number, required: true },
    fixedInputs: { type: Array, required: false, default: () => ['date'] },
    label: { type: String, required: false, default: 'Edit' },
    title: { type: String, required: false, default: 'Edit' },
  },
  setup(props, { root: { $api, $children, $q }, listeners }) {
    const el = $children[0] as any; // this
    const form = ref<JournalTrans>();
    const transactions = ref<TransTable[]>([]);
    const transAdd = ref<TransTable[]>([]);
    const addDialog = useDialog();
    const inDisable = ref(true);

    const { onOKClick, onCancelClick, setRecord, ...restListener } = listeners;

    const { refetch } = usePrepare(
      true,
      () => $api.common.prepareChgGLJournal(props.jnr),
      (content) => {
        const { trans, form: initForm } = reformChgGLJournal(content, []);

        // parent el
        form.value = { ...initForm, ...el.form };
        transactions.value = trans;
      },
      undefined,
      []
    );

    function isBalance(params: JournalTrans[]) {
      const credits = params.reduce((p, j) => p + j.credit, 0);
      const debits = params.reduce((p, j) => p + j.debit, 0);
      if (credits !== debits) {
        console.log(credits, debits);
        $q.notify({
          type: 'negative',
          message: 'Journal transaction not yet balance',
        });
        return false;
      } else {
        onOKClick(params);
        addDialog.hide();
      }
    }

    function reloadTable(params: JournalTrans) {
      setRecord(params);
      refetch();
    }

    function setDisable(params: boolean) {
      inDisable.value = params;
    }

    return {
      form,
      addDialog,
      refetch,
      transactions,
      isBalance,
      reloadTable,
      transAdd,
      restListener,
      inDisable,
      setDisable,
    };
  },
  components: {
    DialogJournalAdd: () => import('./DialogJournalAdd.vue'),
  },
});
</script>
