<template>
  <section class="mt-7 q-pa-md">
    <div v-if="searchPrep.data.isLoading" class="q-pa-md text-center">
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>
    <template v-else>
      <q-form @submit="onSearch">
        <SelectFilter
          label-text="Article Number"
          :options="articleOptions"
          option-value="value"
          option-label="label"
          v-model="formData.article"
          hide-bottom-space
          lazy-rules
          :rules="[(val) => val || 'Please select article']"
        />
        <SInput
          label-text="Billing Number"
          v-model="formData.billingNumber"
          hide-bottom-space
          :rules="[]"
        ></SInput>
        <SInput
          label-text="Balance"
          v-model="formData.balance"
          hide-bottom-space
          :rules="[]"
        ></SInput>
        <SDateInput label-text="By Date" v-model="formData.byDate" />
        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
        />
      </q-form>
      <q-separator style="border-width: 1px" class="q-mt-md" />
      <div class="q-pa-md">
        <q-btn
          block
          @click="() => $emit('remark', payment[0])"
          :disable="remarkDisable"
          color="primary"
          max-height="28"
          label="Remark"
          class="q-mb-md full-width"
        />
        <SInput
          label-text="Bill Receiver Address"
          type="textarea"
          rows="5"
          :value="billAddresses"
          disable
        />
        <SRemarkLeftDrawer label="Balance" :value="totalBalance | money" />
      </div>
    </template>
  </section>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  onMounted,
  ref,
} from '@vue/composition-api';
import { ResPaymentDebtPayList } from '../models/payment.model';
import { loadArticleList } from '../shared/article-list.comp';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';

export default defineComponent({
  props: {
    payment: {
      type: Array as () => Array<ResPaymentDebtPayList>,
      required: true,
    },
    totalBalance: { type: Number, required: true, default: 0 },
  },
  setup(props, { root: { $api }, emit }) {
    const formData = reactive({
      article: 1,
      preloadData: false,
      billingReceiver: '',
      billingNumber: '',
      balance: 0,
      byDate: null,
    });
    const articleOptions = ref([]);
    const searchPrep = usePrepare(
      false,
      () =>
        Promise.all([
          $api.accountReceivable.getARClosePayDate(),
          $api.accountReceivable.getReadArticleList({
            caseType: '13',
            dept: 0,
            actFlag: true,
          }),
        ]),
      ([tempData, asd]) => {
        formData.byDate = new Date(tempData.billDate);
        articleOptions.value = mapWithBezeich(asd, 'artnr');
        console.log('');
      }
    );

    onMounted(() => {
      searchPrep.refetch().then(() => onSearch());
    });

    const billAddresses = computed(() =>
      props.payment.length === 1 ? props.payment[0].billReceiverAddress : ''
    );

    const remarkDisable = computed(() => {
      return props.payment.length < 0 || props.payment.length > 1;
    });

    function onSearch() {
      const param = {
        artSelected: 0,
        artnr: formData.article,
        billNr: formData.billingNumber,
        tempArt2: formData.article,
        billDate: formData.byDate,
        billName: ' ',
        toName: formData.billingReceiver,
        billSaldo: formData.balance,
      };
      emit('search', param);
    }

    return {
      formData,
      articleOptions,
      onSearch,
      billAddresses,
      remarkDisable,
      searchPrep,
    };
  },
  components: {
    SelectFilter: () => import('../../AP/components/SelectFilter.vue'),
  },
});
</script>
