<template>
    <q-dialog v-model="dialog">
      <q-card style="marginTop: -100px; width: 500px; height: 400px">
        <q-toolbar>
           <q-toolbar-title 
            class="text-white text-weight-medium">
              {{get_invoice.firma}}
           </q-toolbar-title>
        </q-toolbar>

        <q-card-section style="height: 295px" class="q-pt-none">
          <div style="marginTop: 10px" class="row">
            <v-date-picker v-model="fromDate"  :popover="{ visibility: 'click' }">
              <SInput
                label-text="From Date"
                slot-scope="{ inputProps }"
                readonly
                style="width: 160px; marginRight: 20px"
                v-bind="inputProps"
              />
            </v-date-picker>
            <v-date-picker v-model="toDate"  :popover="{ visibility: 'click' }">
              <SInput
                label-text="To Date"
                slot-scope="{ inputProps }"
                readonly
                style="width: 160px; marginRight: 20px"
                v-bind="inputProps"
              />
            </v-date-picker>
            <q-btn
              color="primary"
              icon="mdi-magnify"
              style="height: 25px; marginTop: 25px"
              label="Search"
              type="submit"
              class="q-mt-md"
              size="sm"
              @click="onSearch"
            />
          </div>
          <STable
            :columns="invoiceNumber"
            :data="data"
            :rows-per-page-options="[0]"
            :hide-bottom="hide_bottom"
            class="table-accounting-date"
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
        <q-card-actions align="right">
          <q-btn size="sm" outline label="cancel" color="primary" @click="onCencel" />
          <q-btn size="sm" label="OK" color="primary" @click="onCencel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs} from '@vue/composition-api';
import { DatePicker } from 'v-calendar';
import {invoiceNumber} from '../../tables/CashAdvance.table'
import {use_inputchild} from '../../Input/cash_advance'
export default defineComponent({
  props : {
    dialog: {} as any,
    invoice_number: {} as any,
    data: {} as any,
    hide_bottom: {} as any,
    get_invoice: {} as any
    },
    setup(props,{emit}) {
        const state = ({
            fromDate: new Date(2016, 11 , 13),
            toDate: new Date(),
        })
        const onSearch = () => {
            emit('onSearch', {...state})
        }
        const onCencel = () => {
          emit('onSearch', '1')
        }
        const onRowClick = (datarow) => {
         const x = props.data
          for(const i of x){
            i.selected = false
          }
          datarow['selected'] = true;
          use_inputchild.Settlement[1].value = datarow.NAME
        }
        return {
            ...toRefs(state),
            invoiceNumber,
            onSearch,
            onRowClick,
            onCencel
        }
    }, 
    components: {
      'v-date-picker': DatePicker
    },
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