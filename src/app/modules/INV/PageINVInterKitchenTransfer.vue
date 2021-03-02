<template>
  <div>
    <div class="column justify-between">
      <div class="col-7" style="height: 570px">
        <q-drawer :value="true" side="left" bordered :width="220" persistent>
          <SearchInterKitchenTf :searches="searches" @add="add" />
        </q-drawer>
        <div class="q-pa-lg">
          <div class="q-mb-md">
            <q-btn flat round class="q-mr-lg">
              <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
            </q-btn>
            <q-btn flat round @click="doPrint">
              <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
            </q-btn>
          </div>
          <STable
            :loading="isFetching"
            :columns="tableHeaders"
            :data="data"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
            :hide-bottom="hide_bottom"
            class="table-accounting-date"
            flat
            bordered
          />
        </div>
      </div>
      <div class="col-1">
        <q-card-actions align="right">
          <q-btn
            size="sm"
            color="primary"
            label="save"
            style="
              width: 100px;
              height: 25px;
              marginright: 20px;
              margintop: -4px;
            "
            @click="saveReturn"
            unelevated
          />
        </q-card-actions>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  ref,
} from '@vue/composition-api';
import { tableHeaders, use_input } from './tables/InterKitchenTransfer';
import { dataToDepartement } from './utils/params.interkitchen';
import { users } from './utils/store';
import { Notify } from 'quasar';
import { PrintJs } from '~/app/helpers/PrintJs';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      data1: dataToDepartement,
      hide_bottom: false,
      data: [],
      searches: {
        use_input,
        art: '0',
      },
    });

    const NotifyCreate = (message) =>
      Notify.create({
        message: message,
        type: 'negative',
        position: 'top',
        textColor: 'white',
        timeout: 2000,
      });
    const add = (value) => {
      const x = use_input as any;
      const xi = value.searches.use_input;
      const y = ['art', 'des', 'price', 'amount'];
      if (false) {
        NotifyCreate('Sorry, no access right');
      } else if (
        x[1].value == '' ||
        x[2].value == '' ||
        x[3].value == '' ||
        x[4].value == ''
      ) {
        NotifyCreate('input undeined');
      } else {
        let am = 0;
        const totalAmount = x[3].value.price * x[4].value;
        state.data.push(
          Object.assign(xi[3].value, xi[4], {
            price1: formatterMoney(xi[3].value.price),
            amount: formatterMoney(totalAmount),
          })
        );
        for (const i of state.data) {
          am += Number(i.amount);
        }
        state.searches.art = am.toString() + '.000';
        use_input[1].disable = true;
        use_input[2].disable = true;
        if (state.data.length !== 0) {
          state.hide_bottom = true;
        }
        x[3].value = '';
        x[4].value = '';
      }
    };

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Outlet Compliment Journalizing');
      }
    }

    return {
      ...toRefs(state),
      add,
      tableHeaders,
      doPrint,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    SearchInterKitchenTf: () => import('./components/SearchInterKitchenTf.vue'),
  },
});
</script>
<style lang="scss" scoped>
::v-deep .table-accounting-date {
  max-height: 75vh;

  thead tr {
    th {
      position: sticky;
      z-index: 3;
    }

    &:first-child th {
      top: 0;
    }
  }
}
</style>
