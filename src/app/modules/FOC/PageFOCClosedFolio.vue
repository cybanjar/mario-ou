<template>
  <div>
    <div v-if="closed === 1">
      <ClosedGuestFolio />
    </div>
    <div v-else-if="closed === 2">
      <ClosedMasterFolio />
    </div>
    <div v-else-if="closed === 3">
      <ClosedNonguestFolio />
    </div>
    <div v-else>
      <q-drawer :value="true" side="left" bordered :width="250" persistent>
        <div class="q-pa-md">
          <div>
            <q-option-group
              :options="displayOptions"
              type="radio"
              v-model="sortType"
            />
          </div>
          <SInput
            label-text="Search Folio Number"
            class="q-mt-lg q-mb-xl"
            v-model="inqBill"
            @keyup.enter="onSearch"
          />
          <q-btn
            block
            color="primary"
            max-height="28"
            label="Open"
            type="submit"
            class="full-width"
            @click="onClickOpen"
          />
        </div>
      </q-drawer>
      <div class="q-ma-md"></div>
    </div>
    <DialogError />
    <DialogQuickPostingToGuestFolio />
    <DialogQuickPostingToGuestFolioRn />
    <DialogMoneyChangePosting />
    <DialogMoneyChangePostingRn />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
} from '@vue/composition-api';
import { date } from 'quasar';
import { store } from '~/store';
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      displayOptions: [
        { label: 'Guest Folio', value: 1 },
        { label: 'Master Folio', value: 2 },
        { label: 'Nonguest Folio', value: 3 },
      ],
      sortType: 1,
      closed: null,
      inqBill: '',
    });

    const onPrepare = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const checkPermission = await $api.frontOfficeCashier.checkPermission({
        userInit: userAuth.userInit,
        arrayNr: 11,
        expectedNr: 1,
      });

      if (checkPermission.zugriff === 'true') {
        const getHTParam0 = await $api.frontOfficeCashier.getHTParam0({
          casetype: 2,
          inpParam: 110,
        });
        let newDate = new Date(getHTParam0.fdate);
        newDate.setDate(newDate.getDate() - 10);
        const startDate = date.formatDate(newDate, 'MM/DD/YY');
        const endDate = date.formatDate(getHTParam0.fdate, 'MM/DD/YY');

        const readBill1 = await $api.frontOfficeCashier.readBill1({
          caseType: 6,
          billNo: 0,
          resNo: 0,
          reslinNo: 0,
          actFlag: 1,
          roomNo: ' ',
          datum1: startDate,
          datum2: endDate,
          saldo1: 0,
          saldo2: 0,
        });

        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'ClosedFolio',
          title1: 'Information',
          text1: `Closed Folio with a non zero balance found: Folio Number : ${readBill1.tBill['t-bill'][0].rechnr}`,
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'ClosedFolio',
          title1: 'Information',
          text1: 'Sorry, No Access Right. Access Code 11,2',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    const onSearch = async () => {
      const readBill1 = await $api.frontOfficeCashier.readBill1({
        caseType: 1,
        billNo: state.inqBill,
        resNo: 0,
        reslinNo: 0,
        actFlag: 0,
        roomNo: ' ',
        datum1: '',
        datum2: '',
        saldo1: 0,
        saldo2: 0,
      });

      if (readBill1.tBill['t-bill'].length === 0) {
        const ReadBillHis = await $api.frontOfficeCashier.ReadBillHis({
          caseType: 1,
          billNo: state.inqBill,
          resNo: 0,
          reslinNo: 0,
        });
        if (ReadBillHis.tBillhis['t-billhis'].length === 0) {
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'ClosedFolio',
            title1: 'Message',
            text1: 'No Such Folio Number',
            btnOk: 'OK',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        } else {
          switch (true) {
            case ReadBillHis.tBillhis['t-billhis'][0].reslinnr === 0:
              store.commit.focGuestFolio.SET_ERROR_MESSAGE({
                from: 'ClosedFolio',
                title1: 'Information',
                text1: '1 Master Folio History Found',
                btnOk: 'OK',
              });
              store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
              break;

            case ReadBillHis.tBillhis['t-billhis'][0].reslinnr > 0:
              store.commit.focGuestFolio.SET_ERROR_MESSAGE({
                from: 'ClosedFolio',
                title1: 'Information',
                text1: '1 Guest Folio History Found',
                btnOk: 'OK',
              });
              store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
              break;

            default:
              store.commit.focGuestFolio.SET_ERROR_MESSAGE({
                from: 'ClosedFolio',
                title1: 'Information',
                text1: '1 Nonguest Folio History Found',
                btnOk: 'OK',
              });
              store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
              break;
          }
        }
      } else if (
        readBill1.tBill['t-bill'].length > 0 &&
        readBill1.tBill['t-bill'][0].flag === 0
      ) {
        switch (true) {
          case readBill1.tBill['t-bill'][0].resnr === 0 && state.sortType === 3:
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'ClosedFolio',
              title1: 'Information',
              text1: 'Nonguest Folio - Status: Active.',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            break;

          case readBill1.tBill['t-bill'][0].resnr > 0 &&
            readBill1.tBill['t-bill'][0].reslinnr === 0 &&
            state.sortType === 2:
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'ClosedFolio',
              title1: 'Information',
              text1: 'Master Folio - Status: Active',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            break;

          case readBill1.tBill['t-bill'][0].resnr > 0 &&
            readBill1.tBill['t-bill'][0].reslinnr > 0 &&
            state.sortType === 1:
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'ClosedFolio',
              title1: 'Information',
              text1: 'Guest Folio - Status: Active',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            break;

          default:
            break;
        }
      } else if (
        readBill1.tBill['t-bill'].length > 0 &&
        readBill1.tBill['t-bill'][0].flag === 1
      ) {
        switch (true) {
          case readBill1.tBill['t-bill'][0].resnr === 0 && state.sortType === 3:
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'ClosedFolio',
              title1: 'Information',
              text1: 'Nonguest Folio - Status: Closed.',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            break;

          case readBill1.tBill['t-bill'][0].resnr > 0 &&
            readBill1.tBill['t-bill'][0].reslinnr === 0 &&
            state.sortType === 2:
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'ClosedFolio',
              title1: 'Information',
              text1: 'Master Folio - Status: Closed',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            break;

          case readBill1.tBill['t-bill'][0].resnr > 0 &&
            readBill1.tBill['t-bill'][0].reslinnr > 0 &&
            state.sortType === 1:
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'ClosedFolio',
              title1: 'Information',
              text1: 'Guest Folio - Status: Closed',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            break;

          default:
            break;
        }
      }
    };

    const onClickOpen = async () => {
      const userAuth: any = Cookies.get('userAuth');
      if (state.sortType === 3) {
        const checkPermission = await $api.frontOfficeCashier.checkPermission({
          userInit: userAuth.userInit,
          arrayNr: 55,
          expectedNr: 2,
        });

        switch (true) {
          case checkPermission.zugriff === 'true':
            // kurang function Void Item to ticket no #861

            state.closed = state.sortType;
            break;

          default:
            store.commit.focGuestFolio.SET_ERROR_MESSAGE({
              from: 'ClosedFolio',
              title1: 'Message',
              text1: 'Sorry, No Access Right. Access Code 55,2',
              btnOk: 'OK',
            });
            store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
            break;
        }
      } else {
        state.closed = state.sortType;
      }
    };

    onMounted(() => {
      onPrepare();
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
      onSearch,
      onClickOpen,
      ...toRefs(state),
    };
  },
  components: {
    ClosedGuestFolio: () =>
      import('~/app/modules/FOC/components/ClosedFolio/ClosedGuestFolio.vue'),
    ClosedNonguestFolio: () =>
      import(
        '~/app/modules/FOC/components/ClosedFolio/ClosedNonguestFolio.vue'
      ),
    ClosedMasterFolio: () =>
      import('~/app/modules/FOC/components/ClosedFolio/ClosedMasterFolio.vue'),
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
