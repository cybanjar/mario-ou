<template>
  <q-dialog v-model="getDialogMasterFolioMember">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Master Folio Member - {{ getSelectBill.billno }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-3 q-pr-md">
            <div>
              <SInput
                label-text="Total Room"
                v-model="getSelectBill.totRoom"
                readonly
              />
              <SInput
                label-text="Total Audit"
                v-model="getSelectBill.totAdult"
                readonly
              />
            </div>
          </div>
          <div id="tableLayoutId" class="col-9">
            <STable
              :loading="isFetching"
              :columns="ResTableHeaders"
              :data="
                getSelectBill.b1List ? getSelectBill.b1List['b1-list'] : []
              "
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
  onMounted,
  watch,
} from '@vue/composition-api';
import { store } from '~/store';
import { ResTableHeaders } from '../../../tables/masterFolioMember.table';
import { date } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
    });

    const getDialogMasterFolioMember = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_MASTER_FOLIO_MEMBER;
    });

    const getSelectBill = computed(() => {
      const formatDate = (dateInput) =>
        date.formatDate(dateInput, 'DD/MM/YYYY');
      let res: any =
        store.getters.focGuestFolio.GET_BOOK_JOURNAL_ART_M_BILL_MEMBER;
      if (res.b1List) {
        res.b1List['b1-list'].map((e) => {
          e.ankunft = formatDate(e.ankunft);
          e.abreise = formatDate(e.abreise);
          if (e.resstatus === 6) {
            e.resstatus = 'In-house';
          } else if (e.resstatus === 8) {
            e.resstatus = 'Departed';
          } else if (e.resstatus === 12) {
            e.resstatus = 'Extra Folio';
          }
        });

        res = res;
      } else {
        res = [];
      }
      return res;
    });

    const onClickOk = () => {
      store.commit.focGuestFolio.SET_DIALOG_MASTER_FOLIO_MEMBER(false);
    };

    return {
      ResTableHeaders,
      getDialogMasterFolioMember,
      getSelectBill,
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

#tableLayoutId {
  .selected-table {
    tbody tr.selected td {
      background: #1485cb !important;
      color: #fff;
    }
  }
  max-height: 450px !important;
  overflow: scroll;
}
</style>
