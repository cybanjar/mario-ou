<template>
  <q-tab-panels
    v-model="tab"
    animated
    swipeable
    vertical
    transition-prev="jump-up"
    transition-next="jump-up"
  >
    <q-tab-panel style="height: 351px" name="ApplicationForm">
      <v-date-picker v-model="date"  :popover="{ visibility: 'click' }">
        <SInput
          label-text="From Date"
          slot-scope="{ inputProps }"
          readonly
          style="width: 160px"
          v-bind="inputProps"
        />
      </v-date-picker>
      <div class="row">
          <SSelect
            v-for="x in use_inputchild.appForm.filter(x => [
            'Name'].includes(x.name))"
            :key="x.name"
            :label-text="x.name"
            :style="{width: x.width, marginRight: x.right}"
            v-model="x.value"
            :options="x.options"
          />
          <SInput 
            v-for="x in use_inputchild.appForm.filter(x => [
            'Departement'].includes(x.name))"
            :key="x.name"
            :label-text="x.name"
            :style="{width: x.width, marginRight: x.right}"
            v-model="x.value"
            :disable="x.disable"
          />
          <SSelect
            v-for="x in use_inputchild.appForm.filter(x => [
            'Purpose'].includes(x.name))"
            v-model="x.value"
            :key="x.name"
            :label-text="x.name"
            :options="x.options"
            :style="{width: x.width, marginRight: x.right}"
          />
          <SInput 
            v-for="x in use_inputchild.appForm.filter(x => [
            'Remark', 'Amount', 'Account'].includes(x.name))"
            :key="x.name"
            :label-text="x.name"
            :style="{width: x.width, marginRight: x.right}"
            v-model="x.value"
            @click="X(x.onClick)"
            :disable="x.disable"
          />
      </div>
    </q-tab-panel>
    <q-tab-panel style="height: 422px" name="Payment">
      <v-date-picker v-model="date"  :popover="{ visibility: 'click' }">
        <SInput
          label-text="From Date"
          slot-scope="{ inputProps }"
          readonly
          style="width: 160px"
          v-bind="inputProps"
        />
      </v-date-picker>
      <div class="row">
          <div style="marginRight: 107px"> 
            Type        
            <q-option-group
              v-model="group"
              :options="options"
              size="xs"
              style="marginLeft: -10px;"
              @input="onGiro"
            />
          </div>
          <div>
            <SSelect 
            :label-text="x.name" 
            v-for="x in use_inputchild.Payment.filter(x=> [
            '1'].includes(x.key))" 
            :disable="x.disable"
            :key="x.name"
            :options="x.options"
            v-model="x.value"
            :style="{width: x.width, marginRight: x.right}"/>
            <div class="row">
              <v-date-picker 
              v-for="x in use_inputchild.Payment.filter(x => ![
              '1', '2', '3'].includes(x.key))" 
              :key="x.name" 
              v-model="x.value"  
              :popover="{ visibility: group == 'op2'? 'click': null }">
                <SInput 
                :label-text="x.name" 
                placeholder="From"
                slot-scope="{ inputProps }"
                :disable="x.disable"
                v-bind="inputProps"
                :style="{width: x.width, marginRight: x.right, marginTop: x.top}"/>
              </v-date-picker>
            </div>
        </div>
        <SInput 
          :label-text="x.name" 
          v-for="x in use_inputchild.Payment.filter(x => [
          '2'].includes(x.key))" 
          :key="x.name"
          :style="{width: x.width, marginRight: x.right}"/>
        <SSelect 
          :label-text="x.name" 
          v-for="x in use_inputchild.Payment.filter(x => [
          '3'].includes(x.key))" 
          :key="x.name"
          :options="x.options"
          v-model="x.value"
          :style="{width: x.width, marginRight: x.right}"/>
        <q-checkbox size="xs" v-model="Approve" label="Approve" />
      </div>
    </q-tab-panel>
    <q-tab-panel style="height: 420px" name="Settlement">
      <div>
        <v-date-picker v-model="date"  :popover="{ visibility: 'click' }">
          <SInput
            label-text="From Date"
            slot-scope="{ inputProps }"
            readonly
            style="width: 160px"
            v-bind="inputProps"
          />
        </v-date-picker>
        <div class="row">
          <SSelect
            :label-text="x.name" 
            v-for="x in use_inputchild.Settlement.filter(x => [
            'Supplier'].includes(x.name))" 
            :key="x.name"
            :options="x.options"
            v-model="x.value"
            @input="supplier(x)"
            :style="{width: x.width, marginRight: x.right, marginTop: x.top}"/>
          <SInput 
            :label-text="x.name" 
            v-for="x in use_inputchild.Settlement.filter(x => ![
            'Supplier'].includes(x.name))" 
            :key="x.name"
            @click="invoice_number(x.onClick)"
            v-model="x.value"
            :style="{width: x.width, marginRight: x.right, marginTop: x.top}"/>
        </div>
        <div class="row justify-between">
            <q-checkbox 
            style="marginTop: -10px; marginLeft: -5px" 
            size="xs" 
            v-model="Approve" 
            label="Approve" />
            <q-btn 
              style="left: -15px; width: 150px" 
              size="sm" 
              color="primary"  
              label="ADD" 
              @click="add_datasettalment" />
        </div>
        <STable
          style="marginTop: 10px"
          :columns="table_settelment"
          :data="dataSettelment.data"
          :rows-per-page-options="[0]"
          :hide-bottom="dataSettelment.hide_bottom"
          class="table-accounting-date"
        />
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs} from '@vue/composition-api';
import { DatePicker } from 'v-calendar';
import {table_settelment } from '../../tables/CashAdvance.table'
import { use_inputchild } from '../../Input/cash_advance'
import { Notify, date } from 'quasar'
export default defineComponent({
    props : {
        tab: {} as any,
        dataSettelment: {} as any,
    },
    setup(_, { root: { $api }, emit }){
      let nr
        const state = reactive({
            date: new Date(),
            Approve: false,
            use_inputchild: use_inputchild,
            group: 'op1',
            options: [
              {
                label: 'Cash',
                value: 'op1'
              },
              {
                label: 'Cheque / Giro',
                value: 'op2'
              },
              {
                label: 'Bank Transfer',
                value: 'op3'
              }
            ]
        })

        const NotifyCreate = (message) => Notify.create({
          message: message,
          position: 'top',
          color: 'red',
          textColor: 'white',
          timeout: 2000,
        });

        const onGiro = (val) => {
         emit('cek_giro', val)
         for(const i of use_inputchild.Payment.filter(x => [
           'Cheque / Giro Number', 'Due Date', 'Clearing Date'
         ].includes(x.name))){
          if (val == 'op2') {
            i.disable = false
          } else {
            i.disable = true
          }
         }
        }

        const X = (val) => {
          if (val == 'true') {
            emit('onClickAmount')
          }
        }

        const supplier = (val) => {
          nr = val.value.data['lief-nr']
          emit('supplier', val)
        }

        const invoice_number = (val) => {
          if(val == '1'){
            if(use_inputchild.Settlement[0].value !== ''){
              emit('invoiceNumber', '1')
            } else {
              NotifyCreate('The supplier has not been filled')
            }
          }
          if (val == '2') {
            emit('invoiceNumber', '2')
          }
        }

        const add_datasettalment = () => {
          emit('add_datasettalment')
        }
        return {
           ...toRefs(state),
           table_settelment,
           onGiro,
           X,
           supplier,
           invoice_number,
           add_datasettalment
        }
    },
    components: {
      'v-date-picker': DatePicker,
      InvoiceNumber: () => import('./Invoice_Number.vue')
    },
})
</script>