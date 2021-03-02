<template>
  <q-page>
    <q-drawer side="left" bordered :width="250" :value="true" persistent>
      <q-form class="q-pa-md">
        <SSelect
          v-model="type"
          label-text="Reservation Status"
          :options="selectOptions"
          emit-value
          map-options
        />

        <RemarkContent
          label="Reservation Name & Address"
          type="textarea"
          class="q-mt-lg"
        >
          <template v-if="prepareData">
            <span>
              {{
                `${prepareData.name} ${prepareData.vorname1} ${prepareData.anredefirma} ${prepareData.anrede1}`
              }}
              <br /><br />
              {{ `${prepareData.adresse1} ${prepareData.adresse2}` }}
              <br /><br />
              {{
                `${prepareData.land} ${prepareData.wohnort} ${prepareData.plz}`
              }}
            </span>
          </template>
        </RemarkContent>

        <RemarkContent label="Reservation Remark">
          <template
            #default
            v-if="selectedReservationData && selectedReservationMember"
          >
            {{ selectedReservationData.bemerk }}
            <br /><br />
            {{ selectedReservationMember.bemerk }}
          </template>
          <template #icon v-if="selectedReservationMember">
            <q-btn
              flat
              round
              padding="none"
              @click="dialogReservationRemark.open()"
            >
              <q-icon name="mdi-pencil" size="20px" color="primary" />
            </q-btn>
          </template>
        </RemarkContent>
      </q-form>
    </q-drawer>

    <div class="q-pa-lg">
      <SharedModuleActions
        :actions="[
          { name: 'Allotment', position: 'prefix' },
          { name: 'Add', position: 'prefix' },
        ]"
        @onActions="onActions"
      />

      <div class="row q-col-gutter-x-md">
        <div class="col-5">
          <TableReservationList
            :rows="reservationListRows"
            :selected-row.sync="selectedReservationData"
            :is-fetching="isFetching"
          />
        </div>

        <div class="col-7">
          <TableReservationMember
            :rows="reservationMemberRows"
            :selected-row.sync="selectedReservationMember"
            :is-fetching="isFetching"
          />
        </div>
      </div>
    </div>

    <DialogReservationRemark
      :show.sync="dialogReservationRemark.state.show"
      :key="dialogReservationRemark.state.key"
      :resnr="selectedReservationMember && selectedReservationMember.resnr"
      :reslinnr="
        selectedReservationMember && selectedReservationMember.reslinnr
      "
      @newData="onReservationRemarkNewData"
    />
  </q-page>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  watch,
} from '@vue/composition-api';
import RemarkContent from './components/common/RemarkContent.vue';
import { useDisposableDialog } from './composables/disposableDialog';
import { ReservationRemark } from './models/common/dialogReservationRemark.model';
import {
  PrepareManageReservation,
  ReservationListData,
  ReservationMemberData,
  ReservationType,
} from './models/extra/manage-reservation/manageReservation.model';

export default defineComponent({
  components: {
    RemarkContent,
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
    TableReservationList: () =>
      import('./components/extra/manage-reservation/TableReservationList.vue'),
    TableReservationMember: () =>
      import(
        './components/extra/manage-reservation/TableReservationMember.vue'
      ),
    DialogReservationRemark: () =>
      import('./components/common/DialogReservationRemark.vue'),
  },
  setup(_, { root: { $api, $route, $router } }) {
    const selectOptions = [
      { label: 'All', value: ReservationType.All },
      { label: 'Reservation', value: ReservationType.Reservation },
      { label: 'In-House', value: ReservationType.InHouse },
      { label: 'Arrival Today', value: ReservationType.ArrivalToday },
    ];

    const state = reactive({
      isFetching: false,
      prepareData: null as PrepareManageReservation,
      reservationListData: [] as ReservationListData[],
      reservationMemberData: [] as ReservationMemberData[],
      selectedReservationData: null as ReservationListData,
      selectedReservationMember: null as ReservationMemberData,
      type: ReservationType.All,
    });

    async function getData() {
      state.isFetching = true;

      const [resPrepareData, resReservationListData] = await Promise.all([
        $api.frontOfficeReception.prepareManageReservation(
          Number($route.params.id)
        ),
        $api.frontOfficeReception.reservationList(Number($route.params.id)),
      ]);
      state.prepareData = resPrepareData;
      state.reservationListData = resReservationListData;

      state.isFetching = false;
    }

    getData();

    watch(
      () => state.selectedReservationData,
      async (newValue) => {
        if (newValue) {
          state.selectedReservationMember = null;
          state.isFetching = true;

          state.reservationMemberData = await $api.frontOfficeReception.reservationMember(
            Number($route.params.id),
            newValue.resnr
          );

          state.isFetching = false;
        }
      }
    );

    const reservationListRows = computed(() => {
      let data = state.reservationListData;

      if (state.type === ReservationType.Reservation) {
        data = state.reservationListData.filter((value) => value.arrival);
      } else if (state.type === ReservationType.InHouse) {
        data = state.reservationListData.filter((value) => value.resident);
      } else if (state.type === ReservationType.ArrivalToday) {
        data = state.reservationListData.filter((value) => value['arr-today']);
      }

      return data;
    });

    const reservationMemberRows = computed(() => {
      let data = state.reservationMemberData;

      if (state.type === ReservationType.Reservation) {
        data = state.reservationMemberData.filter(
          (value) => value.resstatus <= 5 || value.resstatus === 11
        );
      } else if (state.type === ReservationType.InHouse) {
        data = state.reservationMemberData.filter(
          (value) => value.resstatus === 6 || value.resstatus === 13
        );
      } else if (state.type === ReservationType.ArrivalToday) {
        data = state.reservationMemberData.filter(
          (value) => value.resstatus <= 5 || value.resstatus === 11
        );
      }

      data.sort(
        // Ref: https://stackoverflow.com/a/46256174
        (a, b) =>
          a.reslinnr - b.reslinnr ||
          a.zinr.localeCompare(b.zinr) ||
          a['kontakt-nr'] - b['kontakt-nr'] ||
          a.resstatus - b.resstatus
      );

      return data;
    });

    function onActions(actions: string) {
      switch (actions) {
        case 'onAdd':
          break;
        case 'onAllotment':
          $router.push(`/fr/extra/view-allotment/${$route.params.id}`);
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

    function onReservationRemarkNewData(data: ReservationRemark) {
      // Update selected row value
      state.selectedReservationData.bemerk = data.resCom;
      state.selectedReservationMember.bemerk = data.reslCom;

      // Update table row
      const reservationIndex = state.reservationListData.findIndex(
        (e) => e.resnr === state.selectedReservationData.resnr
      );
      state.reservationListData[reservationIndex].bemerk = data.resCom;

      const reservationMemberIndex = state.reservationMemberData.findIndex(
        (e) => e.reslinnr === state.selectedReservationMember.reslinnr
      );
      state.reservationMemberData[reservationMemberIndex].bemerk = data.reslCom;
    }

    return {
      ...toRefs(state),
      reservationListRows,
      reservationMemberRows,
      selectOptions,
      onActions,
      getData,

      dialogReservationRemark: useDisposableDialog(),
      onReservationRemarkNewData,
    };
  },
});
</script>
