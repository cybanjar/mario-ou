<template>
  <div>
    <h6 style="marginLeft: 20px; marginBlockStart: 1rem; marginBlockEnd: 1rem"><q-icon name="mdi-home"/>Home</h6>
    <h5 style="marginLeft: 20px; marginBlockStart: 1rem; marginBlockEnd: 1rem">Banquet</h5>
    <div class="row">
      <div class="col-3">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          vertical
          stretch
          style="marginLeft: 30px"
        >
          <q-tab name="RoomMeetingSetup" label="Room Meeting Setup" />
          <q-tab name="TableStyleSetup" label="Table Style Setup" />
          <q-tab name="RoomTableSetup" label="Room & Table Setup" />
          <q-tab name="SourceOfBookingSetup" label="Source Of Booking Setup" />
          <q-tab
            name="DepartementInstructionSetup"
            label="Departement Instruction Setup"
          />
          <q-tab
            name="DefaultIntructionSetup"
            label="Default Intruction Setup"
          />
          <q-tab name="MasterplanStatusSetup" label="Masterplan Status Setup" />
          <q-tab
            name="MarketSegmentGroupSetup"
            label="Market Segment Group Setup"
          />
          <q-tab
            name="MarketSegmentCodeSetup"
            label="Market Segment Code Setup"
          />
          <q-tab name="ReservationTypeSetup" label="Reservation Type Setup" />
          <q-tab name="CateringSetup" label="Catering Setup" />
          <q-tab name="EventPackageSetup" label="Event Package Setup" />
          <q-tab name="MasterplanTypeSetup" label="Masterplan Type Setup" />
        </q-tabs>
      </div>
      <q-separator vertical inset />
      <div class="col">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel class="q-pa-none" style="marginTop: -17px" name="RoomMeetingSetup">
            <PageRoomMeetingSetup />
          </q-tab-panel>

          <q-tab-panel class="q-pa-none" name="TableStyleSetup">
            <PageTableStyleSetup />
          </q-tab-panel>

          <q-tab-panel class="q-pa-none" name="RoomTableSetup">
            <PageRoomTableSetup />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="SourceOfBookingSetup">
            <PageSourceOfBookingSetup />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="DepartementInstructionSetup">
            <PageDepartementInstructionSetup />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="DefaultIntructionSetup">
            <PageDefaultIntructionSetup />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="MasterplanStatusSetup">
            <PageMasterplanStatusSetup />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="MarketSegmentGroupSetup">
            <PageMarketSegmentGroupSetup />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="MarketSegmentCodeSetup">
            <PageMarketSegmentCodeSetup />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="ReservationTypeSetup">
            <PageReservationTypeSetup />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="CateringSetup">
            <PageCateringSetup />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="EventPackageSetup">
            <PageEventPackageSetup />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="MasterplanTypeSetup">
            <PageMasterplanTypeSetup />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
} from '@vue/composition-api';
export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      tab: 'DepartementInstructionSetup',
      splitterModel: 20,
    });

    onMounted(() => {
      console.log('halo');
    });

    return { ...toRefs(state) };
  },
  components: {
    PageRoomMeetingSetup: () => import('./PageSTReportRoomMeetingSetup.vue'),
    PageTableStyleSetup: () => import('./PageSTReportTableStyleSetup.vue'),
    PageRoomTableSetup: () => import('./PageSTReportRoomTableSetup.vue'),
    PageSourceOfBookingSetup: () =>
      import('./PageSTReportSourceOfBookingSetup.vue'),
    PageDepartementInstructionSetup: () =>
      import('./PageSTReportDepartementInstructionSetup.vue'),
    PageDefaultIntructionSetup: () =>
      import('./PageSTReportDefaultIntructionSetup.vue'),
    PageMasterplanStatusSetup: () =>
      import('./PageSTReportMasterplanStatusSetup.vue'),
    PageMarketSegmentGroupSetup: () =>
      import('./PageSTReportMarketSegmentGroupSetup.vue'),
    PageMarketSegmentCodeSetup: () =>
      import('./PageSTReportMarketSegmentCodeSetup.vue'),
    PageReservationTypeSetup: () =>
      import('./PageSTReportReservationTypeSetup.vue'),
    PageCateringSetup: () => import('./PageSTReportCateringSetup.vue'),
    PageEventPackageSetup: () => import('./PageSTReportEventPackageSetup.vue'),
    PageMasterplanTypeSetup: () =>
      import('./PageSTReportMasterplanTypeSetup.vue'),
  },
});
</script>

<style lang="scss" scoped>
.q-tab {
  padding: 0 16px;
  min-height: 36px;
  transition: color 0.3s, background-color 0.3s;
  text-transform: uppercase;
  white-space: nowrap;
  color: inherit;
  text-decoration: none;
}

.justify-center,
.flex-center {
  justify-content: left;
}
</style>
