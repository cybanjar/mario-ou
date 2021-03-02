<template>
  <q-dialog persistent v-model="child_dialog.dialog" position="top">
    <q-card style="width: 820px; max-width: 90vw; margintop: 50px">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium"
          >Inter Store Transfer</q-toolbar-title
        >
      </q-toolbar>
      <q-card-section>
        <div class="row">
          <SInput
            v-for="i in use_input.filter((x) =>
              ['Delivery Number'].includes(x.name)
            )"
            :key="i.name"
            :label-text="i.name"
            v-model="i.value"
            :style="{ marginRight: i.right, width: i.width }"
            :disable="i.disable"
          />
          <SSelect
            v-for="i in use_input.filter((x) =>
              child_dialog.actual.includes(x.name)
            )"
            :key="i.name"
            :label-text="i.name"
            v-model="i.value"
            :style="{ marginRight: i.right, width: i.width }"
            :options="i.options"
            :disable="i.disable"
          />
          <SInput
            v-for="i in use_input.filter((x) =>
              child_dialog.actual1.includes(x.name)
            )"
            :key="i.name"
            :label-text="i.name"
            v-model="i.value"
            :style="{ marginRight: i.right, width: i.width }"
            :disable="i.disable"
            @click="onModalAccount(i.onclick)"
          />
        </div>
        <div>
          <q-splitter v-model="shape">
            <template v-slot:before>
              <q-tabs
                v-model="tab"
                vertical
                active-color="primary"
                indicator-color="primary"
                dense
                no-caps
                inline-label
                class="text-gray shadow-2"
              >
                <q-tab name="mails" label="Header" />
                <q-tab name="alarms" label="Item" />
              </q-tabs>
            </template>
            <template v-slot:after>
              <q-tab-panels
                v-model="tab"
                animated
                swipeable
                vertical
                transition-prev="jump-up"
                transition-next="jump-up"
              >
                <q-tab-panel name="mails">
                  <div class="row">
                    <SSelect
                      v-for="x in use_input1.filter((x) =>
                        ['Departement'].includes(x.name)
                      )"
                      :key="x"
                      :style="{
                        marginRight: x.right,
                        marginTop: x.top,
                        width: x.width,
                      }"
                      :label-text="x.name"
                      v-model="x.value"
                      :options="x.options"
                      :disable="x.disable"
                    />
                    <q-checkbox
                      v-if="child_dialog.keyApprove == 'approve'"
                      label="Approve"
                      v-model="child_dialog.valApprove"
                      @input="approved(valApprove)"
                      style="margintop: -12px"
                    />
                  </div>
                  <SDateInput
                    v-for="x in use_input1.filter((x) =>
                      ['Date'].includes(x.name)
                    )"
                    :key="x"
                    :style="{
                      marginRight: x.right,
                      marginTop: x.top,
                      width: x.width,
                    }"
                    :label-text="x.name"
                    v-model="x.value"
                    :options="x.options"
                    :disable="x.disable"
                  />
                </q-tab-panel>
                <q-tab-panel name="alarms" style="height: 380px">
                  <div style="margintop: -20px" class="row">
                    <div class="col">
                      <SSelect
                        v-for="x in use_input1.filter((x) =>
                          ['Stock Articel Name'].includes(x.name)
                        )"
                        :key="x"
                        :style="{
                          marginRight: x.right,
                          marginTop: x.top,
                          width: x.width,
                        }"
                        :label-text="x.name"
                        v-model="x.value"
                        :options="x.options"
                        :disable="x.disable"
                        @input="X(x.value)"
                      />
                      <SInput
                        v-for="x in use_input1.filter(
                          (x) =>
                            ![
                              'Stock Articel Name',
                              'Departement',
                              'Date',
                            ].includes(x.name)
                        )"
                        :key="x"
                        :style="{
                          marginRight: x.right,
                          marginTop: x.top,
                          width: x.width,
                        }"
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
                        :loading="isFetching"
                        :columns="child_dialog.tableDialog"
                        :data="child_dialog.data"
                        :rows-per-page-options="[0]"
                        :hide-bottom="child_dialog.hide_bottom"
                        class="table-accounting-date2"
                      >
                        <template v-slot:body="props">
                          <q-tr :props="props">
                            <q-td key="storageNumber" :props="props">{{
                              props.row.storageNumber
                            }}</q-td>
                            <q-td key="articelNumber" :props="props">{{
                              props.row.articelNumber
                            }}</q-td>
                            <q-td key="des" :props="props">{{
                              props.row.des
                            }}</q-td>
                            <q-td key="unitPrice" :props="props">{{
                              props.row.unitPrice
                            }}</q-td>
                            <q-td key="onhand" :props="props">{{
                              props.row.onhand
                            }}</q-td>
                            <q-td
                              key="quantity"
                              @click="rowEditQty(props.row)"
                              v-if="props.row.selection == false"
                            >
                              {{ props.row.quantity }}
                            </q-td>
                            <q-input
                              v-else
                              @blur="props.row['selection'] = false"
                              v-model="props.row.quantity"
                              borderless
                              @input="validateQty1(props.row)"
                              @keyup.enter="validateQty(props.row)"
                            />
                            <q-td key="amount" :props="props">{{
                              props.row.amount
                            }}</q-td>
                            <q-td key="date" :props="props">{{
                              props.row.date
                            }}</q-td>
                            <q-td key="type" :props="props">{{
                              props.row.type
                            }}</q-td>
                            <q-td key="sUsername" :props="props">{{
                              props.row.sUsername
                            }}</q-td>
                            <q-td key="datum" :props="props">{{
                              props.row.datum
                            }}</q-td>
                            <q-td key="time" :props="props">{{
                              props.row.time
                            }}</q-td>
                            <q-td key="acctNo" :props="props">{{
                              props.row.acctNo
                            }}</q-td>
                          </q-tr>
                        </template>
                      </STable>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          color="primary"
          outline
          size="sm"
          @click="close"
          label="Cancel"
        />
        <q-btn
          unelevated
          size="sm"
          :loading="loading"
          @click="saveData"
          color="primary"
          label="Save"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  onMounted,
  toRefs,
  watch,
} from '@vue/composition-api';
import { use_inputEDIT, use_inputEDIT1 } from '../../Input/InputStoreReq';
import { store_req, SET_DATA } from '../../utils/store';
import { Notify } from 'quasar';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export default defineComponent({
  props: {
    child_dialog: {} as any,
    dialog: {} as any,
  },
  setup(props, { emit }) {
    let price, hasil;
    let jumlah = 0;
    const state = reactive({
      use_input: use_inputEDIT,
      use_input1: use_inputEDIT1,
      tab: 'mails',
      shape: 15,
      loading: false,
      dataTableStore: [],
      isFetching: false,
      keyQTY: 0,
      dialogSelect: {
        dialog: false,
      },
    });

    const notyfyCreate = (mess) => {
      return Notify.create({
        message: mess,
        color: 'red',
      });
    };
    const saveData = () => {
      emit('saveData', false);
    };
    const onModalAccount = (val) => {
      if (val == '2') {
        state.dialogSelect.dialog = true;
      }
    };
    const close = () => {
      props.child_dialog.dialog = false;
      // Notify.create({
      //   message: props.dialog.data.length !== 0 ?
      //   'The created records are still in temporary buffer Do you really want to leave WITHOUT updating?'
      //   : 'Do you want to interrupt?',
      //     color: 'primary',
      //     position: 'center',
      //     timeout: 0,
      //     actions: [
      //     { label: 'No', color: 'white', handler: () => { /* ... */ }, size: 'sm'},
      //     { label: 'Yes', color: 'white', handler: () => {
      //      props.child_dialog.dialog = false }, size: 'sm'}
      //   ]
      //   });
    };

    const rowEditQty = (val) => {
      const xi = props.child_dialog.data;
      for (const i of xi) {
        i['selection'] = false;
      }
      val['selection'] = true;
    };
    const validateQty = (val) => {
      val['selection'] = false;
    };
    const validateQty1 = (val) => {
      if (isNaN(val['quantity'])) {
        val['quantity'] = '';
      }
    };
    const approved = (val) => {
      emit('approved', val);
    };

    const X = (val) => {
      const prepare = store_req.prepare.GET_PREPARE as any;
      price = prepare.tempLArtikel['temp-l-artikel'].filter((items) =>
        items.artnr.toString().includes(val.value)
      );
      use_inputEDIT1[6].value = formatterMoney(price[0]['vk-preis']);
      const data = {
        art: val.value,
        name: val.label.substring(0, val.label.indexOf('-')),
        onhand: val.label.substring(val.label.indexOf('-') + 2),
      };
      const filter = ['art', 'name', 'onhand'];
      for (const xi in filter) {
        use_inputEDIT1[Number(xi) + 2].value = data[filter[xi]];
      }
      SET_DATA(Object.assign(price, data));
    };

    const K = (val) => {
      if (val == '1') {
        if (
          Number(use_inputEDIT1[5].value) >= Number(use_inputEDIT1[4].value)
        ) {
          notyfyCreate('Wrong Quantity');
          use_inputEDIT1[7].value = '';
        } else if (Number(use_inputEDIT1[5].value) == 0) {
          notyfyCreate('Wrong Quantity');
          use_inputEDIT1[7].value = '';
        } else {
          hasil = price[0]['vk-preis'] * Number(use_inputEDIT1[5].value);
          use_inputEDIT1[7].value = formatterMoney(hasil);
        }
      }
    };
    const clickAdd = () => {
      jumlah = Number(use_inputEDIT[4].value.replace(/,|\./g, ''));
      if (use_inputEDIT1[7].value !== '') {
        emit('addInsert');
        jumlah = hasil + Number(use_inputEDIT[4].value.replace(/,/g, ''));
        use_inputEDIT[4].value = formatterMoney(jumlah);
      } else {
        notyfyCreate('Wrong Quantity');
      }
    };

    return {
      ...toRefs(state),
      saveData,
      onModalAccount,
      close,
      rowEditQty,
      validateQty,
      validateQty1,
      approved,
      clickAdd,
      X,
      K,
    };
  },
  components: {
    InterStoreChild: () => import('./InterStoreChild.vue'),
    SelectCostAllocations: () => import('./SelectCostAllecations.vue'),
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
