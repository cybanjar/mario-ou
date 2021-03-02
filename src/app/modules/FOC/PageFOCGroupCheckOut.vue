<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <v-date-picker
          v-model="checkoutDate"
          :masks="{ input: ['DD/MM/YYYY'] }"
          :columns="2"
          :popover="{
            visibility: 'click',
          }"
        >
          <template #default="{ inputValue, inputEvents }">
            <SInput
              label-text="Check-Out Date"
              readonly
              :value="inputValue"
              v-on="inputEvents"
            >
              <template #append>
                <q-icon name="mdi-calendar" />
              </template>
            </SInput>
          </template>
        </v-date-picker>

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md q-mb-xl full-width"
          @click="onSearch"
        />

        <SRemarkLeftDrawer
          label="Reservation From & Address"
          :value="
            resFromAndAddress.trim().length > 0 ? resFromAndAddress : 'None'
          "
        />
        <SRemarkLeftDrawer
          label="Reservation Remark"
          :value="resRemark.trim().length > 0 ? resRemark : 'None'"
        />
      </div>
    </q-drawer>
    <div class="q-ma-md">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="onResets">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <div class="row">
        <div id="tableLayoutId" class="col-12">
          <STable
            :loading="isFetching"
            :columns="ResTableHeaders"
            :data="table"
            :noPagination="true"
            :selected.sync="onSelectTable"
            :class="table.length > 0 && 'selected-table'"
            row-key="indexFoc"
            @row-click="onClickTable"
          >
            <template #header-cell-artnr="props">
              <q-th :props="props" class="fixed-col left">
                {{ props.col.label }}
              </q-th>
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
                      <q-item clickable v-ripple @click="displayGroupMember">
                        <q-item-section>Display Group Member</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-icon>
              </q-td>
            </template>
          </STable>
        </div>
      </div>
    </div>
    <DialogError />
    <DialogQuickPostingToGuestFolio />
    <DialogQuickPostingToGuestFolioRn />
    <DialogMoneyChangePosting />
    <DialogMoneyChangePostingRn />
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
} from '@vue/composition-api';
import { ResTableHeaders } from './tables/groupCheckOut.table';
import { ResTableLists } from '~/app/modules/FOC/models/groupCheckout.model';
import { setupCalendar, DatePicker } from 'v-calendar';
import { store } from '~/store';
import { date } from 'quasar';
import { keys } from 'highcharts';
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';
import { Cookies } from 'quasar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  setup(props, { root: { $api, $router } }) {
    const state = reactive({
      isFetching: false,
      table: [],
      selectedTable: {},
      checkoutDate: '',
      resFromAndAddress: '',
      resRemark: '',
    });

    const onSearch = async () => {
      let checkoutGroupSave = await $api.frontOfficeCashier.checkoutGroupSave({
        caseType: 1,
        ciDate: date.formatDate(state.checkoutDate, 'YYYY-MM-DD'),
      });

      checkoutGroupSave.mainresList['mainres-list'].map(
        (item: any, index: any) => {
          item.indexFoc = index;
          Object.keys(item).map((key) => {
            if (item[key] === null) {
              item[key] = '';
            }
          });
        }
      );

      state.table = checkoutGroupSave.mainresList['mainres-list'];
    };

    const onSelectTable = ref<ResTableLists[]>([]);
    const onClickTable = (_, row: ResTableLists) => {
      onSelectTable.value = [row];
      state.selectedTable = [row][0];
      state.resFromAndAddress = `${[row][0]['name']} ${
        [row][0]['res-address']
      } ${[row][0]['res-city']}`;
      state.resRemark = [row][0]['res-bemerk'];
    };

    const onResets = async () => {
      const checkoutGroupPrepare = await $api.frontOfficeCashier.checkoutGroupPrepare();
      state.checkoutDate = checkoutGroupPrepare.ciDatum;
      state.resFromAndAddress = '';
      state.resRemark = '';
      onSearch();
    };

    const displayGroupMember = async () => {
      const selected: any = state.selectedTable;
      const userAuth: any = Cookies.get('userAuth');

      const checkPermission = await $api.frontOfficeCashier.checkPermission({
        userInit: userAuth.userInit,
        arrayNr: 5,
        expectedNr: 2,
      });

      if (checkPermission.zugriff === 'true') {
        store.commit.focIndividualCheckout.SET_SELECTED_GROUP_CHECKOUT(
          selected
        );
        $router.push({
          path: '/foc/individual-check-out',
          query: { inputResnr: selected.resnr.toString() },
        });
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'GroupCheckout',
          title1: 'Message',
          text1: 'Sorry, No Access Right. Access Code 05,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    onMounted(async () => {
      const checkoutGroupPrepare = await $api.frontOfficeCashier.checkoutGroupPrepare();
      state.checkoutDate = checkoutGroupPrepare.ciDatum;
      onSearch();
    });

    useExtraMenu([
      {
        handler: async () => {
          const userAuth: any = Cookies.get('userAuth');
          const checkPermission = await $api.frontOfficeCashier.checkPermission(
            {
              userInit: userAuth.userInit,
              arrayNr: 8,
              expectedNr: 2,
            }
          );

          if (checkPermission.zugriff === 'true') {
            const quickPostPrepare = await $api.frontOfficeCashier.quickPostPrepare();
            const loadHotelDepartment = await $api.frontOfficeCashier.loadHotelDepartment();

            store.commit.focGuestFolio.SET_QUICK_POSTING_PREPARE(
              quickPostPrepare
            );
            store.commit.focGuestFolio.SET_LOAD_HOTEL_DEPARTMENT(
              loadHotelDepartment
            );
            store.commit.focGuestFolio.SET_DIALOG_QPTGF(true);
          } else {
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'QuickPostingToGuestFolio',
              title1: 'Information',
              text1: 'Sorry, No Access Right. Access Code 08,2',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          }
        },
        icon: 'FOC/Icon-QuickPostingToGuestFolio2',
      },
      {
        handler: async () => {
          const userAuth: any = Cookies.get('userAuth');
          const checkPermission = await $api.frontOfficeCashier.checkPermission(
            {
              userInit: userAuth.userInit,
              arrayNr: 8,
              expectedNr: 2,
            }
          );

          if (checkPermission.zugriff === 'true') {
            const moneyExchgPrepare = await $api.frontOfficeCashier.moneyExchgPrepare();
            const getReadArticle = await $api.frontOfficeCashier.getReadArticle(
              {
                artNo: 43,
                dept: 0,
                aName: ' ',
              }
            );
            if (moneyExchgPrepare.errCode === 1) {
              store.commit.focGuestFolio.SET_ERROR_MESSAGE({
                from: 'General',
                title1: 'Information',
                text1: 'Local Cash Article not defined! (Param 112 / Grp 5”',
                btnOk: 'OK',
              });
              store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            } else if (moneyExchgPrepare.errCode === 2) {
              store.commit.focGuestFolio.SET_ERROR_MESSAGE({
                from: 'General',
                title1: 'Information',
                text1: 'Local Currency not defined (Param 152/7)',
                btnOk: 'OK',
              });
              store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            } else {
              store.commit.focGuestFolio.SET_MONEY_EXCHG_PREPARE(
                moneyExchgPrepare
              );
              store.commit.focGuestFolio.SET_GET_READ_ARTICLE(getReadArticle);
              store.commit.focGuestFolio.SET_DIALOG_MONEY_CHANGE_POSTING(true);
            }
          } else {
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'QuickPostingToGuestFolio',
              title1: 'Information',
              text1: 'Sorry, No Access Right. Access Code 08,2',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
          }
        },
        icon: 'FOC/Icon-MoneyChangePosting',
      },
    ]);

    return {
      ResTableHeaders,
      onSearch,
      onResets,
      onSelectTable,
      onClickTable,
      displayGroupMember,
      ...toRefs(state),
    };
  },
  components: {
    'v-date-picker': DatePicker,
    DialogError: () =>
      import('~/app/modules/FOC/components/Dialog/Errors/DialogError.vue'),
    DialogQuickPostingToGuestFolio: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogQuickPostingToGuestFolio.vue'
      ),
    DialogQuickPostingToGuestFolioRn: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogQuickPostingToGuestFolioRn.vue'
      ),
    DialogMoneyChangePosting: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogMoneyChangePosting.vue'
      ),
    DialogMoneyChangePostingRn: () =>
      import(
        '~/app/modules/FOC/components/Dialog/DialogMoneyChangePostingRn.vue'
      ),
  },
});
</script>

<style lang="scss" scoped>
#tableLayoutId {
  .selected-table {
    tbody tr.selected td {
      background: #1485cb !important;
      color: #fff;
    }
  }
  max-height: 450px !important;
  overflow: scroll;
}
</style>
