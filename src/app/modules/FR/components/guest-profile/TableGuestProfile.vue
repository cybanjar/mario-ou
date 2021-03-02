<template>
  <div>
    <STable
      row-key="$_index"
      :class="
        rows.length > 0 &&
        (type === GuestProfileType.Individual
          ? 'guest-profile-table-individual'
          : 'guest-profile-table-company-agent')
      "
      :loading="isFetching"
      :columns="tableHeaders"
      :data="rowsWithIndex"
      :selected.sync="selected"
      @row-click="onRowClick"
      :rows-per-page-options="[10, 13, 16, 30]"
      :pagination="{ rowsPerPage: 30 }"
    >
      <template #header-cell-contract-rate="props">
        <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
      </template>

      <template #body-cell-contract-rate="props">
        <q-td :props="props" class="fixed-col left">
          <div>{{ props.value }}</div>
        </q-td>
      </template>

      <template #header-cell-company-number="props">
        <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
      </template>

      <template #body-cell-company-number="props">
        <q-td :props="props" class="fixed-col left">
          <div>{{ props.value }}</div>
        </q-td>
      </template>

      <template #header-cell-steuernr="props">
        <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
      </template>

      <template #body-cell-steuernr="props">
        <q-td :props="props" class="fixed-col left">
          <div>{{ props.value }}</div>
        </q-td>
      </template>

      <template #header-cell-name="props">
        <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
      </template>

      <template #body-cell-name="props">
        <q-td :props="props" class="fixed-col left">
          <div>{{ props.value }}</div>
        </q-td>
      </template>

      <template #header-cell-actions="props">
        <q-th :props="props" class="fixed-col right">
          {{ props.col.label }}
        </q-th>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="fixed-col right">
          <q-icon name="mdi-dots-vertical" size="16px">
            <q-menu auto-close anchor="bottom right" self="top right">
              <q-list>
                <template v-if="type !== GuestProfileType.Individual">
                  <q-item
                    clickable
                    v-ripple
                    @click="
                      $router.push(
                        `/fr/extra/guest-profile-view-rates/${props.row.gastnr}`
                      )
                    "
                  >
                    <q-item-section>View Contract Rate</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-ripple
                    @click="dialogAttachContractRate.open(props.row.gastnr)"
                  >
                    <q-item-section>Attach Contract Rate</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>Contact Detail</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>Global Reservation</q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-ripple
                    @click="dialogCreateAllotment.open(props.row)"
                  >
                    <q-item-section>Create Allotment</q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-ripple
                    @click="
                      $router.push(
                        `/fr/extra/view-allotment/${props.row.gastnr}`
                      )
                    "
                  >
                    <q-item-section>View Allotment</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-ripple
                    @click="
                      $router.push(
                        `/fr/extra/manage-reservation/${props.row.gastnr}`
                      )
                    "
                  >
                    <q-item-section>Manage Reservation</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item
                    clickable
                    v-ripple
                    @click="dialogContactPersonCompany.open(props.row.gastnr)"
                  >
                    <q-item-section>Contact Person</q-item-section>
                  </q-item>
                </template>

                <q-item
                  v-if="type === GuestProfileType.Individual"
                  clickable
                  v-ripple
                  @click="dialogContactPersonIndividual.open(props.row.gastnr)"
                >
                  <q-item-section>Contact Person</q-item-section>
                </q-item>

                <q-item
                  clickable
                  v-ripple
                  @click="dialogGuestInformation.open(props.row.gastnr)"
                >
                  <q-item-section>Guest Information</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="
                    $router.push(
                      `/fr/extra/guest-profile-history/${props.row.gastnr}`
                    )
                  "
                >
                  <q-item-section>Guest History</q-item-section>
                </q-item>

                <q-separator />

                <q-item
                  clickable
                  v-ripple
                  @click="dialogSelectGuest.open(props.row)"
                >
                  <q-item-section>Merge Guest Profile</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="dialogChangeType.open(props.row)"
                >
                  <q-item-section>Change Guest Profile Type</q-item-section>
                </q-item>

                <q-separator />

                <q-item
                  clickable
                  v-ripple
                  @click="showDialogViewModify(props.row)"
                >
                  <q-item-section>View / Modify</q-item-section>
                </q-item>
                <q-item clickable v-ripple @click="onDelete(props.row.gastnr)">
                  <q-item-section>Delete</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </q-td>
      </template>
    </STable>

    <DialogAttachContractRate
      :show.sync="dialogAttachContractRate.state.show"
      :key="dialogAttachContractRate.state.key"
      :guest-number="dialogAttachContractRate.state.data"
    />

    <DialogCreateAllotment
      :show.sync="dialogCreateAllotment.state.show"
      :key="dialogCreateAllotment.state.key"
      :guest-number="dialogCreateAllotment.state.data.gastnr"
      :guest-name="dialogCreateAllotment.state.data.gname"
    />

    <DialogContactPersonIndividual
      :show.sync="dialogContactPersonIndividual.state.show"
      :key="dialogContactPersonIndividual.state.key"
      :guest-number="dialogContactPersonIndividual.state.data"
    />

    <DialogContactPersonCompany
      :show.sync="dialogContactPersonCompany.state.show"
      :key="dialogContactPersonCompany.state.key"
      :guest-number="dialogContactPersonCompany.state.data"
    />

    <DialogGuestInformation
      :show.sync="dialogGuestInformation.state.show"
      :key="dialogGuestInformation.state.key"
      :guest-number="dialogGuestInformation.state.data"
    />

    <DialogChangeGuestProfileType
      :show.sync="dialogChangeType.state.show"
      :key="dialogChangeType.state.key"
      :data="dialogChangeType.state.data"
    />

    <DialogSelectGuest
      :show.sync="dialogSelectGuest.state.show"
      :key="dialogSelectGuest.state.key"
      :merge-guest-profile="dialogSelectGuest.state.data"
      :guest-profile-type="type"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  PropType,
  inject,
} from '@vue/composition-api';
import { useSelectedRow } from '../../composables/selectedRow';
import {
  tableHeadersIndividual,
  tableHeadersCompany,
  tableHeadersAgent,
} from '../../tables/guest-profile/guestProfile.table';
import {
  GuestProfileType,
  GuestProfile,
  guestProfileListKey,
} from '../../models/guest-profile/guestProfile.model';
import { useDisposableDialog } from '../../composables/disposableDialog';

