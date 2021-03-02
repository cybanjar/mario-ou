<template>
  <q-page>
    <q-drawer side="left" bordered :width="250" :value="true" persistent>
      <SearchGuestProfile @search="onSearch" :type.sync="guestProfileType" />
    </q-drawer>

    <div class="q-pa-md">
      <SharedModuleActions
        @onActions="onActions"
        :actions="[{ name: 'Add', position: 'prefix' }]"
      />

      <TableGuestProfile
        :is-fetching="isFetching"
        :type="guestProfileType"
        :rows="tableRows"
        :selected-row.sync="selectedRow"
        :total-record="totalRecord"
      />
    </div>

    <DialogCleanUpGuestProfile
      :show.sync="dialogCleanUpGuestProfile.state.show"
      :key="dialogCleanUpGuestProfile.state.key"
    />

    <DialogGuestProfile
      :show.sync="dialogGuestProfile.state.show"
      :key="dialogGuestProfile.state.key"
      :type="dialogGuestProfile.state.data.type"
      :guest-number="dialogGuestProfile.state.data.guestNumber"
    />
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  reactive,
  toRefs,
} from '@vue/composition-api';
import {
  ReqSearchGuestProfile,
  GuestProfile,
  GuestProfileType,
  SearchBy,
  guestProfileListKey,
} from './models/guest-profile/guestProfile.model';
import type { SearchGuestProfile } from './components/guest-profile/SearchGuestProfile.vue';
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';
import { Artikel } from './models/common/options.model';
import { useDisposableDialog } from './composables/disposableDialog';
import { DialogGuestProfileProps } from './models/common/dialogGuestProfile.model';

export default defineComponent({
  components: {
    SearchGuestProfile: () =>
      import('./components/guest-profile/SearchGuestProfile.vue'),
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
    DialogGuestProfile: () =>
      import('./components/common/DialogGuestProfile.vue'),
    TableGuestProfile: () =>
      import('./components/guest-profile/TableGuestProfile.vue'),
    DialogCleanUpGuestProfile: () =>
      import('./components/guest-profile/DialogCleanUpGuestProfile.vue'),
  },

  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      guestProfileType: GuestProfileType.Individual as GuestProfileType,
      tableRows: [] as GuestProfile[],
      selectedRow: null as GuestProfile | null,
      totalRecord: 0,
    });

    let paymentMethods: Artikel[];
    let requestData: ReqSearchGuestProfile;
    let latestSearches: SearchGuestProfile;

    async function onSearch(searches: SearchGuestProfile) {
      latestSearches = searches;

      let lName = '';
      let fName = '';

      if (state.guestProfileType === GuestProfileType.Individual) {
        lName = searches.name;
        fName = searches.firstName;
      } else if (state.guestProfileType === GuestProfileType.Company) {
        lName = searches.companyName;
        fName = searches.companyTitle;
      } else if (state.guestProfileType === GuestProfileType.TravelAgent) {
        lName = searches.agentName;
        fName = searches.agentTitle;
      }

      requestData = {
        caseType: 1,
        sorttype: state.guestProfileType,
        lname: lName || ' ',
        fname: fName || ' ',
        num1: 0,
      };

      getData();
    }

    async function getData() {
      state.isFetching = true;

      const {
        data,
        totalRecord,
      } = await $api.frontOfficeReception.searchGuestProfile(requestData);

      let tempTableRows = data;
      state.totalRecord = totalRecord;

      if (state.guestProfileType !== GuestProfileType.Individual) {
        if (!paymentMethods) {
          paymentMethods = await $api.frontOfficeReception.loadArtikel({
            caseType: 5,
            deptNo: 0,
          });
        }

        tempTableRows = tempTableRows.map((guestProfile) => {
          const paymentMethod = paymentMethods.find(
            (method) => method.artnr === guestProfile.zahlungsart
          );
          return {
            ...guestProfile,
            paymentMethod: paymentMethod?.bezeich ?? '',
          };
        });
      }

      /**
       * TODO:
       * Some field for filter unavailable on issue ticket
       * Unavailable Filter = 3, 7, 10
       * Refer to : ~/app/modules/FR/models/guest-profile/guestProfile.model Line: 11 - 22
       * Refer to : ~/app/modules/FR/components/guest-profile/SearchGuestProfile.vue Line: 228 - 254
       */

      state.tableRows = tempTableRows.filter((value) => {
        if (latestSearches.searchBy === SearchBy.GuestNumber) {
          return String(value.gastnr).includes(
            String(latestSearches.guestNumber)
          );
        } else if (latestSearches.searchBy === SearchBy.CompanyNumber) {
          return String(value.gastnr).includes(
            String(latestSearches.companyNumber)
          );
        } else if (latestSearches.searchBy === SearchBy.TravelAgentNumber) {
          return String(value.gastnr).includes(
            String(latestSearches.agentNumber)
          );
        } else if (latestSearches.searchBy === SearchBy.GuestIDCard) {
          return value['ausweis-nr1'].includes(latestSearches.guestIdCard);
        } else {
          return true;
        }
      });

      state.isFetching = false;
    }

    /* Dialog setup */
    const dialogGuestProfile = useDisposableDialog<DialogGuestProfileProps>({
      guestNumber: null,
      type: state.guestProfileType,
    });
    /* End Dialog setup */

    provide(guestProfileListKey, {
      GET_GUEST_PROFILE_LIST: getData,
      SHOW_DIALOG_GUEST_PROFILE: dialogGuestProfile.open,
    });

    const dialogCleanUpGuestProfile = useDisposableDialog();

    useExtraMenu([
      {
        handler: () => dialogCleanUpGuestProfile.open(),
        icon: 'FR/Icon-CleanUpGuestProfileData',
      },
    ]);

    function onActions(actions: string) {
      switch (actions) {
        case 'onAdd':
          dialogGuestProfile.open({
            guestNumber: null,
            type: state.guestProfileType,
          });
          break;
        case 'onRefresh':
          getData();
          break;
        case 'onPrint':
          // TODO: put print logic here
          break;
        default:
          break;
      }
    }

    return {
      ...toRefs(state),
      onActions,
      onSearch,
      GuestProfileType,
      dialogCleanUpGuestProfile,
      dialogGuestProfile,
    };
  },
});
</script>
