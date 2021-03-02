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

        <q-card-section style="height: 405px" class="q-pt-none">
        <q-btn @click="ADD" flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Add.svg')" height="25" />
        </q-btn>
        <SInput style="marginTop: 10px" @keyup="search_bankname" v-model="searchbankname" placeholder="Search Bank Name"/>
        <q-responsive :ratio="16/6">
          <STable
              :loading="cheque_giro.isFetching"
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
                      <q-item-section>Edit</q-item-section>
                    </q-item>
                    <q-item @click="onDelete(props.row)" clickable v-ripple>
                      <q-item-section>Delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </q-tr>
        </template>        
          </STable>
        </q-responsive>
        <div class="row justify-center">
            <q-option-group
              v-model="group"
              :options="options"
              color="primary"
              inline
              @input="onGroup(group)"
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
    <DialogDelete
    @onClickDelete="onClickDelete" 
    :dialogDelete="dialogDelete"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs} from '@vue/composition-api';
import {tableHeaders} from '../tables/Chequegiro.table'
import {edit_data} from '../utils/params.Chequegiro'
import {input_giro}from '../Input/cheque_giro'

export default defineComponent({
    props: {
        cheque_giro: {} as any
    },
    setup(props, {emit}){
      let data = props.cheque_giro.data
      let data_value
        const state = reactive({
            group: 'open',
            searchbankname: '',
            options: [
              {
                label: 'Open',
                value: 'open'
              },
              {
                label: 'Used',
                value: 'used'
              }
            ],
            dialogcheck_giro : {
              dialog : false,
              header: 'New',
            },
            dialogDelete: {
              confirm: false,
              message: 'Are you sure you want to delete the selected record?',
              value: ''
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
          for(const i of input_giro){
            i.value = ''
          }
          state.dialogcheck_giro.dialog = true
          state.dialogcheck_giro.header = 'New'
          input_giro[1].disable = false
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
          emit('search_bankname', state.searchbankname, state.group)
        }

        const onGroup = (group) => {
          emit('onGroup', group)
        }

        const onEdit = (value) => {
          for(const i of input_giro){
            i.value = ''
          }
          input_giro[1].disable = true
          state.dialogcheck_giro.dialog = true
          state.dialogcheck_giro.header = 'Edit'
          data_value = value
          edit_data(value)
        }

        const onDelete = (e) => {
          state.dialogDelete.confirm = true
          state.dialogDelete.value = e
        }

        const onClickDelete = (e) => {
          state.dialogDelete.confirm = false
          const value = {
            caseType: 1,
            int1: e.value['rec-id']
          }
           emit('onDelete', value)
        }

        const onCheckGiro = (group) => {
          emit('onCheckGiro', group)
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
            onEdit,
            onClickDelete,
            onGroup
        }
    },
  components: {
    DialogChequegiro: () => import('./childComponents/DialogChequegiro.vue'),
    DialogDelete: () => import('./DialogDelete.vue')
  }
})
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
.table-rooming-list {
  // max-height: 40vh;
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