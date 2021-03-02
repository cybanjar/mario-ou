<template>
  <q-tab-panels
    v-model="tab"
    animated
    swipeable
    vertical
    transition-prev="jump-up"
    transition-next="jump-up"
  >
    <q-tab-panel name="mails">
      <SSelect
        v-for="x in use_input1.filter((x) => ['Departement'].includes(x.name))"
        :key="x"
        :style="{ marginRight: x.right, marginTop: x.top, width: x.width }"
        :label-text="x.name"
        v-model="x.value"
        :options="x.options"
      />
      <SDateInput 
        v-for="x in use_input1.filter((x) => ['Date'].includes(x.name))"
        :key="x"
        :style="{ marginRight: x.right, marginTop: x.top, width: x.width }"
        v-model="x.value"
        :label-text="x.name"
        />
    </q-tab-panel>
    <q-tab-panel name="alarms">
      <div style="margintop: -20px" class="row">
        <div class="col">
          <SSelect
            v-for="x in use_input1.filter((x) =>
              ['Stock Articel Name'].includes(x.name)
            )"
            :key="x"
            :style="{ marginRight: x.right, marginTop: x.top, width: x.width }"
            :label-text="x.name"
            v-model="x.value"
            :options="x.options"
            @input="X(x.value)"
          />
          <SInput
            v-for="x in use_input1.filter(
              (x) =>
                !['Stock Articel Name', 'Departement', 'Date'].includes(x.name)
            )"
            :key="x"
            :style="{ marginRight: x.right, marginTop: x.top, width: x.width }"
            :label-text="x.name"
            v-model="x.value"
            :disable="x.disable"
            @keyup="K(x.keyup)"
            @blur="K(x.keyup)"
          />
          <q-btn
            style="width: 200px; margintop: -5px; height: 25px"
            size="sm"
            max-height="10"
            color="primary"
            label="Add"
            @click="clickAdd"
            unelevated
          />
        </div>
        <div class="col" style="marginleft: -100px">
          <STable
            :columns="tableDialog"
            :data="dialog.data"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
            :hide-bottom="dialog.hide_butoom"
            class="table-accounting-date"
            flat
            bordered
          >
          </STable>
        </div>
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  watch,
} from '@vue/composition-api';
import { DatePicker } from 'v-calendar';
import {
  use_input1,
  tableDialogNew,
  use_input,
} from '../../tables/storeRequisition';
import { Notify } from 'quasar';
import { store_req, SET_DATA } from '../../utils/store';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
export default defineComponent({
  props: {
    tab: {} as any,
    dialog: {} as any,
  },
  setup(_, { emit }) {
    let price, hasil;
    let jumlah = 0;
    const state = reactive({
      use_input1: use_input1,
      tableDialog: [],
      hide_bottom: false,
      date: new Date()
    });

    const notyfyCreate = (mess, col) =>
      Notify.create({
        message: mess,
        color: col,
      });

    onMounted(() => {
      const get_table = store_req.prepare.GET_TABLE as any;
      if (get_table.showPrice == 'true') {
        state.tableDialog = tableDialogNew;
      } else {
        state.tableDialog = tableDialogNew.filter(
          (col: any) => !['amount', 'unitPrice'].includes(col.field)
        );
      }
    });

    const X = (val) => {
      const prepare = store_req.prepare.GET_PREPARE as any;
      price = prepare.tempLArtikel['temp-l-artikel'].filter((items) =>
        items.artnr.toString().includes(val.value)
      );
      use_input1[6].value = formatterMoney(price[0]['vk-preis']);
      const data = {
        art: val.value,
        name: val.label.substring(0, val.label.indexOf('-')),
        onhand: val.label.substring(val.label.indexOf('-') + 2),
      };
      const filter = ['art', 'name', 'onhand'];
      for (const xi in filter) {
        use_input1[Number(xi) + 2].value = data[filter[xi]];
      }
      SET_DATA(Object.assign(price, data));
    };

    const K = (val) => {
      if (val == '1') {
        if (Number(use_input1[5].value) >= Number(use_input1[4].value)) {
          notyfyCreate('Wrong Quantity', 'red');
          use_input1[7].value = '';
        } else if (Number(use_input1[5].value) == 0) {
          notyfyCreate('Wrong Quantity', 'red');
          use_input1[7].value = '';
        } else {
          hasil = price[0]['vk-preis'] * Number(use_input1[5].value);
          use_input1[7].value = formatterMoney(hasil);
        }
      }
    };
    const clickAdd = () => {
      if (use_input1[7].value !== '') {
        emit('clickAdd', '2');
        jumlah = hasil + jumlah;
        use_input[4].value = formatterMoney(jumlah);
      } else {
        notyfyCreate('Wrong Quantity', 'red');
      }
    };
    return {
      ...toRefs(state),
      clickAdd,
      X,
      K,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    'v-date-picker': DatePicker,
  },
});
</script>

<style lang="scss" scoped>
::v-deep .table-accounting-date {
  max-height: 50vh;

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
