<template>
  <q-dialog v-model="dialogMoneyChangePosting" persistent>
    <q-card style="max-width: 1000px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Room Selected
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <STable
          :loading="table.isFetching"
          :columns="tableHeaders"
          :data="table.data"
          :rows-per-page-options="[10, 13, 16]"
          :pagination.sync="table.pagination"
          :selected.sync="selected"
          row-key="zinr"
          :class="table.data.length > 0 && 'selected-row-foc'"
          @row-click="onRowClick"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancle"
          @click="onClose"
        />
        <q-btn color="primary" label="OK" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  onMounted,
  ref,
} from '@vue/composition-api';
import { tableHeaders } from '../../tables/dialogMoneyChangePosting.table';
import { ResMoneyChangePostingList } from '../../models/money-change-posting-list.model';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
  },

  setup(props, { emit }) {
    const state = reactive({
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
    });

    onMounted(async () => {
      state.table.isFetching = false;
    });

    const selected = ref<ResMoneyChangePostingList[]>([]);

    const onRowClick = (_, row: ResMoneyChangePostingList) => {
      selected.value = [row];
    };

    const onSubmit = async () => {
      const dialogBody = {
        dialog: false,
      };
      emit('onDialogMoneyChangePosting', dialogBody);
    };

    const onClose = () => {
      const dialogBody = {
        dialog: false,
      };
      emit('onDialogMoneyChangePosting', dialogBody);
    };

    const dialogMoneyChangePosting = computed({
      get: () => props.dialog,
      set: (dialogBody) => {
        emit('onDialogMoneyChangePosting', dialogBody);
      },
    });

    return {
      dialogMoneyChangePosting,
      tableHeaders,
      onRowClick,
      onSubmit,
      onClose,
      selected,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
.q-toolbar {
  background: $primary-grad;
}
.selected-row-foc {
  tbody tr.selected td {
    background: #2d00e2 !important;
    color: #fff;
  }
}
</style>
