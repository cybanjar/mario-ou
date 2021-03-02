<template>
  <section class="mt-7 full-height">
    <div class="q-pa-md">
      <q-form @submit="onSearch">
        <q-option-group
          :options="guestProfileTypeOptions"
          label="Reservation Type"
          type="radio"
          v-model="guestProfileType"
        />

        <SSelect
          label-text="Search By"
          :options="searchByOptions"
          v-model="searchBy"
          class="q-mt-md"
          emit-value
          map-options
        />

        <template v-if="guestProfileType === GuestProfileType.Individual">
          <template v-if="searchBy === SearchBy.GuestName">
            <SInput label-text="Name" v-model="formDataIndividual.name" />
            <SInput
              label-text="First Name"
              v-model="formDataIndividual.firstName"
            />
          </template>

          <template v-if="searchBy === SearchBy.GuestNumber">
            <SInput
              label-text="Guest Number"
              v-model.number="formDataIndividual.guestNumber"
            />
          </template>

          <template v-if="searchBy === SearchBy.GuestNumberCard">
            <SInput
              label-text="Membership Card Number"
              v-model.number="formDataIndividual.guestMembershipCardNumber"
            />
          </template>

          <template v-if="searchBy === SearchBy.GuestIDCard">
            <SInput
              label-text="ID Card Number"
              v-model.number="formDataIndividual.guestIdCard"
            />
          </template>
        </template>

        <template v-if="guestProfileType === GuestProfileType.Company">
          <template v-if="searchBy === SearchBy.CompanyName">
            <SInput
              label-text="Company Name"
              v-model="formDataCompany.companyName"
            />
            <SInput
              label-text="Company Title"
              v-model="formDataCompany.companyTitle"
            />
          </template>

          <template v-if="searchBy === SearchBy.CompanyNumber">
            <SInput
              label-text="Company Number"
              v-model.number="formDataCompany.companyNumber"
            />
          </template>

          <template v-if="searchBy === SearchBy.CompanyMembershipCard">
            <SInput
              label-text="Membership Card Number"
              v-model.number="formDataCompany.companyMembershipCardNumber"
            />
          </template>
        </template>

        <template v-if="guestProfileType === GuestProfileType.TravelAgent">
          <template v-if="searchBy === SearchBy.TravelAgentName">
            <SInput label-text="Agent Name" v-model="formDataAgent.agentName" />
            <SInput
              label-text="Agent Title"
              v-model="formDataAgent.agentTitle"
            />
          </template>

          <template v-if="searchBy === SearchBy.TravelAgentNumber">
            <SInput
              label-text="Agent Number"
              v-model.number="formDataAgent.agentNumber"
            />
          </template>

          <template v-if="searchBy === SearchBy.TravelAgentMembershipCard">
            <SInput
              label-text="Membership Card Number"
              v-model.number="formDataAgent.agentMembershipCardNumber"
            />
          </template>
        </template>
        <q-btn
          block
          color="primary"
          max-height="28"
          label="Search"
          class="q-my-md full-width"
          type="submit"
        />
      </q-form>

      <SRemarkLeftDrawer
        v-if="guestProfileType === GuestProfileType.Individual"
        label="Number of Stay"
      />
      <SRemarkLeftDrawer label="Guest Remark" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import {
  GuestProfileType,
  SearchBy,
} from '../../models/guest-profile/guestProfile.model';

export interface SearchGuestProfile {
  name?: string;
  firstName?: string;
  guestNumber?: number | null;
  guestMembershipCardNumber?: number | null;
  guestIdCard?: string;
  companyName?: string;
  companyTitle?: string;
  companyNumber?: number | null;
  companyMembershipCardNumber?: number | null;
  agentName?: string;
  agentTitle?: string;
  agentNumber?: number | null;
  agentMembershipCardNumber?: number | null;
  searchBy?: SearchBy;
}

