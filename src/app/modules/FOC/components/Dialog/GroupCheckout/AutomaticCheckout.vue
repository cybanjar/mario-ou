<template>
  <q-dialog v-model="getDialogAutomaticCheckout">
    <q-card class="dialog-new-folio">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Automacit Check-Out for : {{ getAutoCheckoutPrepare.resName || '' }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <div id="tableLayoutId" class="col-9">
              <STable
                :loading="isFetching"
                :columns="ResTableHeaders"
                :data="[]"
                :noPagination="true"
              />
            </div>
          </div>
          <div class="col-6">
            <q-btn
              color="white"
              text-color="black"
              label="Start"
              @click="onClickStart"
            />
          </div>
          <div class="col-6">
            <SRemarkLeftDrawer
              label="Total Check-Out"
              :value="totalCheckout.trim().length > 0 ? totalCheckout : 'None'"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="primary" label="Ok" @click="onClickOk" />
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
import { ResTableHeaders } from '~/app/modules/FOC/tables/automaticCheckout.table';
import { store } from '~/store';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      totalCheckout: '',
      recordResLine: {},
    });

    const getSelectedGroupCheckout: any = computed(() => {
      return store.getters.focIndividualCheckout.GET_SELECTED_GROUP_CHECKOUT;
    });

    const getAutoCheckoutPrepare: any = computed(() => {
      return store.getters.focIndividualCheckout.GET_AUTO_CHECKOUT_PREPARE;
    });

    const getDialogAutomaticCheckout = computed(() => {
      return store.getters.focIndividualCheckout.GET_DIALOG_AUTOMATIC_CHECKOUT;
    });

    const onClickOk = async () => {
      store.commit.focIndividualCheckout.SET_DIALOG_AUTOMATIC_CHECKOUT(false);
    };

    const onClickStart = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const autoCheckout = await $api.frontOfficeCashier.autoCheckout({
        resnr: getSelectedGroupCheckout.value.resnr,
        sorttype: 2,
      });

      store.commit.focIndividualCheckout.SET_AUTO_CHECKOUT(autoCheckout);

      state.recordResLine = autoCheckout.tResLine['t-res-line'];

      const checkoutRes = await $api.frontOfficeCashier.checkoutRes({
        pvILanguage: 1,
        caseType: 1,
        resnr: autoCheckout.tResLine['t-res-line'][0].resnr,
        reslinnr: autoCheckout.tResLine['t-res-line'][0].reslinnr,
        silenzio: true,
        userInit: userAuth.userInit,
      });

      store.commit.focIndividualCheckout.SET_CHECKOUT_RES(checkoutRes);

      const str = checkoutRes.msgStr;
      const msgStr = str.substring(0, 2);

      switch (true) {
        case checkoutRes.coOK === 'true':
          const checkoutResSecond = await $api.frontOfficeCashier.checkoutRes({
            pvILanguage: 1,
            caseType: 2,
            resnr: autoCheckout.tResLine['t-res-line'][0].resnr,
            reslinnr: autoCheckout.tResLine['t-res-line'][0].reslinnr,
            silenzio: true,
            userInit: userAuth.userInit,
          });

          store.commit.focIndividualCheckout.SET_CHECKOUT_RES(checkoutRes);

          const strSecond = checkoutResSecond.msgStr;
          const msgStrSecond = strSecond.substring(0, 2);

          if (msgStrSecond != '&W') {
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'IndividualCheckout',
              title1: 'Information',
              text1: strSecond,
              btnOk: 'Ok',
              status: 'individual-checkout-modal-automatic-checkout',
              coOK: checkoutResSecond.coOK,
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          } else {
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'IndividualCheckout',
              title1: 'Warning',
              text1: strSecond,
              btnOk: 'Ok',
              status: 'individual-checkout-modal-automatic-checkout',
              coOK: checkoutResSecond.coOK,
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          }
          break;

        case msgStr != '&Q':
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'IndividualCheckout',
            title1: 'Information',
            text1: str,
            btnOk: 'Ok',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          break;

        case msgStr == '&Q':
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'IndividualCheckout',
            title1: 'Question',
            text1: str,
            btnOk: 'Yes',
            btnCancel: 'No',
            status: 'individual-checkout-modal-automatic-checkout',
            coOK: checkoutRes.coOK,
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          break;

        default:
          break;
      }

      // store.commit.focIndividualCheckout.SET_DIALOG_AUTOMATIC_CHECKOUT(false);
    };

    return {
      ResTableHeaders,
      getSelectedGroupCheckout,
      getAutoCheckoutPrepare,
      getDialogAutomaticCheckout,
      onClickOk,
      onClickStart,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-new-folio {
  max-width: 600px;
  width: 600px;
}

.q-toolbar {
  background: $primary-grad;
}
</style>
