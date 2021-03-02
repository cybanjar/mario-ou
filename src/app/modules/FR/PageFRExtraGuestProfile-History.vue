<template>
  <q-page>
    <q-drawer side="left" bordered :width="250" :value="true" persistent>
      <section class="mt-7 full-height">
        <template>
          <q-circular-progress
            v-if="isPreparing"
            indeterminate
            size="32px"
            color="primary"
            class="q-mt-md full-width"
          />
          <div v-else>
            <q-form class="q-pa-md" @submit="onSearch">
              <DateRangeInput
                label-text="Date"
                v-model="formData.date"
                position-fixed
              />

              <q-btn
                label="Search"
                no-caps
                color="primary"
                class="q-my-md full-width q-mt-lg"
                type="submit"
              />

              <RemarkContent
                label="History of"
                class="q-my-xl"
                :value="tTittle"
              />

              <RemarkContent
                label="Remark"
                readonly
                :value="selectedRow && selectedRow.bemerk"
              />
            </q-form>
          </div>
        </template>
      </section>
    </q-drawer>

    <div class="q-pa-lg">
      <SharedModuleActions
        :actions="[{ name: 'Add', position: 'prefix' }]"
        @onActions="onActions"
      />

      <TableGuestProfileHistory
        :rows="rows"
        :is-fetching="isFetching"
        :selected-row.sync="selectedRow"
        @openEditDialog="(data) => dialogGuestProfileHistory.open(data)"
      />

      <DialogGuestProfileHistory
        :show.sync="dialogGuestProfileHistory.state.show"
        :key="dialogGuestProfileHistory.state.key"
        :guest-profile-history-data="dialogGuestProfileHistory.state.data"
        :title-name="tTittle"
        @refetch="onSearch"
      />

      <DialogReservationList
        :show.sync="dialogReservationList.state.show"
        :key="dialogReservationList.state.key"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { date } from 'quasar';
import DateRangeInput from './components/common/DateRangeInput.vue';
import { useDisposableDialog } from './composables/disposableDialog';
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';
import RemarkContent from './components/common/RemarkContent.vue';
import { GuestProfileHistory } from './models/extra/guest-profile-guest-history/guestProfileGuestHistory.model';
import { Artikel } from './models/common/options.model';

export default defineComponent({
  components: {
    DateRangeInput,
    RemarkContent,
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
    TableGuestProfileHistory: () =>
      import(
        './components/extra/guest-profile-history/TableGuestProfileHistory.vue'
      ),
    DialogGuestProfileHistory: () =>
      import(
        './components/extra/guest-profile-history/DialogGuestProfileHistory.vue'
      ),
    DialogReservationList: () =>
      import(
        './components/extra/guest-profile-history/DialogReservationList.vue'
      ),
  },

  setup(_, { root: { $api, $route } }) {
    const formData = reactive({
      date: { start: new Date(), end: new Date() },
    });

    const state = reactive({
      isPreparing: true,
      isFetching: false,
      rows: [] as GuestProfileHistory[],
      selectedRow: null as GuestProfileHistory | null,
      tTittle: '',
    });

    $api.frontOfficeReception
      .prepareGuestProfileHistory(Number($route.params.id))
      .then((value) => {
        const startDate = `01/01/${new Date(value.fdate).getFullYear() - 3}`;
        formData.date.start = new Date(startDate);
        formData.date.end = new Date(value.fdate);
        state.tTittle = value.tTittle;
        state.isPreparing = false;
      });

    let paymentMethods: Artikel[];

    async function onSearch() {
      state.isFetching = true;

      if (!paymentMethods) {
        paymentMethods = await $api.frontOfficeReception.loadArtikel({
          caseType: 5,
          deptNo: 0,
        });
      }

      const tableRows = await $api.frontOfficeReception.searchGuestProfileHistory(
        {
          gastnr: $route.params.id,
          fdate: date.formatDate(formData.date.start, 'MM/DD/YY'),
          tdate: date.formatDate(formData.date.end, 'MM/DD/YY'),
        }
      );

      state.rows = tableRows.map((history) => {
        const paymentMethod = paymentMethods.find(
          (method) => method.artnr === history.zahlungsart
        );
        return {
          ...history,
          paymentMethod: paymentMethod?.bezeich ?? '',
        };
      });

      state.isFetching = false;
    }

    const dialogGuestProfileHistory = useDisposableDialog<GuestProfileHistory | null>(
      null
    );
    function onActions(actions: string) {
      switch (actions) {
        case 'onAdd':
          dialogGuestProfileHistory.open(null);
          break;
      }
    }

    const dialogReservationList = useDisposableDialog();
    useExtraMenu([
      {
        handler: () => dialogReservationList.open(),
        icon: 'FR/Icon-Reservation',
      },
    ]);

    return {
      ...toRefs(state),
      onActions,
      formData,
      onSearch,
      dialogGuestProfileHistory,
      dialogReservationList,
    };
  },
});
</script>