export default defineComponent({
  components: {
    DialogAttachContractRate: () => import('./DialogAttachContractRate.vue'),
    DialogContactPersonIndividual: () =>
      import('./DialogContactPersonIndividual.vue'),
    DialogContactPersonCompany: () =>
      import('./DialogContactPersonCompany.vue'),
    DialogCreateAllotment: () => import('./DialogCreateAllotment.vue'),
    DialogGuestInformation: () => import('./DialogGuestInformation.vue'),
    DialogChangeGuestProfileType: () =>
      import('./DialogChangeGuestProfileType.vue'),
    DialogSelectGuest: () => import('../common/DialogSelectGuest.vue'),
  },
  props: {
    type: { type: Number, required: true },
    isFetching: { type: Boolean, default: false },
    rows: { type: Array as PropType<GuestProfile[]>, required: true },
    selectedRow: { type: Object as PropType<GuestProfile>, default: null },
    totalRecord: { type: Number, default: 0 },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const tableHeaders = ref<any[]>(tableHeadersIndividual);
    const { rowsWithIndex, selected, onRowClick } = useSelectedRow(props, emit);

    watch(
      () => props.type,
      (curr) => {
        if (curr === GuestProfileType.Individual) {
          tableHeaders.value = tableHeadersIndividual;
        } else if (curr === GuestProfileType.Company) {
          tableHeaders.value = tableHeadersCompany;
        } else if (curr === GuestProfileType.TravelAgent) {
          tableHeaders.value = tableHeadersAgent;
        }
      }
    );

    const { SHOW_DIALOG_GUEST_PROFILE } = inject(guestProfileListKey);
    function showDialogViewModify(data: GuestProfile) {
      SHOW_DIALOG_GUEST_PROFILE({
        type: data.karteityp,
        guestNumber: data.gastnr,
      });
    }

    function onDelete(guestNumber: number) {
      $q.loading.show();
      $api.frontOfficeReception
        .deleteGuestProfile(guestNumber, props.totalRecord)
        .then((message) => {
          $q.loading.hide();
          if (message) $q.notify({ type: 'positive', message });
        });
    }

    return {
      GuestProfileType,
      tableHeaders,
      rowsWithIndex,
      selected,
      onRowClick,
      showDialogViewModify,
      onDelete,
      dialogAttachContractRate: useDisposableDialog<number>(null),
      dialogChangeType: useDisposableDialog<GuestProfile>(null),
      dialogGuestInformation: useDisposableDialog<number>(null),
      dialogContactPersonCompany: useDisposableDialog<number>(null),
      dialogContactPersonIndividual: useDisposableDialog<number>(null),
      dialogCreateAllotment: useDisposableDialog({} as GuestProfile),
      dialogSelectGuest: useDisposableDialog<GuestProfile>(null),
    };
  },
});
</script>

<style lang="scss" scoped>
.guest-profile-table-individual::v-deep {
  tr td:first-child > div {
    width: 20px;
  }

  tr th:nth-child(2),
  tr td:nth-child(2) {
    left: 45px !important;
  }

  tr td:nth-child(2) > div {
    width: 250px;
    white-space: normal;
  }
}

.guest-profile-table-company-agent::v-deep {
  tr td:first-child > div {
    width: 20px;
  }

  tr th:nth-child(2),
  tr td:nth-child(2) {
    left: 45px !important;
  }

  tr td:nth-child(2) > div {
    width: 150px;
  }

  tr th:nth-child(3),
  tr td:nth-child(3) {
    left: 213px !important;
  }

  tr td:nth-child(3) > div {
    width: 150px;
  }

  tr th:nth-child(4),
  tr td:nth-child(4) {
    left: 381px !important;
  }

  tr td:nth-child(4) > div {
    white-space: normal;
    width: 250px;
  }
}
</style>
