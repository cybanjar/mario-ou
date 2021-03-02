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
      <ActionSourceOfBookingSetup 
        :colors="colors"
        @onSave="onSave"
      />
    </div>
    <div class="col">
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
    <CheckPermission :dialog-confirm="dialogConfirm" />
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
import { tableHeaders } from './tables/SourceOfBookingSetup.table';
import { use_input, table_input, dataTable } from './utils/DailyReportSetup';
import {Notify} from 'quasar'
import { sinput } from './utils/TableSourceOfBooking';
import { log } from 'console';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      data: [],
      isFetching: false,
      hide_bottom: false,
      colors: 'grey',
      onKey: 'add',
      dialogConfirm: {
        confirm: false,
        message: '',
      },
    });

    const onRowClick = (datarow) => {
      for (const i of state.data) {
        i.selected = false;
      }
      datarow['selected'] = true;
    };

    const onRefresh = () => {
      FETCH_API('bkQueasyRead', {
        "caseType": "1",
        "intKey": "4"
      })
      
    }

    const FETCH_API = async (api, body?) => {
      const GET_DATA = await $api.systemsetting.FetchAPISC(api, body)
      switch (api) {
        case 'bkQueasyRead':
          for(const item of GET_DATA['tBkqueasy']['t-bkqueasy']){
            item['selected'] = false
          }
          console.log('Data Prepare : ', GET_DATA);

          state.data = GET_DATA['tBkqueasy']['t-bkqueasy']
          if (state.data.length !== 0) {
            state.hide_bottom = true
            sinput[0].value = (state.data.length + 1).toString()
          }
          break;
      
        default:
          break;
      }
    }

    onMounted(async () => {
      console.log('onMounted!');
      onRefresh()  
    });

    const onAdd = () => { 
      console.log('onClick Add : ');
           
      state.colors = 'primary';
      sinput[1].disable = false
      sinput[2].disable = false
      state.onKey = 'add'
    };

    const onClickEdit = () => {
      for (const items of use_input.filter(
        (x) => !['File Number', 'Category'].includes(x.label)
      )) {
        items.disable = false;
      }
      state.colors = 'primary';
    };

    const onSave = () => {
      console.log('Click onSave')
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onRowClick,
      onAdd,
      onClickEdit,
      onSave,

    };
  },
  components: {
    ActionSourceOfBookingSetup: () =>
      import('./components/ActionSourceOfBookingSetup.vue'),
    CheckPermission: () => import('./components/DialogCheckPermission.vue'),
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
