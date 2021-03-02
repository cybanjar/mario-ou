<template>
  <q-dialog v-model="getDialogMasterBill">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Master Bill - Reservation Number {{ getReadMasterBill.resnr }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row main-layout">
          <div class="master-bill">
            <p>Master Bill</p>
          </div>
          <div class="col-12">
            <div>
              <p class="q-mb-none">Master Bill Active</p>
              <q-toggle v-model="masterBillActive" class="active-switch" />
            </div>
          </div>
          <div class="col-6">
            <div class="f-middle-between">
              <div class="full-width">
                <SInput
                  label-text="Invoice Number"
                  v-model="invoiceNumber"
                  input-class="text-right"
                  readonly
                />
              </div>
              <p class="text-open">Open</p>
            </div>

            <div class="f-middle-between">
              <div class="full-width">
                <SInput
                  label-text="Bill Receiver"
                  :value="`${getReadGuest.name} ${getReadGuest.vorname1} ${getReadGuest.anrede1} ${getReadGuest.anredefirma}`"
                  readonly
                />
              </div>
              <q-img
                class="img-exchange"
                :src="require('~/app/icons/FOC/shapes/exchange.svg')"
              />
            </div>
          </div>
          <div class="col-1" />
          <div class="col-5">
            <div class="f-middle">
              <p class="q-mb-none">Article List</p>
              <p class="text-select q-mb-none q-ml-md">Select</p>
            </div>
            <div class="checkbox-layout">
              <q-checkbox v-model="checkboxRoomChange" label="Room Change" />
              <q-checkbox
                v-model="checkboxFoodAndBeverage"
                label="Food & Beverage"
              />
              <q-checkbox v-model="checkboxOther" label="Other" />
            </div>
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

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      masterBillActive: false,
      invoiceNumber: 0,
      billReceiver: '',
      checkboxRoomChange: false,
      checkboxFoodAndBeverage: false,
      checkboxOther: false,
    });

    const getDialogMasterBill = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_MASTER_BILL;
    });

    const getReadMasterBill = computed(() => {
      const res: any = store.getters.focGuestFolio.GET_READ_MASTER_BILL;
      if (res.tMaster) {
        state.invoiceNumber = res.tMaster['t-master'][0].rechnr;
        state.masterBillActive = res.tMaster['t-master'][0].active;
        state.checkboxRoomChange = res.tMaster['t-master'][0].umsatzart[0];
        state.checkboxFoodAndBeverage = res.tMaster['t-master'][0].umsatzart[2];
        state.checkboxOther = res.tMaster['t-master'][0].umsatzart[3];
        return res.tMaster['t-master'][0];
      } else {
        return (res.resnr = '');
      }
    });

    const getReadGuest = computed(() => {
      let res: any = store.getters.focGuestFolio.GET_READ_GUEST;
      if (res[0]) {
        return res[0];
      } else {
        res = {
          name: '',
          vorname1: '',
          anrede1: '',
          anredefirma: '',
        };
        return res;
      }
    });

    const onClickOk = () => {
      store.commit.focGuestFolio.SET_DIALOG_MASTER_BILL(false);
    };

    return {
      getDialogMasterBill,
      getReadMasterBill,
      getReadGuest,
      onClickOk,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-card {
  max-width: 1000px;
  width: 584px;
}

.main-layout {
  border: 1px solid #8b8585;
  margin: 1rem;
  padding: 1rem;
  border-radius: 10px;
  position: relative;
}

.master-bill {
  position: absolute;
  top: -10px;
  right: 24px;
  background: #ffffff;
  padding-left: 12px;
  padding-right: 12px;
}

.q-toolbar {
  background: $primary-grad;
}

.active-switch {
  margin-left: -12px;
}

.f-middle {
  display: flex;
  align-items: center;

  .text-select {
    color: #1890ff;
    text-decoration: underline;
    font-style: italic;
    cursor: pointer;
    font-weight: bold;
  }
}

.f-middle-between {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .text-open {
    width: fit-content;
    margin-left: 1rem;
    margin-bottom: -5px;
    color: #1890ff;
    text-decoration: underline;
    font-style: italic;
    cursor: pointer;
    font-weight: bold;
  }

  .img-exchange {
    width: 16px;
    height: 16px;
    margin-left: 1rem;
    margin-right: 1.2rem;
    margin-bottom: -5px;
    cursor: pointer;
  }
}

.checkbox-layout {
  display: flex;
  flex-direction: column;
  margin-left: -10px;
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
