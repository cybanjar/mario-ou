<template>
  <div class="layout">
    <p class="q-mb-none">{{ userAuth.htlName }}</p>
    <p>Phone: {{ userAuth.htlTel }}</p>

    <div class="info q-mt-xl">
      <div class="info-left">
        <div>
          <p class="q-mb-none">Reservation</p>
          <p class="q-mb-none">No</p>
          <p class="q-mb-none">Company</p>
          <p class="q-mb-none">Guest Name</p>
        </div>

        <div class="q-ml-md">
          <p class="q-mb-none">: {{ getReceipt.resnr }}</p>
          <p class="q-mb-none">: {{ getReceipt.voucherNo }}</p>
          <p class="q-mb-none">: {{ getReceipt.stringGuest }}</p>
          <p class="q-mb-none">: {{ getReceipt.stringReslinename }}</p>
        </div>
      </div>

      <div class="info-right">
        <div>
          <p class="q-mb-none">Date</p>
          <p class="q-mb-none">User Id</p>
        </div>

        <div class="q-ml-md">
          <p class="q-mb-none">: {{ getCurrentDate }}</p>
          <p class="q-mb-none">: {{ userAuth.userInit }}</p>
        </div>
      </div>
    </div>

    <table class="info-table">
      <tr>
        <th>Currency</th>
        <th>Description</th>
        <th>Amount</th>
      </tr>
      <tr>
        <td>{{ getReceipt.currLocal }}</td>
        <td>
          {{ getReceipt.secondpay != '1' ? getReceipt.ch : getReceipt.ch1 }}
        </td>
        <td class="text-right">{{ getReceipt.balance }}</td>
      </tr>
    </table>

    <div class="sign q-mt-xl">
      <div>
        <p class="text-center q-mb-xl">Hotel</p>
        <div style="display: flex">
          (
          <p class="q-mt-xs">------------------------------</p>
          )
        </div>
      </div>
      <div>
        <p class="text-center q-mb-xl">Guest</p>
        <div style="display: flex">
          (
          <p class="q-mt-xs">------------------------------</p>
          )
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';

import { store } from '~/store';
import { Cookies } from 'quasar';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

export default defineComponent({
  setup(props, { root: { $api, $router } }) {
    const state = reactive({});

    const getReceipt: any = computed(() => {
      let res: any =
        store.getters.focGuestFolio.GET_DEPOSIT_ADMIN_PRINT_RECEIPT1;
      res.balance = formatThousands(res.balance);
      if (res.secondpay != '1') {
        res.ch = res.ch.substring(9, 25);
      }

      return res;
    });

    const userAuth: any = computed(() => {
      return Cookies.get('userAuth');
    });

    const getCurrentDate: any = computed(() => {
      let currentdate = new Date();
      const datetime = `${currentdate.getDate()}/${
        currentdate.getMonth() + 1
      }/${currentdate.getFullYear()} ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;

      return datetime;
    });

    return {
      getReceipt,
      userAuth,
      getCurrentDate,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.layout {
  width: 600px;
  border: 1px solid gray;
  padding: 3rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .info {
    display: flex;
    justify-content: space-between;

    .info-left {
      display: flex;
    }

    .info-right {
      display: flex;
    }
  }

  table {
    border: 1px solid gray;
    border-collapse: collapse;
    margin-top: 1rem;
    width: 100%;

    th,
    td {
      border: 1px solid gray;
    }
  }

  .sign {
    display: flex;
    justify-content: space-between;
  }
}
</style>
