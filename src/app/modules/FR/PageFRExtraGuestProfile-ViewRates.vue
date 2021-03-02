<template>
  <q-page>
    <q-drawer side="left" bordered :width="250" :value="true" persistent>
      <section class="mt-7 full-height">
        <q-circular-progress
          v-if="isPreparing"
          indeterminate
          size="32px"
          color="primary"
          class="q-mt-md full-width"
        />
        <template v-else>
          <q-form class="q-pa-md" @submit="onSearch">
            <SSelect label-text="Customer Name" :value="customerName" disable />
            <q-btn
              block
              color="primary"
              max-height="28"
              label="Search"
              class="q-my-md full-width"
              type="submit"
            />
          </q-form>

          <q-separator />

          <div class="q-pa-md">
            <SInput
              label-text="Remark"
              type="textarea"
              readonly
              :rows="8"
              :value="remark"
            />
          </div>
        </template>
      </section>
    </q-drawer>

    <div class="q-pa-lg">
      <SharedModuleActions />
      <TableGuestProfileViewRates :is-fetching="isFetching" :rows="tableRows" />
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { TableViewRates } from './models/extra/guest-profile-view-rates/guestProfileViewRates.model';

export default defineComponent({
  components: {
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
    TableGuestProfileViewRates: () =>
      import(
        './components/extra/guest-profile-view-rates/TableGuestProfileViewRates.vue'
      ),
  },
  setup(_, { root: { $api, $route } }) {
    const state = reactive({
      isPreparing: true,
      isFetching: false,
      customerName: null as string,
      remark: null as string,
      tableRows: [] as TableViewRates[],
    });

    const guestNumber = Number($route.params.id);

    $api.frontOfficeReception.readGuest(guestNumber).then((guest) => {
      state.isPreparing = false;
      state.customerName = guest.name;
    });

    async function onSearch() {
      state.isFetching = true;
      const code = await $api.frontOfficeReception.readGuestPr(guestNumber);

      if (!code) {
        state.isFetching = false;
        return;
      }

      const {
        remark,
        viewRates,
        viewRatesDetail,
      } = await $api.frontOfficeReception.viewRateCode({
        pvILanguage: 0,
        gastnr: guestNumber,
        prCode: code,
        marketCombo: 'ALL MARKET',
      });
      state.isFetching = false;
      state.remark = remark;
      state.tableRows = viewRates.map((item) => {
        const details = viewRatesDetail.filter(
          (detail) =>
            detail.prcode === item.prcode && detail.rmtype === item.rmtype
        );
        return { ...item, details };
      });
    }

    onSearch();

    return {
      ...toRefs(state),
      onSearch,
    };
  },
});
</script>
