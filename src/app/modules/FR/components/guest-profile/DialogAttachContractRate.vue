<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Attach Contract Rate</span>
      </div>

      <div class="dialog__body">
        <div class="bg-white q-py-lg q-px-xl">
          <div class="row">
            <div class="col-3">
              <SInput label-text="Search Rate Code" v-model="search" />
            </div>
          </div>
          <div class="row q-col-gutter-x-lg q-mt-md">
            <div class="col">
              <STable
                :columns="tableHeaderAttachContractExisting"
                :data="tableExisting"
                class="sticky-header table"
                no-data-text="No Data"
                row-key="char1"
                :selected.sync="selectedTableExisting"
                @row-click="onRowClickExisting"
              >
                <template #header="props">
                  <q-tr><q-th colspan="2">Existing Contract Rate</q-th></q-tr>
                  <q-tr :props="props">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>
              </STable>
            </div>
            <div class="column items-center justify-center">
              <q-btn
                icon="mdi-chevron-right"
                :color="!selectedRowExisting ? 'grey-5' : 'primary'"
                :text-color="!selectedRowExisting ? 'black' : 'white'"
                :disable="!selectedRowExisting"
                @click="addToSelected"
                padding="none"
                size="md"
              />
              <q-btn
                icon="mdi-chevron-left"
                class="q-mt-sm"
                :color="!selectedRowSelected ? 'grey-5' : 'primary'"
                :text-color="!selectedRowSelected ? 'black' : 'white'"
                :disable="!selectedRowSelected"
                @click="removeFromSelected"
                padding="none"
                size="md"
              />
            </div>
            <div class="col">
              <STable
                :columns="tableHeaderAttachContractSelected"
                :data="tableSelected"
                class="sticky-header table"
                no-data-text="No Data"
                row-key="char1"
                :selected.sync="selectedTableSelected"
                @row-click="onRowClickSelected"
              >
                <template #header="props">
                  <q-tr><q-th colspan="2">Selected Contract Rate</q-th></q-tr>
                  <q-tr :props="props">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>
              </STable>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn
          label="Cancel"
          color="primary"
          flat
          v-close-popup
          class="q-mr-sm"
        />
        <q-btn label="OK" color="primary" @click="onSave" />
      </div>

      <q-inner-loading
        :showing="isFetching"
        color="primary"
        style="z-index: 2"
      />
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { TableHeader } from '~/components/VhpUI/typings';
import { useCustomSelectedRow } from '../../composables/selectedRow';
import { AttachContractRate } from '../../models/guest-profile/attachContractRate.model';

const tableHeaderAttachContractExisting: TableHeader<AttachContractRate>[] = [
  { label: 'Rate Code', align: 'left', field: 'char1', name: 'char1' },
  { label: 'Description', align: 'left', field: 'char2', name: 'char2' },
];

const tableHeaderAttachContractSelected: TableHeader<AttachContractRate>[] = [
  { label: 'Rate Code', align: 'left', field: 'char1', name: 'char1' },
  { label: 'Description', align: 'left', field: 'char2', name: 'char2' },
];

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    guestNumber: { type: Number, default: null },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const isFetching = ref(true);
    const dataExisting = ref<AttachContractRate[]>([]);
    const dataSelected = ref<AttachContractRate[]>([]);

    if (showDialog.value && props.guestNumber) {
      $api.frontOfficeReception
        .getAttachContractRate(props.guestNumber)
        .then(({ existing, selected }) => {
          isFetching.value = false;
          dataExisting.value = existing;
          dataSelected.value = selected;
        });
    }

    // Setup displayed data and search
    const search = ref('');
    const tableExisting = computed(() => {
      if (search.value) {
        return dataExisting.value.filter((item) =>
          item.char1.toLowerCase().includes(search.value.toLowerCase())
        );
      } else {
        return dataExisting.value;
      }
    });
    const tableSelected = computed(() => {
      if (search.value) {
        return dataSelected.value.filter((item) =>
          item.char1.toLowerCase().includes(search.value.toLowerCase())
        );
      } else {
        return dataSelected.value;
      }
    });

    watch(search, () => {
      selectedRowExisting.value = null;
      selectedRowSelected.value = null;
    });
    // End Setup displayed data and search

    const selectedRowExisting = ref<AttachContractRate>(null);
    const {
      selected: selectedTableExisting,
      onRowClick: onRowClickExisting,
    } = useCustomSelectedRow(selectedRowExisting, 'char1');

    const selectedRowSelected = ref<AttachContractRate>(null);
    const {
      selected: selectedTableSelected,
      onRowClick: onRowClickSelected,
    } = useCustomSelectedRow(selectedRowSelected, 'char1');

    async function addToSelected() {
      const isAlreadySelected = dataSelected.value.find(
        (item) => item.char1 === selectedRowExisting.value.char1
      );
      if (isAlreadySelected) return;

      $q.loading.show();
      const restricted = await $api.frontOfficeReception.checkAccessContractRate(
        props.guestNumber
      );
      $q.loading.hide();
      if (restricted) {
        notifyError('You have no access right to change this contract rate.');
        return;
      }

      dataSelected.value.push(selectedRowExisting.value);
      dataSelected.value.sort((a, b) => a.char1.localeCompare(b.char1));
      selectedRowExisting.value = null;
    }

    async function removeFromSelected() {
      $q.loading.show();
      const restricted = await $api.frontOfficeReception.checkAccessContractRate(
        props.guestNumber
      );
      if (restricted) {
        notifyError('You have no access right to change this contract rate.');
        return;
      }

      if (selectedRowSelected.value.char1 === props.guestNumber.toString()) {
        notifyError("Can not remove company's own ratecode.");
        return;
      }

      const resLine = await $api.frontOfficeReception.readResLine(
        props.guestNumber
      );
      $q.loading.hide();
      const codeCheck = '$CODE$' + selectedRowSelected.value.char1;
      if (
        resLine &&
        (resLine['active-flag'] <= 1 ||
          resLine['zimmer-wunsch'].includes(codeCheck))
      ) {
        notifyError('Rate Code used by reservation No: ' + resLine.resnr);
        return;
      }

      const index = dataSelected.value.findIndex(
        (item) => item.char1 === selectedRowSelected.value.char1
      );
      dataSelected.value.splice(index, 1);
      selectedRowSelected.value = null;
    }

    function notifyError(message: string) {
      $q.notify({ type: 'negative', message });
      if ($q.loading.isActive) $q.loading.hide();
    }

    function onSave() {
      $q.dialog({
        title: 'Confirm',
        message: 'Confirm your changes?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        $q.loading.show();
        await $api.frontOfficeReception.saveContractRate(
          props.guestNumber,
          dataSelected.value
        );
        $q.loading.hide();
        emit('save', dataSelected.value);
        showDialog.value = false;
      });
    }

    return {
      tableHeaderAttachContractExisting,
      tableHeaderAttachContractSelected,
      showDialog,
      isFetching,
      search,
      tableExisting,
      tableSelected,
      selectedRowExisting,
      selectedTableExisting,
      onRowClickExisting,
      selectedRowSelected,
      selectedTableSelected,
      onRowClickSelected,
      addToSelected,
      removeFromSelected,
      onSave,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 890px !important;

  &__body {
    max-height: 420px !important;
    overflow: auto;
  }
}

.table {
  max-height: 345px;

  thead tr:nth-child(2) th {
    top: 28px;
  }
}
</style>
