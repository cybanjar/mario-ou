<template>
  <div>
    <q-dialog v-model="cheque_giro.dialog" persistent>
      <q-card style="width: 750px; max-width: 90vw; height: 500px">
        <q-toolbar>
           <q-toolbar-title 
            class="text-white text-weight-medium">
              Cheque / Giro
           </q-toolbar-title>
        </q-toolbar>

        <q-card-section style="height: 390px; marginTop: 10px" class="q-pt-none">
            <q-btn @click="ADD" flat round class="q-mr-lg">
              <img :src="require('~/app/icons/Icon-Add.svg')" height="20" />
            </q-btn>
            <SInput @keyup="search_bankname" v-model="searchbankname" placeholder="Search Bank Name"/>
            <STable
              :loading="cheque_giro.isFetching"
              style="marginTop: 15px"
              :columns="tableHeaders"
              :data="cheque_giro.data"
              :rows-per-page-options="[0]"
              class="table-rooming-list"
              flat bordered
              :hide-bottom="true"
            >
            <template #header="props">
              <q-tr :props="props">
                <q-th rowspan="2" :props="props" key="bankname">
                    {{props.colsMap.bankname.label}}
                </q-th>
                <q-th rowspan="2" :props="props" key="GiroNumber">
                    {{props.colsMap.GiroNumber.label}}
                </q-th>
                <q-th rowspan="2" :props="props" key="AccountNumber">
                    {{props.colsMap.AccountNumber.label}}
                </q-th>
                <q-th rowspan="2" :props="props" key="GiroStatus">
                    {{props.colsMap.GiroStatus.label}}
                </q-th>
                <q-th colspan="2">Created</q-th>
                <q-th colspan="2">Changed</q-th>
                <q-th rowspan="2" :props="props" key="DueDate">
                    {{props.colsMap.DueDate.label}}
                </q-th>
                <q-th rowspan="2" :props="props" key="Amount">
                    {{props.colsMap.Amount.label}}
                </q-th>
                <q-th rowspan="2" :props="props" key="DocumentNumber">
                    {{props.colsMap.DocumentNumber.label}}
                </q-th>
                <q-th rowspan="2" :props="props" key="ClearingDate">
                    {{props.colsMap.ClearingDate.label}}
                </q-th>
                <q-th
                   :props="props"
                   key="actions"
                   rowspan="2"
                   class="fixed-col right"
                   style="z-index: 4"        
                 >{{ props.colsMap.actions.label }}
                </q-th>
              </q-tr>
              <q-tr :props="props">
                <q-th
                  v-for="col in getDefaultColumns(props.cols)"
                  :key="col.name"
                  :props="props"
                >{{ col.label }}</q-th>
              </q-tr>
            </template>
            
          <template #body="props">
          <q-tr 
            :class="{
              selected : props.row.selected
            }" 
            :props="props" 
            @click="onRowClick(props.row)">
            <q-td
            :props="props"
            v-for="col in props.cols.filter(cols => ![
            'actions'].includes(cols.name))"
            :key="col.name"
            >
                  {{col.value}}
            </q-td>
            <q-td :props="props.row.actions" class="fixed-col right">
              <q-icon name="mdi-dots-vertical" size="16px">
                <q-menu :props="props" auto-close anchor="bottom right" self="top right">
                  <q-list :props="props">
                    <q-item @click="onEdit(props.row)" :props="props" clickable v-ripple>
                      <q-item-section>edit</q-item-section>
                    </q-item>
                    <q-item @click="onDelete(props.row)" clickable v-ripple>
                      <q-item-section>delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </q-tr>
        </template>        
        </STable>
        <div class="row justify-center">
            <q-option-group
              v-model="group"
              :options="options"
              color="primary"
              inline
            />
        </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn unelevated size="sm" v-close-popup color="primary" outline label="Cancel" />
          <q-btn unelevated size="sm" v-close-popup color="primary"  label="OK" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <DialogChequegiro 
    @savecheckgiro="savecheckgiro"
    :dialogcheck_giro="dialogcheck_giro"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs} from '@vue/composition-api';
import {tableHeaders} from '../tables/Chequegiro.table'
import {edit_data} from '../utils/params.Chequegiro'
export default defineComponent({
    props: {
        cheque_giro: {} as any
    },
    setup(props, {emit}){
      let data = props.cheque_giro.data
      let data_value
        const state = reactive({
            group: 'op1',
            searchbankname: '',
            options: [
              {
                label: 'Open',
                value: 'op1'
              },
              {
                label: 'Used',
                value: 'op2'
              }
            ],
            dialogcheck_giro : {
              dialog : false
            }
        })
        const getDefaultColumns = (cols) => {
            return cols.filter(
              (col) =>
                [
                  'Date',
                  'ID'
                ].includes(col.name)
            );
        }

        const ADD = () => {
          state.dialogcheck_giro.dialog = true
        }

        const onRowClick = (datarow) => {
         const x = props.cheque_giro.data
          for(const i of x){
            i.selected = false
          }
          datarow['selected'] = true;
        }

        const savecheckgiro = () => {
          emit('savecheckgiro', data_value)
          state.dialogcheck_giro.dialog = false
        }

        const search_bankname = () => {
          emit('search_bankname', state.searchbankname)
        }

        const onEdit = (value) => {
          state.dialogcheck_giro.dialog = true
          data_value = value
          edit_data(value)
        }

        const onDelete = (e) => {
        const value = {
          caseType: 1,
          int1: e['rec-id']
        }
          emit('onDelete', value)
        }
        
        return {
            ...toRefs(state),
            tableHeaders,
            ADD,
            onDelete,
            getDefaultColumns,
            onRowClick,
            savecheckgiro,
            search_bankname,
            onEdit
        }
    },
  components: {
    DialogChequegiro: () => import('./childComponents/DialogChequegiro.vue')
  }
})
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
.table-rooming-list {
  max-height: 40vh;
  thead tr th {
    position: sticky;
    z-index: 3;
  }

  thead tr:first-child th {
    top: 0;
  }

  thead tr:last-child th {
    top: 28px;
  }
}
  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }

</style>