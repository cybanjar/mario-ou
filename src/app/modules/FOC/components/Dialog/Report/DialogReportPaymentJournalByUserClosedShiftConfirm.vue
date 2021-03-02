<template>
  <q-dialog
    v-model="dialogReportPaymentJournalByUserClosedShiftConfirm"
    persistent
  >
    <q-card style="min-width: 300px;">
      <!-- <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Close Shift Confirm
        </q-toolbar-title>
      </q-toolbar> -->

      <q-card-section>
        <p>Question</p>
        <p class="q-mb-xs">Confirm the shift to be closed?</p>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancle"
          @click="onClose"
        />
        <q-btn color="primary" label="OK" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    fromDate: { type: String },
    shift: { type: Number },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive({});

    const onSubmit = async () => {
      const resBody = {
        userInit: '52',
        fromDate: props.fromDate,
        shift: props.shift,
      };
      const res = await $api.frontOfficeCashier.paymentJournalCloseShift(
        resBody
      );

      if (res.outputOkFlag === 'true') {
        const dialogBody = {
          dialog: false,
        };
        emit(
          'onDialogReportPaymentJournalByUserClosedShiftConfirm',
          dialogBody
        );
      }
    };

    const onClose = () => {
      const dialogBody = {
        dialog: false,
      };
      emit('onDialogReportPaymentJournalByUserClosedShiftConfirm', dialogBody);
    };

    const dialogReportPaymentJournalByUserClosedShiftConfirm = computed({
      get: () => props.dialog,
      set: (dialog) => {
        emit('onDialogReportPaymentJournalByUserClosedShiftConfirm', dialog);
      },
    });

    return {
      dialogReportPaymentJournalByUserClosedShiftConfirm,
      onSubmit,
      onClose,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
.q-toolbar {
  background: $primary-grad;
}
</style>
