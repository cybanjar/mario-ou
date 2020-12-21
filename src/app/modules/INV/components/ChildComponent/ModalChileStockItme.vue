<template>
  <q-dialog v-model="dataAccount.dialog" persistent>
    <q-card style="width: 560px; height: auto">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">Title Acct</q-toolbar-title>
      </q-toolbar>
      <q-card-section>
      <STable
        :loading="false"
        :columns="tableHeaders"
        :data="dataAccount.data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        :hide-bottom="hide_bottom"
        class="table-accounting-date"
        flat bordered
       >
        <template v-slot:body="props">
          <q-tr :props="props" @click="onRowClick(props.row)" 
            :class="{
              selected : props.row.selected
            }">
             <q-td 
             :key="col.name" 
             :props="props" 
             v-for="col in props.cols.filter(i => ![
             'actions'].includes(i.name))">
                {{col.value}} 
             </q-td>
            <q-td key="actions" :props="props" class="fixed-col right">
              <q-icon name="mdi-dots-vertical" size="16px">
                <q-menu :props="props" auto-close anchor="bottom right" self="top right">
                  <q-list :props="props">
                    <q-item :props="props" clickable v-ripple>
                      <q-item-section>Choose</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
            </q-tr>
        </template>
      </STable>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" self-end>
        <q-btn size="sm" outline color="primary" label="Cancel" v-close-popup />
        <q-btn unelevated size="sm" color="primary" label="OK" @click="$emit('onClickAccount', dataRow)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  watch,
  reactive,
  toRefs,
  onMounted,
} from '@vue/composition-api';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';


export default defineComponent({
  props: {
    dataAccount: { type: Object, required: true }
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      dataRow: '',
      hide_bottom: true
    });

    const onRowClick = (datarow) => {
     const x = props.dataAccount.data
      for(const i of x){
        i.selected = false
      }
      datarow['selected'] = true;
      state.dataRow = datarow.fibukonto
    }

    const tableHeaders = [
      {
        label: 'Account Number',
        required: true,
        name: 'accountnumber',
        align: 'left',
        field: 'fibukonto',
        format: val => `${val}`,
        sortable: true
      },
      {
        label:'Description',
        name: 'description',
        field:'bezeich',
        align:'left',
      },
      {
        label: 'Type',
        name: 'type',
        field: 'acc-type',
        align: 'left',
      },
      {
        label: 'Department',
        name: 'department',
        field: 'deptnr',
        align: 'left',
      },
      {
        label: 'Main',
        name: 'main',
        field: 'main-nr',
        align: 'left',
      },
      { name: 'actions', field: 'actions' },
    ];

    return {
      ...toRefs(state),
      tableHeaders,
      onRowClick,
      pagination: { page: 1, rowsPerPage: 0 },
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
::v-deep .table-accounting-date {
  max-height: 50vh;

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
