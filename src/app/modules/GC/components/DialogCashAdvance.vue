<template>
  <q-dialog v-model="dialog.dialog" persistent  position="top">
    <q-card  style="width: 820px; max-width: 90vw; marginTop: 20px;">
      <q-toolbar>
         <q-toolbar-title 
          class="text-white text-weight-medium">
            NEW
         </q-toolbar-title>
     </q-toolbar>
      <q-card-section class="q-pt-none">
          <div class="row" style="marginTop: 20px">
            <SInput 
            :key="x.name" 
            :label-text="x.name"
            v-model="x.value"
            disable
            :style="{marginRight: x.right, width: x.width}" 
            v-for="x in use_input"/>
          </div>
        <q-splitter v-model="splitterModel">
          <template v-slot:before>
            <q-tabs
              active-color="primary" 
              indicator-color="primary"
              v-model="dialog.tab"
              vertical
              dense
              no-caps
              inline-label
              class="text-gray shadow-2"
            >
              <q-tab 
              :disable="dialog.key == 1 ? false : true" 
              name="ApplicationForm" 
              label="Application Form" />
              <q-tab 
              :disable="dialog.key == 2 ? false : true" 
              name="Payment" 
              label="Payment" />
              <q-tab 
              :disable="dialog.key == 3 ? false : true" 
              name="Settlement" 
              label="Settlement" />
            </q-tabs>
          </template>
          <template v-slot:after>
            <ChildCashAdvance 
            :dataSettelment="dataSettelment"
            :tab="dialog.tab"
            @add_datasettalment="add_datasettalment" 
            @invoiceNumber="invoiceNumber"
            @cek_giro="cek_giro"
            @supplier="supplier"
            @onClickAmount="onClickAmount"/>
            <DialogAmountAC :amount="amount"/>
          </template>
        </q-splitter>
      </q-card-section>
    <q-separator />
    <q-card-actions align="right" class="bg-white text-teal">
      <q-btn unelevated size="sm" v-close-popup color="primary" outline label="Cancel" />
      <q-btn unelevated size="sm" color="primary"  label="OK" @click="onSave" />
    </q-card-actions>
    </q-card>
    <InvoiceNumber
      @onSearch="onSearch" 
      :dialog="dialoge"
      :data="data"
      :get_invoice="get_invoice"
      :hide_bottom="hide_bottom1"/>
    <Account :dialog="dialogAccount" @onSearchAccount="onSearchAccount"/>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api';
