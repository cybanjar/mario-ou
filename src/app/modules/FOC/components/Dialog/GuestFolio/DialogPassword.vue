<template>
  <q-dialog v-model="getDialogPassword">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Remark
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <SInput v-model="password" label-text="Enter Your Password" />
            <p v-if="isError">Password Incorrect.</p>
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
  watch,
} from '@vue/composition-api';
import { store } from '~/store';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      password: '',
      isError: false,
    });

    const getDialogPassword: any = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_PASSWORD;
    });

    const getGetHtParam0: any = computed(() => {
      const res: any = store.getters.focGuestFolio.GET_GET_HT_Param_0;
      return res;
    });

    const onClickOk = async () => {
      console.log('ok', getGetHtParam0);
      if (getGetHtParam0.value.fchar === state.password) {
        state.isError = false;
        store.commit.focGuestFolio.SET_DIALOG_PASSWORD(false);
      } else {
        state.isError = true;
      }
    };

    const onClickCancel = () => {
      store.commit.focGuestFolio.SET_DIALOG_PASSWORD(false);
    };

    return {
      getDialogPassword,
      getGetHtParam0,
      onClickOk,
      onClickCancel,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-card {
  width: 100%;
  max-width: 350px;
}

.q-toolbar {
  background: $primary-grad;
}
</style>
