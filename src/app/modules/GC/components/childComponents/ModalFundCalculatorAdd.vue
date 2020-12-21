<template>
    <q-dialog v-model="modal_fundcalculatoradd.dialog" persistent>
      <q-card style="width: 700px; max-width: 90vw; height: 330px">
        <q-toolbar>
           <q-toolbar-title 
            class="text-white text-weight-medium">
              Select Account Number
           </q-toolbar-title>
        </q-toolbar>

        <q-card-section style="height: 220px" class="q-pt-none">
           <STable
              style="marginTop: 15px"
              :columns="modal_fundcalculatoradd.tableHeadersAdd"
              :data="fund_calculator.data"
              :rows-per-page-options="[0]"
              :hide-bottom="fund_calculator.hide_bottom"
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
                    </q-tr>
                </template>
            </STable>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn unelevated size="sm" v-close-popup color="primary" outline label="Cancel" />
          <q-btn unelevated size="sm" v-close-popup color="primary"  label="OK" @click="addData" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted} from '@vue/composition-api';
import { setuid } from 'process';
export default defineComponent({
    props: {
      modal_fundcalculatoradd: {} as any,
      fund_calculator: {} as any
    },
    setup(props, {emit}){
      const state = reactive ({
          data: []
      })

      
      const onRowClick = (datarow) => {
       const x = props.fund_calculator.data
        for(const i of x){
          i.selected = false
        }
        datarow['selected'] = true;
        state.data = datarow
      }

      const addData = () => {
          emit('addData', {...state})
      }

      return {
        ...toRefs(state),
        onRowClick,
        addData
      }
    }
})
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
::v-deep .table-accounting-date {
  max-height: 30vh;

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