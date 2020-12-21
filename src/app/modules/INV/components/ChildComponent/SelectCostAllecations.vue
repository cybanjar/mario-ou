<template>
    <q-dialog v-model="dialog.dialog" presistent>
        <q-card style="width: 800px; max-width: 90vw;">
          <q-toolbar>
            <q-toolbar-title class="text-white text-weight-medium">Select Cost Allocations</q-toolbar-title>
          </q-toolbar>
          <q-card-section style="height: 300px; max-height: 50vh;">
            <div class="row">
              <div class="col-2" id="right-cost-alecations">
                <q-option-group
                  size="xs"
                  v-model="groupAlecations"
                  :options="optionsAlecations"
                  color="primary"
                  @input="sortGroup"
                />
              </div>
              <div class="col-3" id="right-cost-alecations">
                <STable
                  :columns="tableCostCenterList"
                  :data="dialogg.dataCostCenterList"
                  :rows-per-page-options="[0]"
                  :pagination.sync="pagination"
                  :hide-bottom="true"
                  class="table-accounting-date"
                  flat bordered
                >
                <template v-slot:body="props">
                    <q-tr :props="props" :class="(props.row.selected)?'bg-blue-grey-2 text-black':'bg-white text-black'">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        @click="clickCostAllecations(props.row)">
                          {{ col.value }}
                      </q-td>
                    </q-tr>
                  </template>
                </STable>
              </div>
              <div class="col">
                <STable
                  :columns="tableAllocationsList"
                  :data="dataAllocationsList"
                  :rows-per-page-options="[0]"
                  :pagination.sync="pagination"
                  :hide-bottom="hide_bottom"
                  class="table-accounting-date"
                  flat bordered
                >
                  <template v-slot:body="props">
                    <q-tr :props="props" :class="(props.row.selected)?'bg-blue-grey-2 text-black':'bg-white text-black'">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        @click="clickCostAllecations2(props.row)">
                          {{ col.value }}
                      </q-td>
                    </q-tr>
                  </template>
                </STable>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn size="sm" outline color="primary" label="Cancel" @click="dialogAccount = false" />
            <q-btn unelevated size="sm" label="Ok" color="primary" @click="accountDialog" />
          </q-card-actions>
        </q-card>
      </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { use_input } from '../../tables/storeRequisition';
import {  tableCostCenterList,tableAllocationsList,} from '../../tables/storeRequisition'
export default defineComponent({
    props: {
       dialog: {} as any ,
       dialogg: {} as any ,
   },

   setup(props, {root: { $api }}) {
       let value
       const state = reactive({
        groupAlecations: '1',
        dataAllocationsList: [],
        hide_bottom: false,
        optionsAlecations: [
          {
            label: 'acctNo',
            value: '1',
          },
          {
            label: 'Description',
            value: '2',
          },
        ],
       })

       const FETCH_DATA = async (val) => {
            const GET_DATA = await $api.inventory.FetchCommon('selectCostDept1')
            const data = GET_DATA.allocList['alloc-list'].map((items) => ({
              bezeich: items.bezeich,
              fibu: items.fibu,
              name: items.name,
              ['rec-id']: items['rec-id'],
              selected: false
            }))   
            state.dataAllocationsList = data.filter((items) => {
              return items.name.toString().includes(val.num.toString())
            })
            if (state.dataAllocationsList.length !== 0) {
                state.hide_bottom = true
            }
       }
       const accountDialog = () => {
           use_input[3].value = value.fibu
           props.dialog.dialog = false
       }

       const clickCostAllecations = (val) => {
           for(const i of props.dialogg.dataCostCenterList){
               i['selected'] = false
           }
           val['selected'] = true
           FETCH_DATA(val)
       }
       const clickCostAllecations2 = (val) => {
         for(const i of state.dataAllocationsList){
           i['selected'] = false
         }
         val['selected'] = true
         value = val
       }
       const sortGroup = () => {
           const data = state.dataAllocationsList
           if(state.groupAlecations == '1'){
            state.dataAllocationsList = data.sort((a, b) => {
              return parseInt(a.fibu) - parseInt(b.fibu)
            })
           } else {
            state.dataAllocationsList = data.sort((a, b) => {
                if (a.bezeich.toUpperCase() < b.bezeich.toUpperCase()) {
                    return -1
                }
            })
           }
       }
       return {
        ...toRefs(state),
        tableCostCenterList,
        tableAllocationsList,
        accountDialog,
        clickCostAllecations,
        clickCostAllecations2,
        sortGroup,
        pagination: {
         rowsPerPage: 0,
        },
       }
   }
})
</script>
<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
#select-articel-input {
  margin-right: 10px
}
#select-articel-table {
  margin-left: 20px
}
#table-store-requisition {
  margin-left: -100px
}
#right-cost-alecations {
  margin-right: 10px
}
.actualQuantity {
  margin-left: 28px;
}
::v-deep .table-accounting-date {
  max-height: 41vh;
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
</style>