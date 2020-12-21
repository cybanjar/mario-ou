<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <section id="foInvoiceInfo" class="mt-7">
        <div class="q-pa-md">
          <div>
            <q-btn
              block
              color="primary"
              max-height="28"
              icon="mdi-magnify"
              label="Select Folio"
              type="submit"
              class="q-mb-md full-width"
              @click="onSelectBill()"
            />

            <SInput
              label-text="Room Number"
              v-model="getSelectedParentBills.zinr"
              readonly
            />
            <q-separator style="border-width: 1px;" class="q-my-md" />
            <SInput
              label-text="Guest Name"
              v-model="getSelectedParentBills.name"
              readonly
            />
            <SRemarkLeftDrawer
              label="Bill Receiver"
              :value="
                getSelectedParentBills.resname
                  ? getSelectedParentBills.resname
                  : 'None'
              "
            />
            <SRemarkLeftDrawer
              label="Bill Remark"
              :value="
                getParentBillsInvoice.rescomment
                  ? getParentBillsInvoice.rescomment
                  : 'None'
              "
            />
            <SInput
              label-text="Active Folio Total"
              v-model="getParentBillsInvoice.balance"
              readonly
            />
            <SInput
              label-text="Active Folio Total"
              v-model="getParentBillsInvoice.totBalance"
              readonly
            />
          </div>
        </div>
      </section>
    </q-drawer>
    <TopMenu />
    <div class="q-ma-md">
      <div class="row">
        <div class="col-3 q-pr-md">
          <section id="foInvoiceArticle">
            <q-form>
              <p class="q-mb-xs">Bill Date</p>
              <q-input
                outlined
                v-model="inputParams.billDate"
                mask="date"
                :rules="['date']"
                :dense="true"
                readonly=""
              >
                <template v-slot:append>
                  <q-icon name="mdi-calendar" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="inputParams.billDate"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-btn-toggle
                class="q-mb-md"
                v-model="inputParamsArticle.articleType"
                spread
                no-caps
                toggle-color="primary"
                color="white"
                text-color="black"
                :options="[
                  { label: 'Sales', value: 'Sales' },
                  { label: 'Payment', value: 'Payment' },
                ]"
              />

              <div class="row">
                <div class="col-8">
                  <p class="q-mb-xs">Article Name</p>
                  <SSelect
                    outlined
                    class="q-mb-md"
                    v-model="inputParamsArticle.selectedArticle"
                    :options="getArticles"
                    option-value="artnr"
                    option-label="bezeich"
                    map-options
                    emit-value
                    :dense="true"
                  />
                </div>
                <div class="col-4 q-pl-sm">
                  <SInput
                    label-text="Quantity"
                    mask="##"
                    v-model="inputParamsArticle.qty"
                    unmasked-value
                  />
                </div>
              </div>

              <SInput
                label-text="Voucher Number"
                v-model="inputParamsArticle.voucherNumber"
              />

              <SInput
                label-text="Description"
                v-model="inputParamsArticle.description"
                readonly
              />

              <SInput
                label-text="Unit Price"
                v-model="inputParamsArticle.unitPrice"
              />

              <q-btn
                block
                color="primary"
                max-height="28"
                label="Add"
                class="q-mb-md full-width"
                @click="addArticle"
              />
            </q-form>
          </section>
        </div>
        <div class="col-9">
          <section id="foInvoiceTable">
            <div class="row">
              <div class="col-3 q-pr-sm">
                <SInput
                  label-text="Guest Folio"
                  v-model="inputParams.guestFolio"
                />
              </div>
              <div class="col-3 q-px-sm">
                <SInput
                  label-text="Folio Number"
                  v-model="inputParams.folioNumber"
                />
              </div>
              <div class="col-3 q-px-sm">
                <p class="q-mb-xs">Number Of Bill</p>
                <div class="q-gutter-sm" style="margin-top: 0;">
                  <q-radio
                    v-model="inputParams.numberOfBill"
                    val="1"
                    label="1"
                    class="q-ml-none"
                    style="margin-top: -8px;"
                  />
                  <q-radio
                    v-model="inputParams.numberOfBill"
                    val="2"
                    label="2"
                    style="margin-top: -8px;"
                  />
                  <q-radio
                    v-model="inputParams.numberOfBill"
                    val="3"
                    label="3"
                    style="margin-top: -8px;"
                  />
                </div>
              </div>
              <div class="col-3 q-pl-sm">
                <SInput label-text="Room Rate" v-model="inputParams.roomRate" />
              </div>
            </div>
            <STable
              v-if="getParentBillsInvoice.tBillLine"
              :loading="table.isFetching"
              :columns="tableHeaders"
              :data="getParentBillsInvoice.tBillLine['t-bill-line']"
              :rows-per-page-options="[10, 13, 16]"
              :pagination.sync="table.pagination"
            >
              <template #header-cell-artnr="props">
                <q-th :props="props" class="fixed-col left">
                  {{ props.col.label }}
                </q-th>
              </template>

              <template #body-cell-artnr="props">
                <q-td :props="props" class="fixed-col left">
                  {{ props.row.artnr }}
                </q-td>
              </template>

              <template #header-cell-actions="props">
                <q-th :props="props" class="fixed-col right">
                  {{ props.col.label }}
                </q-th>
              </template>

              <template #body-cell-actions="props">
                <q-td :props="props" class="fixed-col right">
                  <q-icon name="mdi-dots-vertical" size="16px">
                    <q-menu auto-close anchor="bottom right" self="top right">
                      <q-list>
                        <q-item clickable v-ripple>
                          <q-item-section>Split Item</q-item-section>
                        </q-item>
                      </q-list>
                      <q-list>
                        <q-item clickable v-ripple>
                          <q-item-section>Void Item</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-icon>
                </q-td>
              </template>
            </STable>
            <STable
              v-else
              :loading="table.isFetching"
              :columns="tableHeaders"
              :data="[]"
              :rows-per-page-options="[10, 13, 16]"
              :pagination.sync="table.pagination"
            />
          </section>
        </div>
      </div>
    </div>
    <DialogSelectBill
      :dialog="dialogSelectBillStatus"
      :double-currency="inits.doubleCurrency"
      :foreign-rate="inits.foreignRate"
      @onDialogSelectBill="onDialogSelectBill"
    />
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  onMounted,
  computed,
} from '@vue/composition-api';
import { tableHeaders } from './tables/guestFolio.table';
import { store } from '~/store';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      inits: {
        doubleCurrency: false,
        foreignRate: false,
      },
      dialogSelectBillStatus: false,
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
      inputParamsArticle: {
        articleType: 'Sales',
        selectedArticle: null,
        voucherNumber: '',
        description: '',
        unitPrice: '',
        qty: '1',
      },
      inputParams: {
        billDate: '2019/02/01',
        guestFolio: '',
        folioNumber: '',
        numberOfBill: null,
        roomRate: '',
      },
    });

    const loadArticles = async (status) => {
      const getArticles = await $api.frontOfficeCashier.foInvoicePrepare();
      const articlesPayment = getArticles.tArtikel['t-artikel'].filter(
        (e) => e.artart === 7
      );
      store.commit.foc.SET_ARTICLES_PAYMENT(articlesPayment);
      store.commit.foc.SET_PREPARE(getArticles);
      state.inits = getArticles;
      state.inits.doubleCurrency = getArticles.doubleCurrency === 'true';
      state.inits.foreignRate = getArticles.foreignRate === 'true';
      state.inputParamsArticle.selectedArticle = null;

      if (status === 'Sales' || status === 'onMounted') {
        const sales = getArticles.tArtikel['t-artikel'].filter(
          (item) =>
            item.artart === 0 ||
            item.artart === 8 ||
            item.artart === 9 ||
            (item.artgrp !== 0 && item.activeflag)
        );
        store.commit.foc.SET_ARTICLES(sales);
      } else {
        const payment = getArticles.tArtikel['t-artikel'].filter(
          (item) =>
            item.artart === 2 ||
            item.artart === 6 ||
            (item.artart === 7 && item.activeflag)
        );
        store.commit.foc.SET_ARTICLES(payment);
      }
    };

    onMounted(async () => {
      state.table.isFetching = false;
      loadArticles('onMounted');
    });

    watch(
      () => state.inputParamsArticle.articleType,
      (status) => {
        loadArticles(status);
      }
    );

    watch(
      () => state.inputParamsArticle.selectedArticle,
      (id) => {
        const inputParamArticle: any = state.inputParamsArticle;
        const getArticles = store.getters.foc.GET_ARTICLES;
        let article = getArticles.filter((e: any) => e.artnr === id);
        inputParamArticle.description = article[0]['bezeich'];
      }
    );

    const getSelectedParentBills: any = computed({
      get: () => store.getters.foc.GET_SELECTED_PARENT_BILLS,
      set: (items) => {
        console.log('getSelectedParentBills', items);
      },
    });

    const getParentBillsInvoice: any = computed({
      get: () => store.getters.foc.GET_PARENT_BILLS_INVOICE,
      set: (items) => {
        console.log('getParentBillsInvoice', items);
      },
    });

    const onDialogSelectBill = (dialogBody) => {
      state.dialogSelectBillStatus = dialogBody.dialog;
    };

    const onSelectBill = () => {
      const dialogBody = {
        dialog: true,
      };
      onDialogSelectBill(dialogBody);
    };

    const addArticle = () => {
      const parentBillsInvoice: any = getParentBillsInvoice.value;
      if (parentBillsInvoice.tBill) {
        const payload = {
          selectedArticle: state.inputParamsArticle.selectedArticle,
          quantity: state.inputParamsArticle.qty,
          voucherNumber: state.inputParamsArticle.voucherNumber,
          description: state.inputParamsArticle.description,
          unitPrice: state.inputParamsArticle.unitPrice,
        };
        console.log(payload);
      }
    };

    const getArticles = computed({
      get: () => store.getters.foc.GET_ARTICLES,
      set: (items) => {
        loadArticles('depart');
        console.log('getArticles', items);
      },
    });

    return {
      tableHeaders,
      onDialogSelectBill,
      getSelectedParentBills,
      getParentBillsInvoice,
      onSelectBill,
      addArticle,
      getArticles,
      ...toRefs(state),
    };
  },
  components: {
    TopMenu: () => import('./components/TopMenu.vue'),
    DialogSelectBill: () => import('./components/Dialog/DialogSelectBill.vue'),
  },
});
</script>

<style lang="scss" scoped>
.foc-icon {
  width: 30px;
  height: 30px;
  margin-right: 30px;
  cursor: pointer;
  margin: 16px 0 0 10px;
}
</style>
