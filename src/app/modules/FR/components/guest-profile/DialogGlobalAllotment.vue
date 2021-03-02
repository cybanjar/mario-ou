<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Global Allotment</span>
      </div>

      <q-form class="dialog__body">
        <div class="bg-white q-pa-lg">
          <q-btn
            label="Add"
            color="primary"
            @click="dialogGuestSelect.open()"
          />

          <STable
            :columns="tableHeaderDialogGlobalAllotment"
            :data="rows"
            class="q-mt-md sticky-header"
            no-pagination
            style="max-height: 280px"
          >
            <template #header-cell-actions="props">
              <q-th :props="props" class="fixed-col right">
                {{ props.col.label }}
              </q-th>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props" class="fixed-col right">
                <q-icon
                  name="mdi-dots-vertical"
                  size="16px"
                  class="cursor-pointer"
                >
                  <q-menu auto-close anchor="bottom right" self="top right">
                    <q-list>
                      <q-item clickable v-ripple @click="onDelete(props.row)">
                        <q-item-section>Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-icon>
              </q-td>
            </template>
          </STable>

          <DialogSelectGuest
            :show.sync="dialogGuestSelect.state.show"
            :key="dialogGuestSelect.state.key"
            :add-button="true"
            @selectedGuest="getSelectedGuest"
          />
        </div>

        <div class="dialog__footer">
          <q-btn
            label="Close"
            color="primary"
            flat
            class="q-mr-sm"
            v-close-popup
          />
          <q-btn label="Save" color="primary" @click="onSubmit" />
        </div>
      </q-form>

      <q-inner-loading :showing="isFetching" color="primary" />
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { useDisposableDialog } from '../../composables/disposableDialog';
import { GlobalAllotment } from '../../models/guest-profile/createAllotment.model';
import { SelectGuest } from '../../models/common/selectGuest.model';

const tableHeaderDialogGlobalAllotment = [
  { label: 'Company / Agent Name', align: 'left', field: 'gname' },
  { name: 'actions' },
];

export default defineComponent({
  components: {
    DialogSelectGuest: () => import('../common/DialogSelectGuest.vue'),
  },
  props: {
    show: { type: Boolean, required: true },
    guestNumber: { type: Number, default: null },
    allotmentCode: { type: String, default: null },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const state = reactive({
      isFetching: false,
      rows: [],
    });
    const rows = ref<GlobalAllotment[]>([]);

    if (showDialog.value && props.guestNumber && props.allotmentCode) {
      getData();
    }

    async function getData() {
      state.isFetching = true;

      rows.value = await $api.frontOfficeReception.getGlobalAllotment({
        gastno: props.guestNumber,
        'inp-kontcode': props.allotmentCode,
      });

      state.isFetching = false;
    }

    function getSelectedGuest(data: SelectGuest) {
      const findDuplicate = rows.value.find(
        ({ gastnr }) => gastnr === data.gastnr
      );

      if (props.guestNumber === data.gastnr) {
        $q.dialog({
          title: 'Warning',
          message: 'Can not select the same record as member.',
        });
      } else if (findDuplicate) {
        $q.dialog({
          title: 'Warning',
          message: 'The record has been selected.',
        });
      } else {
        rows.value.push({ gastnr: data.gastnr, gname: data.name });
      }
    }

    async function onSubmit() {
      $q.loading.show();

      await $api.frontOfficeReception.saveGlobalAllotment({
        gastno: props.guestNumber,
        'inp-kontcode': props.allotmentCode,
        gList: {
          'g-list': [...rows.value],
        },
      });

      getData();

      $q.loading.hide();
    }

    async function onDelete(data: GlobalAllotment) {
      $q.loading.show();
      const result = await $api.frontOfficeReception.deleteCheckGlobalAllotment(
        props.guestNumber,
        props.allotmentCode
      );
      $q.loading.hide();

      if (result.msgStr) {
        $q.dialog({
          message: result.msgStr,
        });
      } else if (!result.errorFlag) {
        $q.dialog({
          title: 'Question',
          message: `Remove the selected member from the GA list: ${data.gname} ?`,
          ok: { label: 'Yes', color: 'primary' },
          cancel: { label: 'No', outline: true },
        }).onOk(() => {
          const index = rows.value.findIndex(
            ({ gastnr }) => gastnr === data.gastnr
          );
          rows.value.splice(index, 1);
        });
      }
    }

    return {
      ...toRefs(state),
      showDialog,
      tableHeaderDialogGlobalAllotment,
      rows,

      getSelectedGuest,
      onSubmit,
      onDelete,

      dialogGuestSelect: useDisposableDialog(),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 480px !important;
}
</style>
