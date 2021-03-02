<template>
  <div>
    <q-dialog v-model="dialogModel" persistent>
      <q-card style="min-width: 600px">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{
            title
          }}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <q-btn flat round>
            <img :src="require('~/app/icons/Icon-Add.svg')" height="25" />
          </q-btn>
        </q-card-section>

        <q-card-section class="q-ma-sm">
          <div class="row">
            <div class="col q-pr-md">
              <SInput label-text="Number" disable />
            </div>
            <div class="col q-pr-md">
              <SSelect label-text="Outlet" />
            </div>
            <div class="col">
              <SSelect label-text="Article Number" />
            </div>
          </div>
          <div class="row">
            <div class="col q-pr-md">
              <SInput label-text="Description" />
            </div>
            <div class="col">
              <SInput type="number" label-text="Amount" />
            </div>
          </div>
          <STable
            flat
            bordered
            :loading="isFetching"
            :columns="tableHeaders"
            :data="data"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
            :hide-bottom="hide_bottom"
            class="table-accounting-date"
          >
            <template #header="props">
              <q-tr style="height: 40px" :props="props">
                <q-th
                  :props="props"
                  v-for="col in props.cols"
                  :key="col.name"
                  :style="col.style"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template #body="props">
              <q-tr
                :props="props"
                :class="{
                  selected: props.row.selected,
                }"
              >
                <q-td
                  :key="col.name"
                  :props="props"
                  v-for="col in props.cols.filter(
                    (x) => !['actions'].includes(x.name)
                  )"
                >
                  {{ col.value }}
                </q-td>
                <q-td :props="props" key="actions">
                  <q-icon name="mdi-dots-vertical" size="16px">
                    <q-menu
                      :props="props"
                      auto-close
                      anchor="bottom right"
                      self="top right"
                    >
                      <q-list :props="props">
                        <q-item :props="props" clickable v-ripple>
                          <q-item-section>Edit</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple>
                          <q-item-section>Delete</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-icon>
                </q-td>
              </q-tr>
            </template>
          </STable>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline label="Cancel" color="primary" v-close-popup />
          <q-btn label="Save" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  watch,
  toRefs,
  reactive,
} from '@vue/composition-api';
import { store } from '~/store';
import { tableHeaders } from './tables/PackageLines.table';
import { use_input, table_input, dataTable } from './utils/DailyReportSetup';

interface State {
  title: string;
}

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      data: [],
      title: '',
      hide_bottom: false,
      colors: 'grey',
      dialogConfirm: {
        confirm: false,
        message: '',
      },
    });

    // const onRowClick = (datarow) => {
    //   let disable;
    //   for (const items of use_input.filter(
    //     (x) => !['Number', 'Category'].includes(x.label)
    //   )) {
    //     if (items.disable) {
    //       disable = true;
    //     } else {
    //       disable = false;
    //     }
    //   }
    //   if (disable) {
    //     for (const i of state.data) {
    //       i.selected = false;
    //     }
    //     datarow['selected'] = true;
    //     for (const index in table_input) {
    //       use_input[index].value = datarow[table_input[index]];
    //     }
    //   }
    // };

    watch(
      () => props.show,
      (show) => {
        if (props.show) {
          console.log('Masuk Watch sebagai onMount : ');
          state.title = 'Select Package Lines';
        }
      }
    );

    const dialogModel = computed({
      get: () => props.show,
      set: (val) => {
        emit('onDialog', val);
      },
    });

    // const onAdd = () => {
    //   for (const items of use_input.filter(
    //     (x) => !['File Number', 'Category'].includes(x.label)
    //   )) {
    //     items.disable = false;
    //     items.value = '';
    //   }
    //   state.colors = 'primary';
    // };

    // const onClickEdit = () => {
    //   for (const items of use_input.filter(
    //     (x) => !['File Number', 'Category'].includes(x.label)
    //   )) {
    //     items.disable = false;
    //   }
    //   state.colors = 'primary';
    // };

    return {
      ...toRefs(state),
      tableHeaders,
      // onRowClick,
      // onAdd,
      // onClickEdit,
      dialogModel,
    };
  },
  components: {
    ActionEventPackageSetup: () =>
      import('./components/ActionEventPackageSetup.vue'),
    CheckPermission: () => import('./components/DialogCheckPermission.vue'),
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

::v-deep .table-accounting-date {
  max-height: 75vh;

  thead tr {
    th {
      position: sticky;
      z-index: 3;
    }

    &:first-child th {
      top: 0;
    }
  }

  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }
}
</style>
