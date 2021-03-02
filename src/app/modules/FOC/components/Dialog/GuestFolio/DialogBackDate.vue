<template>
  <q-dialog v-model="getDialogBackDate">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Back Date
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <SInput label-text="Select Date" v-model="transdate" readonly>
              <template #append>
                <q-icon name="mdi-calendar" />
              </template>

              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="transdate"
                  mask="DD/MM/YYYY"
                  today-btn
                  @input="() => $refs.qDateProxy.hide()"
                />
              </q-popup-proxy>
            </SInput>
          </div>
          <div class="col-12" v-if="msgStr">{{ msgStr }}</div>
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
  onMounted,
} from '@vue/composition-api';
import { store } from '~/store';
import { date } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      currDate: '',
      transdate: '',
      msgStr: '',
    });

    const getDialogBackDate = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_BACK_DATE;
    });

    onMounted(async () => {
      const getHTParam0 = await $api.frontOfficeCashier.getHTParam0();
      const formatDate = (dateInput) =>
        date.formatDate(dateInput, 'DD/MM/YYYY');
      state.currDate = formatDate(getHTParam0.fdate);
      state.transdate = formatDate(getHTParam0.fdate);
    });

    const onClickOk = async () => {
      const foInvoicePostDateBody = {
        billdate: state.transdate,
        currDate: state.currDate,
      };
      const foInvoicePostDate = await $api.frontOfficeCashier.foInvoicePostDate(
        foInvoicePostDateBody
      );
      console.log(foInvoicePostDate);
      if (foInvoicePostDate.msgStr) {
        state.msgStr = foInvoicePostDate.msgStr;
      } else {
        store.commit.focGuestFolio.SET_TRANSDATE(state.transdate);
        store.commit.focGuestFolio.SET_DIALOG_BACK_DATE(false);
      }
    };

    const onClickCancel = () => {
      store.commit.focGuestFolio.SET_DIALOG_BACK_DATE(false);
    };

    return {
      getDialogBackDate,
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
