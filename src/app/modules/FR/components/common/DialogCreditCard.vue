<template>
  <q-dialog v-model="showDialog" :persistent="true">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Credit Card Numbers</span>
      </div>

      <div class="q-px-lg q-py-md bg-white">
        <STable :columns="tableHeaders" :data="tableData">
          <template #body="props">
            <q-tr :props="props">
              <q-td key="cardName" :props="props">
                {{ props.row.cardName }}
                <q-popup-edit
                  v-model="props.row.cardName"
                  title="Credit Card Name"
                  buttons
                  label-set="Save"
                >
                  <SSelect
                    v-model="props.row.cardName"
                    input-classes="q-mb-none"
                    :options="cardOptions"
                  />
                </q-popup-edit>
              </q-td>

              <q-td key="cardNumber" :props="props">
                {{ props.row.cardNumber }}
                <q-popup-edit
                  v-model="props.row.cardNumber"
                  title="Credit Card Number"
                  buttons
                  label-set="Save"
                >
                  <SInput
                    v-model="props.row.cardNumber"
                    input-classes="q-mb-none"
                    autofocus
                  />
                </q-popup-edit>
              </q-td>

              <q-td key="expiryMonth" :props="props">
                {{ props.row.expiryMonth }}
                <q-popup-edit
                  v-model="props.row.expiryMonth"
                  title="Expiry Month"
                  buttons
                  label-set="Save"
                >
                  <SSelect
                    v-model="props.row.expiryMonth"
                    input-classes="q-mb-none"
                    :options="monthOptions"
                  />
                </q-popup-edit>
              </q-td>

              <q-td key="expiryYear" :props="props">
                {{ props.row.expiryYear }}
                <q-popup-edit
                  v-model="props.row.expiryYear"
                  title="Expiry Year"
                  buttons
                  label-set="Save"
                >
                  <SSelect
                    v-model="props.row.expiryYear"
                    input-classes="q-mb-none"
                    :options="yearOptions"
                  />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </STable>
      </div>

      <div class="dialog__footer">
        <q-btn
          label="Cancel"
          color="primary"
          flat
          class="q-mr-sm"
          v-close-popup
        />
        <q-btn label="OK" color="primary" @click="onSave" />
      </div>

      <q-inner-loading :showing="isPreparing" color="primary" />
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { TableHeader } from '~/components/VhpUI/typings';

interface CreditCard {
  cardName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
}

const tableHeaders: TableHeader<CreditCard>[] = [
  { label: 'Credit Card Name', align: 'left', name: 'cardName' },
  { label: 'Number', align: 'left', name: 'cardNumber' },
  { label: 'Expiry Month', align: 'left', name: 'expiryMonth' },
  { label: 'Expiry Year', align: 'left', name: 'expiryYear' },
];

const DEFAULT_LENGTH_TABLE = 5;

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    guestNumber: { type: Number, required: true },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const state = reactive({
      isPreparing: false,
      tableData: [] as CreditCard[],
    });
    const cardOptions = ref<string[]>([]);
    const monthOptions = [...Array(12)].map((_, idx) => {
      const monthStr = (idx + 1).toString();
      if (monthStr.length < 2) return `0${monthStr}`;
      else return monthStr;
    });
    const yearOptions = [...Array(26)].map((_, idx) => {
      const currentYear = new Date().getFullYear();
      return (currentYear + idx).toString();
    });

    if (showDialog.value) {
      (async () => {
        state.isPreparing = true;
        const [resCardOptions, guest] = await Promise.all([
          $api.frontOfficeReception.loadArtikel({ caseType: 4, deptNo: 0 }),
          $api.frontOfficeReception.readGuest(props.guestNumber),
        ]);
        state.isPreparing = false;
        cardOptions.value = resCardOptions.map((e) => e.bezeich);
        setTableData(guest['ausweis-nr2']);
      })();
    }

    function setTableData(newData: string) {
      const rows = newData.split('|').filter((e) => e.length > 0);
      const data: CreditCard[] = rows.map((row) => {
        const [cardName, cardNumber, expiry] = row.split('\\');
        const expiryMonth = expiry.substring(0, 2);
        const expiryYear = expiry.substring(2, 6);
        return { cardName, cardNumber, expiryMonth, expiryYear };
      });

      if (data.length < DEFAULT_LENGTH_TABLE) {
        const length = DEFAULT_LENGTH_TABLE - data.length;
        const emptyData = [...Array(length)].map(() => ({
          cardName: '',
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
        }));
        state.tableData = [...data, ...emptyData];
      } else state.tableData = data;
    }

    async function onSave() {
      const filterEmptyData = state.tableData.filter(
        ({ cardName, cardNumber }) => {
          return cardName.length > 0 && cardNumber.length > 0;
        }
      );
      const combineColumn = filterEmptyData.map((item) => {
        const { cardName, cardNumber, expiryMonth, expiryYear } = item;
        return `${cardName}\\${cardNumber}\\${expiryMonth}${expiryYear}`;
      });
      const data = combineColumn.join('|');

      if (data.length < 1) {
        showDialog.value = false;
        return;
      }

      $q.loading.show();
      await $api.frontOfficeReception.saveCreditCard(props.guestNumber, data);
      $q.loading.hide();
      $q.notify({
        type: 'positive',
        message: 'Successfully save credit card.',
      });
      showDialog.value = false;
    }

    return {
      tableHeaders,
      showDialog,
      ...toRefs(state),
      cardOptions,
      monthOptions,
      yearOptions,
      onSave,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 650px !important;
}
</style>
