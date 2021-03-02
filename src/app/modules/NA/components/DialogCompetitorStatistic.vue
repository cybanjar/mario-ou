<template>
    <q-dialog v-model="dialog.dialog" persistent>
      <q-card style="width: 580px; max-width: 90vw;">
        <q-toolbar>
           <q-toolbar-title 
           class="text-white text-weight-medium">
              Select Competitor
           </q-toolbar-title>
       </q-toolbar>
        <q-card-section class="row items-center">
          <STable
            :loading="isFetching"
            :columns="tableHeaders"
            :data="dialog.data"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
            hide-bottom
            class="table-accounting-date"
          >
            <template v-slot:body="props">
              <q-tr 
                :props="props" 
                @click="onRowClick(props.row)"
                :class="{
                  selected : props.row.selected
                }"
                >
               <q-td 
               :key="col.name" 
               :props="props" 
               v-for="col in props.cols">
                  {{col.value}} 
               </q-td>
              </q-tr>
            </template>
          </STable>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn unelevated outline size="sm" label="Cancel" color="primary" v-close-popup />
          <q-btn unelevated size="sm" label="Oke" color="primary" @click="onClickConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from '@vue/composition-api';
import { TableHeader } from '~/components/VhpUI/typings';
export default defineComponent({
    props: {
        dialog: {} as any
    },
    setup(props, {emit}){
    let dataRow 
     const tableHeaders: TableHeader[] = [
        {
            label: 'Number',
            field: 'aktionscode',
            name: 'aktionscode',
            align: 'left',
            sortable: false,
        },
        {
            label: 'Competitor Name',
            field: 'bemerkung',
            name: 'bemerkung',
            align: 'left',
            sortable: false,
        },
        {
            label: 'Description',
            field: 'bezeich',
            name: 'bezeich',
            align: 'left',
            sortable: false,
        },
     ]
      const onClickConfirm = () => {
        emit('onClickConfirm', dataRow, props.dialog['rowIndex'])
      }

      const onRowClick = (datarow) => {
        for(const i of props.dialog.data){
          i.selected = false
        }
        datarow['selected'] = true;
        dataRow = datarow
      }

      return{
        onClickConfirm,
        tableHeaders,
        onRowClick
      }
    }
})
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
::v-deep .table-accounting-date {
  max-height: 40vh;

  thead tr {
    th {
      position: sticky;
      z-index: 3;
    }

    &:first-child th {
      top: 0;
    }
  }
}
  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }

</style>