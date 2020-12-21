<template>
  <q-dialog v-model="dialogSelectBill" persistent>
    <q-card style="max-width: 1000px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Inhouse
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-3 q-pr-md">
            <div>
              <SInput
                label-text="Room Number"
                placeholder="Search..."
                v-model="roomNumber"
                mask="####"
                unmasked-value
              />
              <q-btn
                block
                color="primary"
                max-height="28"
                icon="mdi-magnify"
                label="Search"
                type="submit"
                class="q-mb-md full-width"
                @click="onSearch"
              />
              <SRemarkLeftDrawer
                label="Guest Name"
                :value="selectedBill.name ? selectedBill.name : 'None'"
              />
              <SRemarkLeftDrawer
                label="Remark"
                :value="
                  selectedBill['b-comments']
                    ? selectedBill['b-comments']
                    : 'None'
                "
              />
            </div>
          </div>
          <div class="col-9">
            <STable
              :loading="table.isFetching"
              :columns="tableHeaders"
              :data="getParentBills"
              :rows-per-page-options="[10, 13, 16]"
              :pagination.sync="table.pagination"
              :selected.sync="selected"
              row-key="indexFoc"
              :class="getParentBills.length > 0 && 'selected-row-foc'"
              @row-click="onRowClick"
            >
              <template #header-cell-zinr="props">
                <q-th :props="props" class="fixed-col left">
                  {{ props.col.label }}
                </q-th>
              </template>

              <template #body-cell-zinr="props">
                <q-td :props="props" class="fixed-col left">
                  {{ props.row.zinr }}
                </q-td>
              </template>
            </STable>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancle"
          @click="onCancles"
        />
        <q-btn
          color="primary"
          label="OK"
          @click="onOk"
          :disable="!isBillSelected"
        />
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
  ref,
} from '@vue/composition-api';
import { tableHeaders } from '../../tables/dialogSelectBill.table';
import { ResSelectBillList } from '../../models/select-bill-list.model';
import { store } from '~/store';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    doubleCurrency: { type: Boolean },
    foreignRate: { type: Boolean },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      table: {
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
      selectedBill: {},
      roomNumber: '',
      isBillSelected: false,
    });

    onMounted(async () => {
      const getParentBills = await $api.frontOfficeCashier.selectBill();
      store.commit.foc.SET_PARENT_BILLS(getParentBills);
      state.table.isFetching = false;
    });

    const getParentBills = computed({
      get: () => store.getters.foc.GET_PARENT_BILLS,
      set: (items) => {
        console.log('getParentBills', items);
      },
    });

    const onSearch = async () => {
      state.table.isFetching = true;
      const resBody = {
        sorttype: '1',
        zinr: state.roomNumber.length > 0 ? state.roomNumber : ' ',
        bilInt: '0',
      };
      const getParentBills = await $api.frontOfficeCashier.selectBill(resBody);
      store.commit.foc.SET_PARENT_BILLS(getParentBills);
      state.table.isFetching = false;
    };

    const selected = ref<ResSelectBillList[]>([]);
    const onRowClick = (_, row: ResSelectBillList) => {
      selected.value = [row];
      state.selectedBill = [row][0];
      state.isBillSelected = true;
    };

    const onOk = async () => {
      const bill: any = state.selectedBill;
      const parentBillInvoiceBody = {
        bilFlag: 0,
        bilRecid: bill['rec-id'],
        room: bill.zinr,
        vipflag: false,
        fillCo: true,
        doubleCurrency: props.doubleCurrency,
        foreignRate: props.foreignRate,
      };

      const parentBillInvoice = await $api.frontOfficeCashier.billListFOInvoice(
        parentBillInvoiceBody
      );
      store.commit.foc.SET_SELECTED_PARENT_BILLS(bill);
      store.commit.foc.SET_PARENT_BILLS_INVOICE(parentBillInvoice);
      const dialogBody = {
        dialog: false,
      };
      emit('onDialogSelectBill', dialogBody);
    };

    const onCancles = () => {
      state.isBillSelected = false;
      const dialogBody = {
        dialog: false,
      };
      emit('onDialogSelectBill', dialogBody);
    };

    const dialogSelectBill = computed({
      get: () => props.dialog,
      set: (dialogBody) => {
        emit('onDialogSelectBill', dialogBody);
      },
    });

    return {
      dialogSelectBill,
      tableHeaders,
      getParentBills,
      onSearch,
      selected,
      onRowClick,
      onOk,
      onCancles,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
.q-toolbar {
  background: $primary-grad;
}
.selected-row-foc {
  tbody tr.selected td {
    background: #2d00e2 !important;
    color: #fff;
  }
}
</style>
