<template>
  <div>
    <q-dialog v-model="fund_calculator.dialog" persistent>
      <q-card style="width: 950px; max-width: 90vw; height: 500px">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">
             Fund Calculator
          </q-toolbar-title>
        </q-toolbar>

        <q-card-section style="marginTop: 10px; height: 395px" class="q-pt-none row">
          <div class="col-5 row">
              <SSelect
              :label-text="x.name" 
              v-model="x.value"
              :options="x.options"
              @input="accountnumber(x)"
              :style="{width: x.width, marginRight: x.right, marginLeft: x.left}"
              v-for="x in use_input.filter(x => [
              'Account Name'
              ].includes(x.name))"/>
              <SInput 
                :label-text="x.name" 
                v-model="x.value"
                :style="{width: x.width, marginRight: x.right}"
                :disable="x.disable"
                v-for="x in use_input.filter(x => [
                'Account Number'
                ].includes(x.name))"/>
              <q-btn
                style="width: 355px; margintop: -25px; height: 25px;"
                size="sm"
                max-height="10"
                color="primary"
                label="Add"
                unelevated
                @click="clickAdd"
              />
              <SRemarkLeftDrawer 
                v-for="x in use_input.filter(x => [
                'Total Debit', 'Balance'
                ].includes(x.name))" 
                :key="x.name"
                :style="{width: x.width, marginRight: x.right, marginTop: x.top}" 
                :label="x.name" 
                :value="x.value" />
              <SInput 
                @keyup="onReserved(x)"
                :label-text="x.name" 
                v-model="x.value"
                :style="{width: x.width, marginRight: x.right}"
                :disable="x.disable"
                v-for="x in use_input.filter(x => [
                'Reserved Balance', 'Additional Fund Needed',
                'Requested Ending Balance', 'Cheque/Giro To Be Opened'
                ].includes(x.name))"/>
          </div>
          <div class="col-7">
            <STable
              style="marginTop: 15px"
              :columns="tableHeaders"
              :data="data"
              :rows-per-page-options="[0]"
              :hide-bottom="hide_bottom"
              class="table-accounting-date"
              flat bordered
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
    <ModalFundCalculatorAdd
    @addData="addData" 
    :fund_calculator="fund_calculator"
    :modal_fundcalculatoradd="modal_fundcalculatoradd"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch} from '@vue/composition-api';
import {use_input} from '../Input/Fund_Calculator'
import { Notify } from 'quasar'
import { tableHeaders, tableHeadersAdd } from '../tables/FundCalculator'
import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
export default defineComponent({
    props: {
      fund_calculator: {} as any
    },
    setup(props){
      let hasil = 0
      let hasil2
      const state = reactive ({
        use_input: use_input,
        data: [],
        hide_bottom: false,
        modal_fundcalculatoradd: {
          dialog: false,
          tableHeadersAdd
        }
      })

      const NotifyCreate = (message) => Notify.create({
        message: message,
        position: 'top',
        color: 'red',
        textColor: 'white',
        timeout: 2000,
      });


      const onReserved = (params) => {
        if (!isNaN(params.value)) {          
          if(params.onCLick == 'reserved'){
          let hasil = Number(use_input[2].value.replace(/,/g, '')) - Number(use_input[3].value.replace(/,/g, ''))
          hasil2 = Number(use_input[4].value) + hasil
          use_input[5].value = formatterMoney(hasil2)
          if ( use_input[4].value !== '') {
             use_input[6].disable = false
          } else {
            use_input[5].value = ''
            use_input[6].disable = true
          }
          }
          if(params.onCLick == 'Requested'){
            let hasilGiro = hasil2 + Number(use_input[6].value)
            use_input[7].value = formatterMoney(hasilGiro)
          }
        } else {
          NotifyCreate('not a number')
        }
      }

      watch(() => props.fund_calculator.dialog,
      (dialog) => {
        state.data = []
        state.hide_bottom = false
      })

      const addData = (data) => {
        hasil += Number(data.data.betrag.replace(/,/g, ''))
        use_input[2].value = formatterMoney(hasil)
        state.data.push(data.data)
        if(state.data.length !== 0){
          state.hide_bottom = true
          use_input[4].disable = false
        }
      }

      const clickAdd = () => {
        state.modal_fundcalculatoradd.dialog = true
      }

      const accountnumber = (val) => {
        use_input[1].value = val.value.value
      }

      return {
        ...toRefs(state),
        tableHeaders,
        clickAdd,
        addData,
        onReserved,
        accountnumber
      }
    },
    components: {
      ModalFundCalculatorAdd: () => import('./childComponents/ModalFundCalculatorAdd.vue')
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