<template>
  <q-dialog v-model="getDialogTransferHistory">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Transfer History
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <STable
              :loading="isFetching"
              :columns="ResTableHeaders"
              :data="getFoTransDetailPrepare"
              row-key="indexFoc"
              :noPagination="true"
            >
            </STable>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
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
import { ResTableHeaders } from '../../../tables/GuestFolio/dialogTransferHistory.table';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      accounts: [],
    });

    const getDialogTransferHistory = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_TRANSFER_HISTORY;
    });

    const getFoTransDetailPrepare = computed(() => {
      let res: any = store.getters.focGuestFolio.GET_FO_TRANS_DETAIL_PREPARE;
      if (res.tempBjournal) {
        res = res.tempBjournal['temp-bjournal'];
      } else {
        res = [];
      }
      return res;
    });

    const onClickOk = () => {
      store.commit.focGuestFolio.SET_DIALOG_TRANSFER_HISTORY(false);
    };

    return {
      ResTableHeaders,
      getDialogTransferHistory,
      getFoTransDetailPrepare,
      onClickOk,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-card {
  max-width: 1000px;
}

.q-toolbar {
  background: $primary-grad;
}
</style>
