<template>
  <q-dialog v-model="dialogReportPaymentJournalByUserClosedShift" persistent>
    <q-card style="min-width: 300px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Close Shift
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <p class="q-mb-xs">Select your shift to be closed</p>
        <SSelect
          outlined
          class="q-mb-md"
          :options="shifts"
          v-model="inputParams.shift"
          :dense="true"
        />
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
  },

  setup(props, { emit }) {
    const state = reactive({
      shifts: [
        { label: 'Morning Shift', value: 1 },
        { label: 'Afternoon Shift', value: 2 },
        { label: 'Night Shift', value: 3 },
      ],
      inputParams: {
        shift: null,
      },
    });

    const onSubmit = async () => {
      const dialogBody = {
        dialog: false,
        shift: state.inputParams.shift,
      };
      emit('onDialogReportPaymentJournalByUserClosedShift', dialogBody);
      state.inputParams.shift = null;
    };

    const onClose = () => {
      const dialogBody = {
        dialog: false,
      };
      emit('onDialogReportPaymentJournalByUserClosedShift', dialogBody);
      state.inputParams.shift = null;
    };

    const dialogReportPaymentJournalByUserClosedShift = computed({
      get: () => props.dialog,
      set: (dialog) => {
        emit('onDialogReportPaymentJournalByUserClosedShift', dialog);
      },
    });

    return {
      dialogReportPaymentJournalByUserClosedShift,
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
