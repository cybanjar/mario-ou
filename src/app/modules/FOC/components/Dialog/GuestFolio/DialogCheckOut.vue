<template>
  <q-dialog v-model="getDialogCheckOut">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Check Out
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <SInput
              label-text="Enter Early Checkout Reason"
              v-model="reasonStr"
            />
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

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      reasonStr: '',
    });

    const getDialogCheckOut = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_CHECKOUT;
    });

    const onClickOk = () => {
      store.commit.focGuestFolio.SET_DIALOG_CHECKOUT(false);
    };

    const onClickCancel = () => {
      store.commit.focGuestFolio.SET_DIALOG_CHECKOUT(false);
    };

    return {
      getDialogCheckOut,
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
