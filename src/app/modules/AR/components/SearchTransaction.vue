<template>
  <section class="mt-7 q-pa-md">
    <div v-if="articlePrep.data.isLoading" class="q-pa-md text-center">
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>
    <template v-else>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <SSelect
          :options="articlePrep.result"
          v-model="debtArticle"
          emit-value
          map-options
          label-text="Debt Article"
          :rules="[(val) => !!val || 'Please Input Debt Article']"
        />
        <q-separator spaced />
        <div class="row justify-center items-center">
          <div class="col">
            <SInput v-model="billName" label-text="Bill Name" />
          </div>
          <q-icon
            @click="toggleDialog(true)"
            name="mdi-help-circle"
            color="blue"
            class="q-mx-sm"
            style="font-size: 32px;"
          />
        </div>
        <SDateRange v-model="dateRange" label-text="Date" />
        <q-checkbox v-model="showDetail" label="Show Detail" />
        <q-checkbox v-model="inclBalance" label="Include Balance Dept" />
        <SInput
          label-text="Since"
          v-model="billDate"
          type="date"
          :rules="[(val) => !!val || 'Please Input Since Date']"
        />
        <div class="q-px-sm q-py-md">
          <q-btn
            icon="mdi-magnify"
            label="Search"
            type="submit"
            class="full-width"
            color="primary"
          />
        </div>
        <q-separator spaced />
        <SRemarkLeftDrawer label="Debt" :value="debt | money" />
        <SRemarkLeftDrawer label="Paid" :value="paid | money" />
        <SRemarkLeftDrawer label="Balance" :value="balance | money" />
        <q-separator spaced />
        <SRemarkLeftDrawer
          label="Bill Receiver"
          :value="selectRemarks | joinStr"
        />
      </q-form>
    </template>
    <DialogSelectGuest
      :show="showDialog"
      @hide="toggleDialog(false)"
      @save="setGuestName"
    />
  </section>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';
import { formatterDate } from '~/app/helpers/formatterDate.helper';
export default defineComponent({
  props: {
    selectRemarks: {
      type: Array,
      required: false,
      default: () => [],
    },
    debt: { type: Number, required: false, default: 0 },
    paid: { type: Number, required: false, default: 0 },
    balance: { type: Number, required: false, default: 0 },
  },
  setup(props, { emit, root: { $api } }) {
    const filter = reactive({
      debtArticle: null,
      billName: '',
      dateRange: {
        before: new Date(),
        after: new Date(),
      },
      showDetail: true,
      inclBalance: true,
      billDate: new Date(),
    });
    const showDialog = ref(false);
    const articlePrep = usePrepare<any[]>(
      true,
      () => $api.accountReceivable.getPrepareARSubledger({ artno: 0 }),
      undefined,
      (tempData) => mapWithBezeich(tempData, 'artnr'),
      []
    );

    function onSubmit() {
      const article = articlePrep.data.raw.find(
        (it) => it.artnr === filter.debtArticle
      );
      const params = {
        tArtnr: article.artnr,
        tArtart: article.artArt,
        fromName: article.billName || ' ',
        detail: filter.showDetail,
        incl: filter.inclBalance,
        frDate: formatterDate(filter.dateRange.after, false),
        toDate: formatterDate(filter.dateRange.before, false),
        Bdate: formatterDate(filter.billDate, false),
        tDept: article.bezeich,
        toName: 'zz',
      };
      emit('search', params);
    }

    function toggleDialog(state) {
      showDialog.value = state;
    }

    function setGuestName(guest) {
      filter.billName = guest.gname;
    }

    return {
      ...toRefs(filter),
      showDialog,
      toggleDialog,
      articlePrep,
      setGuestName,
      onSubmit,
    };
  },
  components: {
    DialogSelectGuest: () => import('./DialogSelectGuest.vue'),
  },
});
</script>
