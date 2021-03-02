<template>
  <q-dialog v-model="getDialogMoneyChangePosting">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Money Change Posting
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-2 q-px-md">
            <div>
              <q-option-group
                :options="transactionOptions"
                type="radio"
                v-model="selectedTransaction"
              />
            </div>
          </div>
          <div class="col-3 q-px-md">
            <SSelect
              outlined
              label-text="Article"
              v-model="selectedArticleNumber"
              @input="onChangeArticleNumber"
              :options="getGetReadArticle"
              option-value="artnr"
              option-label="bezeich"
              map-options
              emit-value
              :dense="true"
            />
          </div>
          <div class="col-3 q-px-md">
            <SInput
              label-text="Foreign Amount"
              v-model="foreignAmount"
              @blur="onForeignAmount(foreignAmount)"
              v-if="selectedTransaction === 'buy'"
            />
            <SInput
              label-text="Local Amount"
              v-model="localAmount"
              @blur="onLocalAmount(localAmount)"
              v-else
            />
          </div>
          <div class="col-4 q-px-md">
            <SInput
              label-text="Local Amount"
              :value="localAmount"
              v-if="selectedTransaction === 'buy'"
              disable
            />
            <SInput
              label-text="Foreign Amount"
              :value="foreignAmount"
              disable
              v-else
            />
          </div>
          <div class="col-2 q-px-md"></div>
          <div class="col-3 q-px-md">
            <SInput label-text="Room Number" v-model="roomNumber">
              <template v-slot:append>
                <div class="btn-input-search">
                  <q-icon
                    name="mdi-magnify"
                    class="cursor-pointer"
                    color="white"
                    size="16px"
                    @click="onSearchRoomNumber()"
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
          <div class="col-4 q-px-md">
            <SInput label-text="ID" v-model="id" />
            <div class="f-bottom-between">
              <SInput
                label-text="Number of Print Copy"
                v-model="numberOfPrintCopy"
                class="full-width"
              />
              <q-btn
                color="primary"
                label="Post"
                @click="onClickPost"
                class="btn-post"
              />
            </div>
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
        <q-btn color="primary" label="Save" @click="onClickSave" />
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
import { ResTableHeaders } from '~/app/modules/FOC/tables/moneyChangePosting.table';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      selectedArticleNumber: '',
      roomNumber: '',
      foreignAmount: null,
      localAmount: null,
      transactionOptions: [
        { label: 'Buy', value: 'buy' },
        { label: 'Sell', value: 'sell' },
      ],
      selectedTransaction: 'buy',
      tempTable: [],
      id: '',
      numberOfPrintCopy: '',
      bezeich: '',
      artnr: 0,
      betriebsnr: 0,
      exRate: 0,
      code: '',
    });

    const getDialogMoneyChangePosting = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_MONEY_CHANGE_POSTING;
    });

    const getGetReadArticle = computed(() => {
      let res: any = store.getters.focGuestFolio.GET_GET_READ_ARTICLE;
      if (res.tArtikel) {
        res = res.tArtikel['t-artikel'];
      } else {
        res = [];
      }

      return res;
    });

    const getSelectedPGuest: any = computed(() => {
      const res: any = store.getters.focGuestFolio.GET_SELECTED_P_GUEST;
      state.roomNumber = res.zinr || '';
      return res;
    });

    const onChangeArticleNumber = async (artnr: any) => {
      const getMoneyExchgPrepare: any =
        store.getters.focGuestFolio.GET_MONEY_EXCHG_PREPARE;
      const getReadArticle1 = await $api.frontOfficeCashier.getReadArticle1({
        caseType: 1,
        artNo: artnr,
        dept: 0,
        aName: ' ',
        artart: 6,
        betriebsNo: 0,
        actFlag: true,
      });
      const res = getReadArticle1.tArtikel['t-artikel'][0];
      const getExRate = getMoneyExchgPrepare.tWaehrung['t-waehrung'].find(
        (item: any) => item.waehrungsnr === res.betriebsnr
      );
      state.bezeich = res.bezeich;
      state.artnr = res.artnr;
      state.betriebsnr = res.betriebsnr;
      state.exRate = getExRate.ankauf;
      state.code = getExRate.wabkurz;
    };

    const onSearchRoomNumber = async () => {
      const selectPGuest = await $api.frontOfficeCashier.selectPGuest({
        roomno: ' ',
        sorttype: 1,
        gname: ' ',
      });

      store.commit.focGuestFolio.SET_SELECT_P_GUEST(selectPGuest);
      store.commit.focGuestFolio.SET_DIALOG_MONEY_CHANGE_POSTING_RN(true);
    };

    const onForeignAmount = async (price: any) => {
      state.localAmount = state.exRate * price;
    };
    const onLocalAmount = async (price: any) => {
      state.foreignAmount = price / state.exRate;
    };

    const onClickPost = async () => {
      const getMoneyExchgPrepare: any =
        store.getters.focGuestFolio.GET_MONEY_EXCHG_PREPARE;
      let tempTable = [
        {
          artnr: state.artnr,
          bezeich: state.bezeich,
          preis:
            state.selectedTransaction === 'buy'
              ? -Math.abs(state.foreignAmount)
              : Math.abs(state.foreignAmount),
          betrag:
            state.selectedTransaction === 'buy'
              ? -Math.abs(state.localAmount)
              : Math.abs(state.localAmount),
        },
        {
          artnr: getMoneyExchgPrepare.localNr,
          bezeich: `${getMoneyExchgPrepare.art1.art1[0].bezeich} - ${state.code} ${state.foreignAmount}`,
          preis: formatThousands(state.foreignAmount),
          betrag:
            state.selectedTransaction === 'buy'
              ? Math.abs(state.localAmount)
              : -Math.abs(state.localAmount),
        },
      ];

      state.tempTable = tempTable;
    };

    const onClickSave = async () => {
      const getMoneyExchgPrepare: any =
        store.getters.focGuestFolio.GET_MONEY_EXCHG_PREPARE;
      const userAuth: any = Cookies.get('userAuth');
      const moneyExchgSave = await $api.frontOfficeCashier.moneyExchgSave({
        sList: {
          's-list': [
            {
              wahrnr: state.betriebsnr,
              dept: 0,
              artnr: state.artnr,
              bezeich: state.betriebsnr,
              zinr: state.roomNumber,
              anzahl: 1,
              preis: state.exRate,
              'we-buy':
                state.selectedTransaction === 'buy' ? state.foreignAmount : 0,
              'we-sell':
                state.selectedTransaction === 'sell' ? state.localAmount : 0,
              betrag:
                state.selectedTransaction === 'buy'
                  ? -Math.abs(state.localAmount)
                  : Math.abs(state.localAmount),
            },
            {
              wahrnr: state.betriebsnr,
              dept: 0,
              artnr: getMoneyExchgPrepare.art1.art1[0].artnr,
              bezeich: `${getMoneyExchgPrepare.art1.art1[0].bezeich} - ${state.code} ${state.foreignAmount}`,
              zinr: state.roomNumber,
              anzahl: 1,
              preis: 0,
              'we-buy': 0,
              'we-sell': 0,
              betrag:
                state.selectedTransaction === 'buy'
                  ? Math.abs(state.localAmount)
                  : -Math.abs(state.localAmount),
            },
          ],
        },
        room: state.roomNumber,
        userInit: userAuth.userInit,
        printFlag: true,
      });

      if (moneyExchgSave.flCode === 2) {
        store.commit.focGuestFolio.SET_DIALOG_MONEY_CHANGE_POSTING(false);
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'general',
          title1: 'Information',
          text1: 'Transaction Done',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    const onClickCancel = async () => {
      store.commit.focGuestFolio.SET_DIALOG_MONEY_CHANGE_POSTING(false);
    };

    return {
      ResTableHeaders,
      getDialogMoneyChangePosting,
      getSelectedPGuest,
      getGetReadArticle,
      onChangeArticleNumber,
      onSearchRoomNumber,
      onForeignAmount,
      onLocalAmount,
      onClickPost,
      onClickSave,
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

.f-bottom-between {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.btn-post {
  height: 36px;
  align-self: flex-end;
  margin-bottom: 16px;
  margin-left: 10px;
}
</style>
