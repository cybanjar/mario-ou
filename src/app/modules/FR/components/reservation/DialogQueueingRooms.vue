<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Queueing Rooms</span>
      </div>

      <div class="bg-white q-px-xl q-py-lg">
        <STable
          :columns="tableHeaders"
          :data="data"
          class="table sticky-header"
          no-pagination
        />
      </div>

      <div class="dialog__footer">
        <q-btn label="OK" color="primary" v-close-popup />
      </div>

      <q-inner-loading :showing="isFetching" color="primary" />
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { TableHeader } from '~/components/VhpUI/typings';
import { ReadQueasy } from '../../models/common/options.model';

const tableHeaders: TableHeader<ReadQueasy>[] = [
  { label: 'Room Number', align: 'left', field: 'char1', name: 'roomNumber' },
  { label: 'User ID', align: 'left', field: 'char2', name: 'userId' },
  {
    label: 'Status',
    align: 'left',
    field: 'number1',
    name: 'status',
    format: (val: number) => {
      switch (val) {
        case 0:
          return 'In Progress';
        case 1:
          return 'Done';
        default:
          return '';
      }
    },
  },
];

export default defineComponent({
  props: {
    show: { type: Boolean, default: false },
  },
  setup(props, { emit, root: { $api } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const state = reactive({
      isFetching: true,
      data: [] as ReadQueasy[],
    });

    if (showDialog.value) {
      $api.frontOfficeReception.readQueasy(162).then((data) => {
        state.isFetching = false;
        state.data = data.sort((a, b) => a.char1.localeCompare(b.char1));
      });
    }

    return {
      tableHeaders,
      showDialog,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  width: 552px;
}
.table {
  max-height: 390px;
}
</style>