export default defineComponent({
  props: {
    type: { type: Number, required: true },
  },
  setup(props, { emit }) {
    const guestProfileTypeOptions = [
      { value: GuestProfileType.Individual, label: 'Individual' },
      { value: GuestProfileType.Company, label: 'Company' },
      { value: GuestProfileType.TravelAgent, label: 'Travel Agent' },
    ];
    const searchByOptions = ref([
      { value: SearchBy.GuestName, label: 'Guest Name' },
      { value: SearchBy.GuestNumber, label: 'Guest Number' },
      { value: SearchBy.GuestNumberCard, label: 'Guest Number Card' },
      { value: SearchBy.GuestIDCard, label: 'Guest ID Card' },
    ]);
    const guestProfileType = useModelWrapper(props, emit, 'type');
    const searchBy = ref(SearchBy.GuestName);
    const formDataIndividual = reactive<SearchGuestProfile>({
      name: '',
      firstName: '',
      guestNumber: 0,
      guestMembershipCardNumber: null,
      guestIdCard: '',
    });
    const formDataCompany = reactive<SearchGuestProfile>({
      companyName: '',
      companyTitle: '',
      companyNumber: 0,
      companyMembershipCardNumber: 0,
    });
    const formDataAgent = reactive<SearchGuestProfile>({
      agentName: '',
      agentTitle: '',
      agentNumber: 0,
      agentMembershipCardNumber: 0,
    });

    watch(
      guestProfileType,
      (curr) => {
        if (curr === GuestProfileType.Individual) {
          searchBy.value = SearchBy.GuestName;
          searchByOptions.value = [
            { value: SearchBy.GuestName, label: 'Guest Name' },
            { value: SearchBy.GuestNumber, label: 'Guest Number' },
            { value: SearchBy.GuestNumberCard, label: 'Guest Number Card' },
            { value: SearchBy.GuestIDCard, label: 'Guest ID Card' },
          ];
        } else if (curr === GuestProfileType.Company) {
          searchBy.value = SearchBy.CompanyName;
          searchByOptions.value = [
            { value: SearchBy.CompanyName, label: 'Company Name' },
            { value: SearchBy.CompanyNumber, label: 'Company Number' },
            {
              value: SearchBy.CompanyMembershipCard,
              label: 'Company Membership Card',
            },
          ];
        } else if (curr === GuestProfileType.TravelAgent) {
          searchBy.value = SearchBy.TravelAgentName;
          searchByOptions.value = [
            { value: SearchBy.TravelAgentName, label: 'Agent Name' },
            { value: SearchBy.TravelAgentNumber, label: 'Agent Number' },
            {
              value: SearchBy.TravelAgentMembershipCard,
              label: 'Agent Membership Card',
            },
          ];
        }
        onSearch();
      },
      { immediate: true }
    );

    watch([guestProfileType, searchBy], () => {
      formDataIndividual.name = '';
      formDataIndividual.firstName = '';
      formDataIndividual.guestNumber = 0;
      formDataIndividual.guestMembershipCardNumber = null;
      formDataIndividual.guestIdCard = '';
      formDataCompany.companyName = '';
      formDataCompany.companyTitle = '';
      formDataCompany.companyNumber = 0;
      formDataCompany.companyMembershipCardNumber = 0;
      formDataAgent.agentName = '';
      formDataAgent.agentTitle = '';
      formDataAgent.agentNumber = 0;
      formDataAgent.agentMembershipCardNumber = 0;
    });

    function onSearch() {
      if (guestProfileType.value === GuestProfileType.Individual) {
        emit('search', { ...formDataIndividual, searchBy: searchBy.value });
      } else if (guestProfileType.value === GuestProfileType.Company) {
        emit('search', { ...formDataCompany, searchBy: searchBy.value });
      } else if (guestProfileType.value === GuestProfileType.TravelAgent) {
        emit('search', { ...formDataAgent, searchBy: searchBy.value });
      }
    }

    return {
      formDataAgent,
      formDataCompany,
      formDataIndividual,
      guestProfileType,
      guestProfileTypeOptions,
      onSearch,
      searchBy,
      searchByOptions,
      GuestProfileType,
      SearchBy,
    };
  },
});
</script>
