<template>
  <q-dialog v-model="getDialogPrintCallCharge">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Print Call Charge
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <STable
              :loading="isFetching"
              :columns="ResTableHeaders"
              :data="accounts"
              row-key="indexFoc"
              :noPagination="true"
            >
            </STable>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancel"
          @click="onClickCancel"
        />
        <q-btn color="primary" label="OK" @click="onClickOk" />
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
import { store } from '~/store';
import { ResTableHeaders } from '../../../tables/GuestFolio/dialogPrintCallCharge.table';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      accounts: [],
    });

    const getDialogPrintCallCharge = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_PRINT_CALL_CHARGE;
    });

    const onClickOk = () => {
      store.commit.focGuestFolio.SET_DIALOG_PRINT_CALL_CHARGE(false);
    };

    const onClickCancel = () => {
      store.commit.focGuestFolio.SET_DIALOG_PRINT_CALL_CHARGE(false);
    };

    return {
      ResTableHeaders,
      getDialogPrintCallCharge,
      onClickOk,
      onClickCancel,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-card {
  max-width: 500px;
}

.q-toolbar {
  background: $primary-grad;
}
</style>
