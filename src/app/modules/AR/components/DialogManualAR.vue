<template>
  <SDialog v-bind="$attrs" v-on="altListeners" @hide="altHide">
    <template #title> Manual AR </template>
    <template #body>
      <div v-if="loading" class="q-pa-md text-center">
        <q-spinner color="primary" size="4em" :thickness="3" />
      </div>
      <template v-else>
        <div class="row q-gutter-md">
          <div class="col">
            <div>
              <GuestInput v-model="guest" />
              <div class="row q-gutter-sm">
                <div class="col-auto">
                  <SDateInput label-text="Bill Date" v-model="billDate" />
                </div>
                <div class="col-3">
                  <SInput
                    label-text="Bill Number"
                    v-model="billNr"
                    type="number"
                    :rules="[
                      reqRule('Please set Bill Number'),
                      (r) => r.length < 9 || 'Can not more than 9',
                    ]"
                  />
                </div>
                <div class="col">
                  <SSelect
                    emit-value
                    map-options
                    label-text="Article Number"
                    v-model="articleNr"
                    :options="artikelList.result"
                    :clearable="false"
                    :rules="[reqRule('Please select Article Number')]"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <q-checkbox label="Local" :value="true" disabled readonly />
                </div>

                <div class="col">
                  <q-checkbox label="Foregin" v-model="showForegin" />
                </div>
              </div>
              <div class="row q-gutter-sm">
                <div class="col">
                  <SInputMoney
                    label-text="Local Amount"
                    v-model="lAmount"
                    :rules="[reqRule('Please set Local Amount')]"
                  />
                </div>
                <div class="col">
                  <SInputMoney
                    v-model="fAmount"
                    v-show="showForegin"
                    label-text="Foregin Amount"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col">
            <q-checkbox
              class="full-width"
              label="Create Journal"
              v-model="createJournal"
            />
            <div v-show="createJournal" class="row q-gutter-sm">
              <div class="col">
                <SInput
                  label-text="Journal Reference Number"
                  v-model="journalRefNr"
                  :rules="[reqRule('Journal Reference Number Required Field')]"
                />
              </div>
              <div class="col">
                <SInputMoney v-model="balance" label-text="Balance" />
              </div>
            </div>
            <STable
              v-if="createJournal"
              :data="data"
              :columns="columns"
              table-class="journal-table"
              row-key="name"
              height="150px"
              fixed-header
            >
              <template #body-cell-accNum="props">
                <q-td :props="props" width="33.3%" :auto-width="false">
                  <SSelect
                    :options="accountList.result"
                    v-model="props.row.accNum"
                    map-options
                    emit-value
                    :clearable="false"
                  />
                </q-td>
              </template>
              <template #body-cell-credit="props">
                <q-td :props="props" width="33.3%" :auto-width="false">
                  <SInputMoney v-model="props.row.credit" />
                </q-td>
              </template>
              <template #body-cell-debit="props">
                <q-td :props="props" width="33.3%" :auto-width="false">
                  <SInputMoney v-model="props.row.debit" />
                </q-td>
              </template>
            </STable>
            <STable v-else :data="[]" :columns="columns" row-key="name" />
          </div>
        </div>
      </template>
    </template>
    <template #action-cancel>
      <q-btn
        @click="onARCancel"
        label="Cancel"
        color="primary"
        flat
        class="q-mr-sm"
      />
    </template>
    <template #action-ok>
      <q-btn @click="saveManualAR" label="Save" color="primary" />
    </template>
  </SDialog>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  ref,
  computed,
} from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';
import { formatToBL } from '~/app/helpers/formatterDate.helper';
import DialogConfirm from './DialogConfirm.vue';
import { TableHeader } from '~/components/VhpUI/typings';

