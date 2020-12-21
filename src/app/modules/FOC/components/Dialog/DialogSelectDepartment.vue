<template>
  <q-dialog v-model="dialogSelectDepartmentModel" persistent="">
    <q-card style="max-width: 500px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Select Department
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <q-table
              dense
              :loading="table.isFetching"
              :columns="tableHeaders"
              :data="table.data"
              separator="cell"
              :rows-per-page-options="[10, 13, 16]"
              :pagination.sync="table.pagination"
              row-key="indexFoc"
              :class="table.data.length > 0 && 'selected-row-foc'"
              @row-click="onRowClick"
              :selected.sync="selected"
            >
            </q-table>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancle"
          @click="onCancle"
        />
        <q-btn color="primary" label="OK" @click="onOk" />
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
  watch,
  ref,
} from '@vue/composition-api';
import { tableHeaders } from '../../tables/dialogSelectDepartment.table';
import { ResSelectDepartmentList } from '../../models/select-department-list.model';
import { store } from '~/store';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    hotels: { type: Array },
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      departNum: 0,
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
    });

    watch(
      () => props.hotels,
      async (hotels: any) => {
        hotels.length > 0 ? (state.table.data = hotels) : [];
        state.table.isFetching = false;
      }
    );

    const selected = ref<ResSelectDepartmentList[]>([]);

    const onRowClick = async (_, row: ResSelectDepartmentList) => {
      const getRow: any = row;
      selected.value = [row];
      state.departNum = getRow.num;
    };

    const dialogSelectDepartmentModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('onDialogSelectDepartment', val);
      },
    });

    const onOk = async () => {
      const getArticles = await $api.frontOfficeCashier.foInvoicePrepare();
      const depart = getArticles.tArtikel['t-artikel'].filter(
        (e) => e.departement === state.departNum
      );
      store.commit.foc.SET_ARTICLES(depart);

      emit('onDialogSelectDepartment', false);
    };

    const onCancle = () => {
      state.departNum = 0;
      emit('onDialogSelectDepartment', false);
    };

    return {
      tableHeaders,
      dialogSelectDepartmentModel,
      selected,
      onRowClick,
      onOk,
      onCancle,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
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
