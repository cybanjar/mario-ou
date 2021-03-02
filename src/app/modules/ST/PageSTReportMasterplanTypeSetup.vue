<template>
  <div class="column" style="margin: 20px">
    <div class="col">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img
            :src="require('~/app/icons/Icon-Add.svg')"
            height="25"
            @click="onAdd"
          />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
      </div>
    </div>
    <div class="col">
      <SearchMasterplanTypeSetup :searches="searches" />
    </div>
    <div class="col">
      <STable
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
            @click="onRowClick(props.row)"
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
                    <q-item
                      :props="props"
                      @click="onClickEdit"
                      clickable
                      v-ripple
                    >
                      <q-item-section>Edit</q-item-section>
                    </q-item>
                    <q-item
                      @click="deleteDataRow(props.row)"
                      clickable
                      v-ripple
                    >
                      <q-item-section>Delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </q-tr>
        </template>
      </STable>
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
import { store } from '~/store';
import { tableHeaders } from './tables/MasterplanTypeSetup.table';
import { use_input, table_input, dataTable } from './utils/DailyReportSetup';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      data: [],
      isFetching: false,
      hide_bottom: false,
      colors: 'grey',
      searches: {
        room: '',
        store: [],
        active: false,
      },
    });

    const onRowClick = (datarow) => {
      let disable;
      for (const items of use_input.filter(
        (x) => !['File Number', 'Category'].includes(x.label)
      )) {
        if (items.disable) {
          disable = true;
        } else {
          disable = false;
        }
      }
      if (disable) {
        for (const i of state.data) {
          i.selected = false;
        }
        datarow['selected'] = true;
        for (const index in table_input) {
          use_input[index].value = datarow[table_input[index]];
        }
      }
    };

    onMounted(() => {
      console.log('halo');
      
    });

    const onAdd = () => {
      state.searches.active = true;
    };

    const onClickEdit = () => {
      for (const items of use_input.filter(
        (x) => !['File Number', 'Category'].includes(x.label)
      )) {
        items.disable = false;
      }
      state.colors = 'primary';
    };

    return {
      ...toRefs(state),
      tableHeaders,
      onRowClick,
      onAdd,
      onClickEdit,
    };
  },
  components: {
    SearchMasterplanTypeSetup: () =>
      import('./components/SearchMasterplanTypeSetup.vue'),
  },
});
</script>
<style lang="scss" scoped>
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