export default defineComponent({
  inheritAttrs: true,
  setup(props, { root, listeners }) {
    const { hide, ...altListeners } = listeners;
    const { $api, $q } = root;
    const placeholder = {
      name: 'placeholder',
      accNum: undefined,
      debit: 0,
      credit: 0,
    };

    const initialState = {
      guest: {
        gastnr: null,
        gname: null,
        city: null,
        gtype: null,
        aging: null,
      },
      showForegin: false,
      createJournal: true,
      billDate: new Date(),
      billNr: '',
      articleNr: '',
      lAmount: '',
      balance: '',
      fAmount: '',
      journalRefNr: '',
    };
    const state = reactive({
      ...initialState,
    });
    const data = ref([
      {
        ...placeholder,
      },
    ]);

    watch(
      () => data.value,
      (value, nvalue) => {
        // it a update
        if (value.length === nvalue.length) {
          const latest = nvalue[nvalue.length - 1];
          // add new placeholder on filled last
          if (latest.accNum) {
            data.value.push({
              ...placeholder,
              name: `placeholder_${nvalue.length}`,
            });
          }
        }
      },
      { deep: true, flush: 'post' }
    );

    const artikelList = usePrepare(
      true,
      () => $api.common.getArtikel(4, 0),
      undefined,
      (data) => mapWithBezeich(data, 'artnr'),
      []
    );

    const accountList = usePrepare(
      true,
      () =>
        $api.accountReceivable.getPrepareSelectGLAcct({
          currDept: 0,
          fromFibu: '',
        }),
      undefined,
      (data) => mapWithBezeich(data, 'fibukonto'),
      []
    );

    const saveAR = usePrepare(
      false,
      async () => {
        const date = formatToBL(state.billDate);

        if (state.createJournal && data.value.length > 1) {
          // get t-artikel.fibukonto of article no
          const article = await $api.accountReceivable.getReadArticleList({
            caseType: 15,
            artNo: state.articleNr,
            dept: 0,
            aName: '',
          });
          const sendParams = {
            pvILanguage: 1,
            sList: {
              's-list': [
                ...data.value
                  .filter((it) => it.name !== placeholder.name)
                  .map((it) => ({
                    fibukonto: it.accNum,
                    debit: it.debit,
                    credit: it.credit,
                  })),
              ],
            },
            rgdatum: date,
            firma: state.guest.gname,
            artFibukonto: article[0]?.fibukonto,
            userInit: 1, // Usercode user yang membuat data
            invoice: state.billNr,
            saldo: state.lAmount,
            refno: state.journalRefNr,
          };

          await $api.accountReceivable.manualARAdd(sendParams);
        }

        const apiPostManualARParams = {
          caseType: 1,
          tDebitor: {
            't-debitor': [
              {
                artnr: state.articleNr,
                name: state.guest.gname,
                gastnr: state.guest.gastnr,
                gastnrmember: state.guest.gastnr,
                rechnr: state.billNr,
                rgdatum: date,
                saldo: state.lAmount,
                vesrdep: state.fAmount ? state.fAmount : 0,
                'bediener-nr': 1, // Usercode user yang membuat data
                vesrdat: date,
                transzeit: state.lAmount,
                verstat: 9, // Kode transaksi manual AR
              },
            ],
          },
        };
        return $api.accountReceivable.saveAR(apiPostManualARParams);
      },
      () => {
        $q.notify({
          type: 'positive',
          message: 'Successfuly Save AR',
          icon: 'mdi-check',
          onDismiss: () => {
            hide();
          },
        });
      }
    );

    const loading = computed(() => artikelList.data.isLoading);

    const columns: TableHeader<any>[] = [
      {
        label: 'Accunt Number',
        field: 'accNum',
        name: 'accNum',
        align: 'left',
      },
      {
        label: 'Debit',
        field: 'debit',
        name: 'debit',
        align: 'left',
      },
      {
        label: 'Credit',
        field: 'credit',
        name: 'credit',
        align: 'left',
      },
    ];

    function reqRule(msg) {
      return (val) => !!val || msg;
    }

    function saveManualAR() {
      if (state.guest.gastnr === null || state.guest.gname === null) {
        $q.dialog({
          component: DialogConfirm,
          parent: root.$parent,
          icon: 'mdi-alert-circle-outline',
          title: 'Info',
          message: 'Select bill name',
          cancel: false,
          okLable: 'Ok',
          persistent: false,
        });

        return;
      }

      $q.dialog({
        component: DialogConfirm,
        parent: root.$parent,
        icon: 'mdi-help-circle-outline',
        title: 'Save Manual AR',
        message: 'Are you like to save?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        saveAR.refetch();
      });
    }

    function onARCancel() {
      $q.dialog({
        component: DialogConfirm,
        parent: root.$parent,
        icon: 'mdi-help-circle-outline',
        title: 'Cancel Manual AR',
        message: 'Are you sure cancel add manual AR?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        hide();
      });
    }

    function altHide() {
      if (!hide) {
        throw new Error('Must have hide listener');
      }
      hide();
      Object.assign(state, initialState); // rest to inital state
    }

    return {
      ...toRefs(state),
      columns,
      data,
      reqRule,
      loading,
      artikelList,
      accountList,
      saveManualAR,
      onARCancel,
      altHide,
      altListeners,
    };
  },
  components: {
    GuestInput: () => import('./GuestInput.vue'),
    SelectFilter: () => import('../../AP/components/SelectFilter.vue'),
  },
});
</script>
<style lang="scss">
.journal-table .q-table {
  table-layout: fixed;
  width: 100%;
}
</style>
