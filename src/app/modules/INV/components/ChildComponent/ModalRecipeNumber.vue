<template>
  <q-dialog v-model="dataRecipe.dialogArticel" persistent>
    <q-card style="width: 400px; height: auto">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">Title Recipe</q-toolbar-title>
      </q-toolbar>
      <q-card-section>
      <STable
        :loading="false"
        :columns="tableHeaders"
        :data="dataRecipe.data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        :hide-bottom="dataRecipe.hide_bottom"
        class="table-accounting-date"
        flat bordered
       >
        <template #header-cell-fibukonto="props">
          <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
        </template>

        <template #body-cell-fibukonto="props">
          <q-td :props="props" class="fixed-col left">{{ props.row.fibukonto }}</q-td>
        </template>

        <template #header-cell-actions="props">
          <q-th style="z-index: 4;" :props="props" class="fixed-col right">{{ props.col.label }}</q-th>
        </template>

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
                      <q-item-section>Account</q-item-section>
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
        <q-btn unelevated size="sm" color="primary" label="OK" @click="$emit('onClickNumber', dataRow)" />
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
    dataRecipe: { type: Object, required: true }
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      dataRow: ''
    });

    const onRowClick = (datarow) => {
     const x = props.dataRecipe.data
      for(const i of x){
        i.selected = false
      }
      datarow['selected'] = true;
      state.dataRow = datarow
    }

    const tableHeaders = [
      {
        label: '',
        required: true,
        name: 'artnrrezept',
        align: 'left',
        field: 'artnrrezept',
        format: val => `${val}`,
        sortable: true
      },
      {
        label:'Description',
        name: 'Description',
        field:'bezeich',
        align:'left',
      },
      {
        label: 'Category',
        name: 'Category',
        field: 'kategorie',
        align: 'left',
      },
      { name: 'actions', field: 'actions' },
    ];

    return {
      ...toRefs(state),
      onRowClick,
      tableHeaders,
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
    th .text-right{
      position: sticky;
      z-index: 4;
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
