<template>
  <q-dialog v-model="getDialogQptgf">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Quick Posting To Guest Folio
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-3 q-px-md">
            <SSelect
              outlined
              label-text="Outlet"
              v-model="selectedOutlet"
              @input="onChangeOutlet"
              :options="getLoadHotelDepartment"
              option-value="num"
              option-label="depart"
              map-options
              emit-value
              :dense="true"
            />
          </div>
          <div class="col-3 q-px-md">
            <SSelect
              outlined
              label-text="Article Number"
              v-model="selectedArticleNumber"
              @input="onChangeArticleNumber"
              :options="articleNumberOptions"
              option-value="artnr"
              option-label="bezeich"
              map-options
              emit-value
              :dense="true"
            />
          </div>
          <div class="col-3 q-px-md">
            <SInput label-text="Room Number" v-model="roomNumber">
              <template v-slot:append>
                <div class="btn-input-search">
                  <q-icon
                    name="mdi-magnify"
                    class="cursor-pointer"
                    color="white"
                    size="16px"
                    @click="onSearchRoomNumber('roomNumber')"
                  />
                </div>
              </template>
            </SInput>
          </div>
          <div class="col-3 q-px-md">
            <SInput
              label-text="Guest Name"
              :value="getSelectedPGuest.name || ''"
              disable
            />
          </div>
          <div class="col-3 q-px-md">
            <SInput label-text="Quantity" v-model="quantity" />
          </div>
          <div class="col-3 q-px-md">
            <SInput
              label-text="Price"
              v-model="price"
              @blur="onChangePrice(price)"
            />
          </div>
          <div class="col-3 q-px-md">
            <SInput label-text="Voucher Number" v-model="remark" />
          </div>
          <div class="col-3 q-px-md">
            <q-btn color="primary" label="Add" @click="onClickAdd" />
          </div>
          <div id="tableLayoutId" class="col-12 q-px-md q-mt-lg">
            <STable
              :loading="isFetching"
              :columns="ResTableHeaders"
              :data="tempTable"
              row-key="indexFoc"
              :noPagination="true"
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
          label="Cancel"
          @click="onClickCancel"
        />
        <q-btn color="primary" label="Posting" @click="onClickPosting" />
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
import { ResTableHeaders } from '~/app/modules/FOC/tables/quickPostingToGuestFolio.table';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      outletOptions: [],
      selectedOutlet: '',
      articleNumberOptions: [],
      selectedArticleNumber: '',
      roomNumber: '',
      quantity: '',
      price: '',
      remark: '',
      bezeich: '',
      pricetab: '',
      betriebsnr: '',
      epreis: 0,
      maxPrice: 0,
      lPrice: 0,
      avrgKurs: 0,
      tempTable: [],
    });

    const getDialogQptgf = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_QPTGF;
    });

    const getDialogError = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_ERROR;
    });

    const getQuickPostingPrepare: any = computed(() => {
      return store.getters.focGuestFolio.GET_QUICK_POSTING_PREPARE;
    });

    const getLoadHotelDepartment = computed(() => {
      let res: any = store.getters.focGuestFolio.GET_LOAD_HOTEL_DEPARTMENT;

      if (res.length > 0) {
        res.map((item: any, index: any) => {
          item.indexFoc = index;
        });
      }
      return res || [];
    });

    const getSelectedPGuest: any = computed(() => {
      const res: any = store.getters.focGuestFolio.GET_SELECTED_P_GUEST;
      state.roomNumber = res.zinr || '';
      state.quantity = '1';
      return res;
    });

    const onChangeOutlet = async (num: any) => {
      const loadArtikelTwo = await $api.frontOfficeCashier.loadArtikelTwo({
        caseType: 2,
        int1: num,
        int2: 0,
        int3: 0,
        int4: 0,
        int5: 0,
        char1: '',
      });

      loadArtikelTwo.tArtikel['t-artikel'].map((item, index) => {
        item.indexFoc = index;
      });
      state.articleNumberOptions = loadArtikelTwo.tArtikel['t-artikel'];
    };
    const onChangeArticleNumber = async (artnr: any) => {
      const loadArtikelTwo = await $api.frontOfficeCashier.loadArtikelTwo({
        caseType: 2,
        int1: state.selectedOutlet,
        int2: 0,
        int3: 0,
        int4: 0,
        int5: 0,
        char1: '',
      });
      const filter = loadArtikelTwo.tArtikel['t-artikel'].filter(
        (item: any) => item.artnr === artnr
      );

      state.bezeich = filter[0].bezeich;
      state.pricetab = filter[0].pricetab;
      state.betriebsnr = filter[0].betriebsnr;
      state.epreis = filter[0].epreis;
      state.price = filter[0].epreis;
      state.lPrice = filter[0].epreis;
    };

    const onSearchRoomNumber = async (roomNumber: any) => {
      const selectPGuest = await $api.frontOfficeCashier.selectPGuest({
        roomno: '',
        sorttype: 1,
        gname: '',
      });

      store.commit.focGuestFolio.SET_SELECT_P_GUEST(selectPGuest);
      store.commit.focGuestFolio.SET_DIALOG_QPTGF_RN(true);
    };

    const onChangePrice = async (price: any) => {
      const getHTParam0 = await $api.frontOfficeCashier.getHTParam0({
        casetype: 5,
        inpParam: 1086,
      });
      state.maxPrice = getHTParam0.fdec;
      state.lPrice = parseInt(state.price);

      if (state.pricetab == 'true') {
        const readCurrency = await $api.frontOfficeCashier.readCurrency({
          caseType: 1,
          currencyNo: state.betriebsnr,
          currBez: '',
        });

        state.lPrice =
          (parseInt(state.price) *
            readCurrency.tWaehrung['t-waehrung'][0].ankauf) /
          readCurrency.tWaehrung['t-waehrung'][0].einheit;
      }

      if (state.lPrice >= state.maxPrice) {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'information',
          title1: 'Information',
          text1: 'The Price Amount too big',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }

      if (
        getQuickPostingPrepare.value.doubleCurrency == 'false' &&
        state.epreis >= 100
      ) {
        state.lPrice = state.epreis * getQuickPostingPrepare.value.exchgRate;

        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'question',
          title1: 'Question',
          text1: `The entered price = ${
            state.epreis
          } equal to Rp ${state.lPrice.toFixed(
            getQuickPostingPrepare.value.priceDecimal
          )}`,
          btnOk: 'Yes',
          btnCancel: 'No',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }

      const readCurrency = await $api.frontOfficeCashier.readCurrency({
        caseType: 7,
        currencyNo: state.betriebsnr,
        currBez: '',
      });

      if (readCurrency.tWaehrung['t-waehrung'].length > 0) {
        state.avrgKurs =
          readCurrency.tWaehrung['t-waehrung'][0].ankauf /
          readCurrency.tWaehrung['t-waehrung'][0].einheit;
      }
    };

    const onClickAdd = async () => {
      let tempTable = [
        {
          resnr: getSelectedPGuest.value.resnr,
          reslinnr: getSelectedPGuest.value.reslinnr,
          zeit: '',
          dept: state.selectedOutlet,
          artnr: state.selectedArticleNumber,
          bezeich: state.bezeich,
          zinr: state.roomNumber,
          anzahl: state.quantity,
          preis: state.epreis,
          betrag: parseInt(state.quantity) * state.epreis * state.avrgKurs,
        },
      ];

      if (state.remark !== '') {
        tempTable[0].bezeich = `${state.bezeich}/${state.remark}`;
      }

      state.tempTable = tempTable;
    };

    const onClickPosting = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const lastData: any = state.tempTable.length;
      // store.commit.focGuestFolio.SET_ERROR_MESSAGE({
      //   from: 'question',
      //   title1: 'Question',
      //   text1: 'Confirm your posting?',
      //   btnOk: 'OK',
      // });
      // store.commit.focGuestFolio.SET_DIALOG_ERROR(true);

      const quickPostCreateBill = await $api.frontOfficeCashier.quickPostCreateBill(
        {
          sList: {
            's-list': state.tempTable,
          },
          pvILanguage: 1,
          billart: state.tempTable[lastData - 1].artnr,
          currDept: state.tempTable[lastData - 1].dept,
          amount: 0,
          doubleCurrency: getQuickPostingPrepare.value.doubleCurrency,
          foreignRate: getQuickPostingPrepare.value.foreignRate,
          userInit: userAuth.userInit,
          voucherNr: '',
        }
      );

      store.commit.focGuestFolio.SET_ERROR_MESSAGE({
        from: 'information',
        title1: 'Information',
        text1: quickPostCreateBill.msgStr2,
        btnOk: 'OK',
      });
      store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      store.commit.focGuestFolio.SET_DIALOG_QPTGF(false);
    };

    const onClickCancel = async () => {
      store.commit.focGuestFolio.SET_DIALOG_QPTGF(false);
    };

    onMounted(async () => {});

    return {
      ResTableHeaders,
      getDialogQptgf,
      getDialogError,
      getQuickPostingPrepare,
      getLoadHotelDepartment,
      getSelectedPGuest,
      onChangeOutlet,
      onChangeArticleNumber,
      onSearchRoomNumber,
      onChangePrice,
      onClickAdd,
      onClickPosting,
      onClickCancel,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
.btn-input-search {
  background: #1485cb;
  margin-right: -12px;
  border-radius: 0 4px 4px 0;
  margin-left: 12px;
  padding-left: 6px;
  padding-right: 6px;
}
</style>

<style lang="scss" scoped>
.dialog-card {
  max-width: 1000px;
  width: 1000px;
}

.q-toolbar {
  background: $primary-grad;
}
</style>
