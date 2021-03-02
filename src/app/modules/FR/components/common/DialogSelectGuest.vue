<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Guest Name</span>
      </div>

      <div class="dialog__body">
        <div class="bg-white q-pa-lg">
          <q-form @submit="onSearch" class="row items-end q-mb-md">
            <div class="col-3">
              <SInput
                label-text="Search Guest"
                v-model="guestName"
                input-classes="q-mb-none"
              >
                <template>
                  <q-btn
                    icon="mdi-magnify"
                    size="xs"
                    dense
                    color="primary"
                    class="dialog__search-btn q-px-xs"
                    type="submit"
                    unelevated
                  />
                </template>
              </SInput>
            </div>

            <q-btn
              flat
              round
              v-if="addButton"
              class="q-ml-lg"
              @click="dialogGuestProfile.open()"
            >
              <img
                class="q-mt-sm"
                :src="require('~/app/icons/Icon-Add.svg')"
                height="25"
              />
            </q-btn>
          </q-form>
          <STable
            :columns="tableHeaderGuestName"
            :data="rowsWithIndex"
            :selected="selected"
            :loading="isFetching"
            row-key="$_index"
            style="max-height: 265px"
            @row-click="onRowClick"
            :key="rowsWithIndex[0] && rowsWithIndex[0].gastnr"
            no-pagination
            class="sticky-header"
          />
          <div class="row q-gutter-x-xl justify-center q-mt-lg">
            <q-radio
              dense
              v-model="type"
              :val="GuestProfileType.Individual"
              label="Individual"
            />
            <q-radio
              dense
              v-model="type"
              :val="GuestProfileType.Company"
              label="Company"
            />
            <q-radio
              dense
              v-model="type"
              :val="GuestProfileType.TravelAgent"
              label="Travel Agent"
            />
          </div>
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn
          outline
          label="Cancel"
          color="primary"
          class="q-mr-sm"
          v-close-popup
        />
        <q-btn
          @click="mergeGuestProfile ? onMergeGuestProfile() : onSelectGuest()"
          label="OK"
          color="primary"
        />
      </div>
    </div>
    <DialogGuestProfile
      :show.sync="dialogGuestProfile.state.show"
      :key="dialogGuestProfile.state.key"
      :type="type"
    />
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  watch,
  PropType,
} from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { TableHeader } from '~/components/VhpUI/typings';
import {
  GuestProfileType,
  GuestProfile,
} from '../../models/guest-profile/guestProfile.model';
import { SelectGuest } from '../../models/common/selectGuest.model';
import { useDirectSelectedRow } from '../../composables/selectedRow';
import { useDisposableDialog } from '../../composables/disposableDialog';

const tableHeaderGuestName: TableHeader<SelectGuest>[] = [
  {
    label: 'Guest Number',
    field: 'gastnr',
    name: 'gastnr',
    sortable: true,
  },
  {
    label: 'Guest Name',
    align: 'left',
    field: 'name',
    name: 'name',
    format: (_, row: SelectGuest) =>
      row.name ? `${row.name}, ${row.anrede1}` : '',
    sortable: true,
  },
  {
    label: 'City',
    align: 'left',
    field: 'wohnort',
    name: 'wohnort',
    sortable: true,
  },
  {
    label: 'Address',
    align: 'left',
    field: 'adresse1',
    name: 'adresse1',
    sortable: true,
  },
];

export default defineComponent({
  components: {
    DialogGuestProfile: () => import('./DialogGuestProfile.vue'),
  },
  props: {
    show: { type: Boolean, required: true },
    addButton: { type: Boolean, default: false },
    mergeGuestProfile: {
      type: Object as PropType<GuestProfile>,
      default: null,
    },
    guestProfileType: {
      type: Number as PropType<GuestProfileType>,
      default: GuestProfileType.Individual,
    },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const state = reactive({
      isFetching: false,
      type: props.guestProfileType,
      guestName: '',
    });
    const rows = ref<SelectGuest[]>([]);

    const guestProfileSelectedRow = ref<SelectGuest>(null);
    const { rowsWithIndex, selected, onRowClick } = useDirectSelectedRow(
      rows,
      guestProfileSelectedRow,
      true
    );

    function onSelectGuest() {
      if (guestProfileSelectedRow.value) {
        emit('selectedGuest', guestProfileSelectedRow.value);
        showDialog.value = false;
      }
    }

    async function onSearch() {
      state.isFetching = true;
      const usedName = state.guestName
        ? state.guestName.split('*').join('') + '*'
        : ' ';
      const resGuestProfile = await $api.frontOfficeReception.selectGuest(
        state.type,
        usedName
      );
      rows.value = resGuestProfile;
      state.isFetching = false;
    }

    if (!props.mergeGuestProfile) onSearch();

    watch(
      () => state.type,
      () => {
        onSearch();
      }
    );

    async function onMergeGuestProfile() {
      if (!guestProfileSelectedRow.value) {
        return;
      }

      $q.dialog({
        title: 'Question',
        message: `Confirm the name selection: ${guestProfileSelectedRow.value.name} ?`,
        ok: { label: 'Yes', color: 'primary' },
        cancel: { label: 'No', outline: true, color: 'primary' },
      }).onOk(() => {
        if (
          props.mergeGuestProfile.gastnr &&
          props.mergeGuestProfile.gastnr ===
            guestProfileSelectedRow.value?.gastnr
        ) {
          $q.dialog({
            title: 'Warning',
            message: 'The selected guest must be different to the first',
          });
          return;
        }

        $q.dialog({
          ok: { label: 'Yes', color: 'primary' },
          cancel: { label: 'No', outline: true, color: 'primary' },
          html: true,
          title: 'Question',
          message: `
                Are you sure you want to MERGE the guest ${props.mergeGuestProfile.gname} <br>
                To: ${guestProfileSelectedRow.value.name} ?
                `,
        }).onOk(async () => {
          $q.loading.show();

          const resultMessage = await $api.frontOfficeReception.mergeGuestProfile(
            props.mergeGuestProfile.gastnr,
            guestProfileSelectedRow.value.gastnr,
            state.type
          );

          $q.loading.hide();

          $q.notify({
            message: resultMessage,
            type:
              resultMessage === 'Merged Successfull' ? 'positive' : 'negative',
          });

          if (resultMessage === 'Merged Successfull') {
            showDialog.value = false;
          }
        });
      });
    }

    return {
      ...toRefs(state),
      onSearch,
      showDialog,
      tableHeaderGuestName,
      GuestProfileType,

      dialogGuestProfile: useDisposableDialog(),
      onMergeGuestProfile,
      onSelectGuest,

      rowsWithIndex,
      selected,
      onRowClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 754px !important;

  &__body {
    max-height: 440px !important;
    overflow: auto;
  }

  &__search-btn {
    margin-right: -12px;
  }
}
</style>