import { use_input, input_account, use_inputchild } from '../Input/cash_advance'
import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
import { date, Notify } from 'quasar'
import {store} from '~/store'
import {account_data, data_settelment} from '../utils/params.cashAdvance'
export default defineComponent({
    props : {
        dialog: {} as any
    },

    setup(props, { root: { $api }, emit }) {
      let nr, data_account
      const state = reactive({
        splitterModel: 20,
        data: [],
        use_input: use_input,
        get_invoice: {},
        dialoge: false,
        dialogAccount: {
          dialog: false,
          data: [],
          hide_bottom: false
        },
        hide_bottom1: false,
        amount : {
          dialog: false,
          data: []
        },
        check_giro : 'op1',
        dataSettelment: {
          data: [],
          hide_bottom: false
        }
      })

      const NotifyCreate = (message) => Notify.create({
        message: message,
        position: 'top',
        color: 'red',
        textColor: 'white',
        timeout: 2000,
      });

      const FETCH_DATA = async(api, body) => {
          const [GET_DATA, GET_COMMON ]= await Promise.all([
            $api.generalCashier.FetchAPI(api, body),
            $api.generalCashier.FetchCommon(api, body),
          ]) 

          switch (api) {
            case 'selectAPInvoiceList':
              state.data =  GET_DATA.b1List['b1-list'].map(x => ({
                rgdatum: date.formatDate(x.rgdatum, 'DD/YY/MM'),
                NAME: x['NAME'],
                lscheinnr: x.lscheinnr,
                saldo: formatterMoney(x.saldo),
                selected: false
              }))
              if(state.data.length !== 0){
                state.hide_bottom1 = true
              }
              break;
            case 'selectAccount':
              state.dialogAccount.data = account_data(GET_COMMON)
              data_account = account_data(GET_COMMON)
              if (state.dialogAccount.data.length !== 0) {
                state.dialogAccount.hide_bottom = true
              }
              break;
            case 'addGCPiCheck1':
              if(GET_DATA.availBed !== 'true') {
                NotifyCreate('Name not found')
              } else {
                props.dialog.dialog = false
              }
              break;
            case 'addGCPiCheck1a':
              // console.log('sukses', GET_DATA)
              break;
            case 'saveAddGCPic':
              console.log('sukses', GET_DATA)
              break;
            case 'saveAddGCPi':
             const data = data_settelment(GET_DATA)
             for(const i of data){
               state.dataSettelment.data.push(i)
             }
             if(data.length !== 0){
               state.dataSettelment.hide_bottom = true
             }
              break;
            default:
              break;
          }
      }
      const onSearch = (value) => {
        if(value == '1') {
          state.dialoge = false
        } else {
          const fromDate = date.formatDate(value.fromDate, 'YYYY, MM, DD')
          const toDate = date.formatDate(value.toDate, 'YYYY, MM, DD')
          var d = new Date(fromDate);
          var dy = new Date(toDate);
          d.setDate(d.getDate() - 30);
          dy.setDate(dy.getDate() - 1);
            FETCH_DATA('selectAPInvoiceList', {
              liefNr: nr,
              fromDate: d.toLocaleDateString(),
              toDate: dy.toLocaleDateString()
            })
        }
      }

      const onSearchAccount = () => {
        if (input_account[0].value !== '') {          
            const xi = data_account.filter(x => {  
              return x.fibukonto.includes(input_account[0].value)
              })
              if (xi.length !== 0) {
                state.dialogAccount.data = xi
              } else {
                NotifyCreate('data not found')
              }
        } else if(input_account[1].value !== ''){
            const xi = data_account.filter(x => {  
              return x.bezeich.toLowerCase().includes(
              input_account[1].value.toLowerCase())
            })
            if (xi.length !== 0) {
              state.dialogAccount.data = xi
            } else {
              NotifyCreate('data not found')
            }
        } else if(input_account[2].value !== ''){
            const xi = data_account.filter(x => {  
              return x.deptnr.toString().includes(input_account[2].value)
            })
            if (xi.length !== 0) {
              state.dialogAccount.data = xi
            } else {
              NotifyCreate('data not found')
            }
        } else {
          state.dialogAccount.data = data_account
        }
      }


      onMounted(() => {
        FETCH_DATA('selectAccount', {
          currDept: '1'
        })
      })

      const invoiceNumber = (val) => {
        if (val == '1') {          
          state.dialoge = true
          state.get_invoice = store.getters.gc.GET_APINVOICE
        } else {
          state.dialogAccount.dialog = true
        }
      }

      const onClickAmount = () => {
        state.amount.dialog = true
        state.amount.data = props.dialog.amount
      }

      const supplier = (val) => {
        nr = val.value.data['lief-nr']
        emit('supplier', val)
      }

      const onSave = () => {
        if(props.dialog.tab == 'ApplicationForm'){
          const name = use_inputchild.appForm as any
          if(name[3].value == '' || 
             name[2].value == '' || 
             name[4].value == '' ||
             name[4].value == '0.00'){ 
            if(name[2].value == ''){
              NotifyCreate('Type of Proforma Invoice not selected yet')
            } else if(name[3].value == '') {
              NotifyCreate('Remark not filled-in yet')
            } else if(name[4].value == ''||
              name[4].value == '0.00') {
                NotifyCreate('Amount is still zero')
            }
            } else {
              if(name[0].value == '') {
                NotifyCreate('Name not found')
              } else {                
                FETCH_DATA('addGCPiCheck1', {
                  rcvname : name[0].value.data.username
                })
              }
          }
        } else {
          const name = use_inputchild.Payment as any
          if (state.check_giro == 'op2' && name[0].value == '') {
            NotifyCreate('Cheque/Giro/Bank-Acct Number not filled-in yet')
          } else {
            if (props.dialog.key == 2) {              
              FETCH_DATA('addGCPiCheck1a', {
                payAcctNo : name[4].value.value
              })
            } else if(props.dialog.key == 3){
              // FETCH_DATA('saveAddGCPib', {
              //   pbuff: {
              //     pbuff: [
              //       {
              //         's-recid': '',
              //         reihenfolge: '',
              //         amount: 12000,
              //         remark: 'SUKA suka',
              //         'inv-acctNo': '01009002',
              //         'inv-bezeich': 'No. of Days',
              //         supplier: 'ABG',
              //         invNo: 'zzz',
              //         created: '',
              //         zeit: ''
              //       }
              //     ]
              //   },
              //   pvILanguage: '1',
              //   invAcctNo: '01009002',
              //   invoiceAmt: 12000,
              //   pbuffDocuNr: 12,
              //   PILiefnr: 1890603,
              //   invoiceNr: 'ssss',
              //   invBezeich: 'No. of Days',
              //   invBemerk: 'xxxx',
              //   supplier: 'ABG'
              // })
              FETCH_DATA('saveAddGCPic', {
                pvILanguage: '1',
                docuNr: 'PI012019-0019',
                pbuffPostDate: '06/01/20',
                journaltype: '5',
                giroTempAcct: '01009001',
                userInit: '01'
              })
              console.log('save settalment')
            } else {
              console.log('sukses')
            }
          }
        }
      }
      const cek_giro = (value) => {
        state.check_giro = value
      }
      const add_datasettalment = () => {
        const Settlement = use_inputchild.Settlement as any
        const data = props.dialog.data
        FETCH_DATA('saveAddGCPi', {
          pvILanguage : '1',
          invAcctNo : Settlement[4].value.substring(0, 
          Settlement[4].value.indexOf(' - ')).replace(/-/g, ''),
          invoiceAmt : Number(data.betrag.replace(',', '')),
          pbuffDocuNr : data['docu-nr'],
          PILiefnr : Settlement[0].value.value,
          invoiceNr: Settlement[1].value,
          invBezeich: Settlement[4].value.substring(
          Settlement[4].value.indexOf(' - ')).replace(/-/g, ''),
          invBemerk: Settlement[2].value,
          supplier: Settlement[0].value.data.firma
        })
        for(const i of Settlement.filter(x => ![
          'Return Amount', 'Return Account'
        ].includes(x.name))){
          i.value = ''
        }
      }
      return {
        ...toRefs(state),
        onClickAmount,
        supplier,
        onSearch,
        invoiceNumber,
        onSearchAccount,
        onSave,
        cek_giro,
        add_datasettalment
      }
    },
    components : {
      ChildCashAdvance: () => import('./childComponents/cashadvance.child.vue'),
      DialogAmountAC: () => import('./childComponents/DialogAmountAC.vue'),
      InvoiceNumber: () => import('./childComponents/Invoice_Number.vue'),
      Account: () => import('./childComponents/GC-Account.vue'),
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