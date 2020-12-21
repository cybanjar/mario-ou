<template>
  <div>
  <div class="column justify-between">
    <div class="col-7" style="height: 565px">
      <div class="row">
        <div style="marginLeft: 10px" class="col-4">
          <div class="q-pa-lg">
            <div class="row">
              <SInput
                :key="i.name"
                v-for="i in use_input"
                :label-text="i.name"
                :style="{width: i.width, marginTop: i.top, marginRight: i.right}"
                :disable="i.disable"
                v-model="i.value"
              />
            </div>
          </div>
            <div class="q-pa-md">
              <q-input
                style="max-width: 375px"
                filled
                type="textarea"
              />
            </div>
        </div>
      <div style="marginLeft: -20px" class="col-8">
        <div class="q-pa-lg">
          <div class="row">
            <SInput
              :key="i.name"
              :label-text="i.name"
              v-for="i in use_input2.filter(col => ![
              'return'].includes(col.name))"
              :style="{width: i.width, marginRight: i.right}"
              @click.prevent="dialogDeliveryNumber(i)"
              @blur="unitQuantity(i.blur)"
              :disable="i.disable"
              v-model="i.value"
            >
            <q-icon 
              v-if="i.icon"
              color="primary" 
              name="mdi-magnify" 
              style="
              font-size: 20px; 
              marginRight: -10px; 
              backroundColor: red; 
              marginTop: 3px"/>
            </SInput>
            <q-btn
              :key="i.name"
              v-for="i in use_input2.filter(col => [
              'return'].includes(col.name))"
              size="sm"
              color="primary"
              max-height="10"
              :label="i.name"
              style="width: 80px; marginTop: 25px; height: 25px;"
              @click="Clickreturn"
              :disable="i.disable"
            />
          </div>
          <q-card-actions align="right">
              <span style="marginRight: 100px">
                Total Amount Return:
              </span>
              <span>
                1.000.000
              </span>
          </q-card-actions>
          <STable
            class="table-rooming-list"
            :columns="tableHeaders"
            :data="data"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
            :hide-bottom="hide_bottom"
            flat bordered
          >
            <template v-slot:body="props">
              <q-tr
              :class="{
                selected : props.row.selected
              }" 
              :props="props" 
              @click="onRowClick2(props.row)">
                <q-td
                :props="props"
                v-for="col in props.cols"
                :key="col.name"
                >
                  {{col.value}}
                </q-td>
              </q-tr>
            </template>
          </STable>
        </div>
      </div>
    </div>
    </div>
    <div class="col-1">
    <q-separator />
      <q-card-actions align="right">
        <q-btn
          size="sm"
          outline
          color="primary"
          label="Cancel"
          style="width: 100px; height: 25px; marginRight: 20px; marginTop: -4px"
        />
        <q-btn
          size="sm"
          color="primary"
          label="save"
          style="width: 100px; height: 25px; marginRight: 20px; marginTop: -4px"
          @click="saveReturn"
        />
      </q-card-actions>
  
    </div>
    </div>
    <div>
      <q-dialog v-model="dialogModel">
        <q-card style="width: 500px;">
            <q-toolbar>
                <q-toolbar-title 
                  class="text-white text-weight-medium">
                  Select Delivery Number
                </q-toolbar-title>
             </q-toolbar>
                <q-card-section>
                  <STable
                    class="table-rooming-list2"
                    :columns="DeliveryNumber"
                    :data="dataDeliveryNumber"
                    separator="cell"
                    :rows-per-page-options="[0]"
                    :pagination.sync="pagination"
                    :hide-bottom="hide_bottom2"
                    flat bordered
                  >
                  <template v-slot:body="props">
                    <q-tr
                    :class="{
                      selected : props.row.selected
                    }" 
                    :props="props" 
                    @click="onRowClick(props.row)">
                      <q-td
                      :props="props"
                      v-for="col in props.cols"
                      :key="col.name"
                      >
                        {{col.value}}
                      </q-td>
                    </q-tr>
                  </template>
                  </STable>
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                  <q-btn 
                  size="sm" 
                  label="Cancel" 
                  style="height: 30px" 
                  @click="onClickCencelDeliveryNumber"/>

                  <q-btn 
                  size="sm" 
                  color="primary" 
                  label="OK" 
                  style="height: 30px"
                  @click="onClickDeliveryNumber" />
                </q-card-actions>
          </q-card>
      </q-dialog>
    </div>
    <div>
      <q-dialog v-model="modalReturn" persistent>
        <q-card style="min-width: 350px">
           <q-toolbar>
                <q-toolbar-title 
                  class="text-white text-weight-medium">
                  Stock Return
                </q-toolbar-title>
             </q-toolbar>
          <q-card-section>
            <div class="text-h8">Enter Cencel Reason</div>
          </q-card-section>
  
          <q-card-section class="q-pt-none">
            <q-input dense v-model="reasson" autofocus @keyup.enter="prompt = false" />
          </q-card-section>
  
          <q-card-actions align="right" class="text-primary">
            <q-btn size="sm" flat label="Cancel" v-close-popup />
            <q-btn   color="primary" size="sm" label="Ok" v-close-popup @click="enterCencelReason"/>
          </q-card-actions>
      </q-card>
    </q-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  watch
} from '@vue/composition-api';
import { Notify, date } from 'quasar';
import { 
 tableHeaders,
 DeliveryNumber, 
 use_input, 
 use_input2 } from './tables/IncomingStock.tables';
import {x, params} from './utils/params.incomingstock'
export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts, rowDev, rowDN, valTable;

    const state = reactive({
      isFetching: false,
      data: [],
      dataDeliveryNumber: [],
      hide_bottom2: false,
      hide_bottom: false,
      searches: {
        departments: [],
        store: [],
      },
      dialogModel: false,
      modalReturn: false,
      reasson: ''
    });

    const NotifyCreate = (message) => Notify.create({
      message: message,
      type: 'negative',
      position: 'top',
      textColor: 'white',
      timeout: 2000,
    });

    const FETCH_API = async (api, body) => {
      const [GET_DATAcommon, GET_DATA] = await Promise.all([
        $api.inventory.FetchCommon(api, body),
        $api.inventory.FetchAPIINV(api, body)
      ])
        switch (api) {
          case 'checkPermission':
            if (GET_DATAcommon.zugriff !== 'true') {
              NotifyCreate('Sorry, no access right')
            } else {
              use_fetchdata()
            }
            break;
          case 'pchaseStockInReturnPrepare':
            charts = Object.assign(
              GET_DATA,
              GET_DATA.tLOrderhdr['t-l-orderhdr'][0]
            )
            params.map((items, index) => {
              use_input[
                index
              ].value = x(charts)[
                items as any]
              use_input2[0].value2 = x(charts)['docu-nr']
            })
            const select = {
              selected: false
            }
            state.data = GET_DATA.tLArtikel['t-l-artikel'].map((item, i) =>
             Object.assign({}, item, GET_DATA.tLOrder['t-l-order'][i], select))
             if (state.data.length !== 0) {
               state.hide_bottom = true
             }
            break;
          case 'poDeliverNote':
            state.dataDeliveryNumber = GET_DATA.delivernoteList[
              'delivernote-list'].map(items => ({
              datum: date.formatDate(items.datum, 'DD/MM/YYYY'),
              'lager-nr': items['lager-nr'],
              'docu-nr': items['docu-nr'],
              lscheinnr: items.lscheinnr,
              selected: false
            }))
            if (state.dataDeliveryNumber.length !== 0) {
              state.hide_bottom2 = true
            }
            break;
          case 'pchaseStockInReturnSelectSchein':
            rowDN = `${GET_DATA.currLager}-${GET_DATA.lagerBezeich}`
            break;
          case 'pchaseStockInReturnLscheinnr':
            if (GET_DATA.errCode == 1) {
              NotifyCreate('No such document number')
            }
            break;
          case 'getHTParam0':
            if(GET_DATAcommon.flogical == 'false'){
              state.modalReturn = true
            } else {
              NotifyCreate('Inventory is running, posting not possible')
            }
            break;
          case 'pchaseStockInReturnQty':
            console.log(GET_DATA)
            break;
          case 'pchaseStockInReturnUpdateAP':
            console.log('sukses', GET_DATA)
            break;
          default:
            console.log(GET_DATA)
            break;
        }
    }

    onMounted(() => {
      FETCH_API('checkPermission', {
        userInit: '01',
        arrayNr: '39',
        expectedNr: '2'
      })
    });

    const use_fetchdata = () => {
      // docuNR Mengambil dari state global
      FETCH_API(
        'pchaseStockInReturnPrepare', {
        "bedienerPermissions": " ",
        "docuNr": "P190114001"
      })
    }

    const dialogDeliveryNumber = (value) => {
      if (value.onClick == 'DeleveryNumber') {
        state.dialogModel = true
        FETCH_API('poDeliverNote', {
           "docuNr": value.value2
        })
      }
    }

    const onRowClick = (rowClick) => {
      rowDev = rowClick
      FETCH_API('pchaseStockInReturnSelectSchein', {
        lOrderhdrDocuNr: charts['docu-nr'],
        lOrderhdrLiefNr: charts['lief-nr'],
        docuNr: rowClick['docu-nr'],
        lscheinnr: rowClick.lscheinnr
      })
      for(const i of state.dataDeliveryNumber){
        i.selected = false
      }
      rowClick['selected'] = true
    }

    const onClickDeliveryNumber = () => {
      use_input2[0].value = rowDev.lscheinnr
      use_input2[1].value = rowDN
      state.dialogModel = false
      FETCH_API('pchaseStockInReturnLscheinnr', {
        docuNr: rowDev['docu-nr'],
        lscheinnr: rowDev.lscheinnr
      })
    }


    const data_incomingsock = (data) => {
      return {
        endkum: data.endkum,
        rechnungspreis: data.rechnungspreis,
        warenwert: data.warenwert,
        'lief-fax': data['lief-fax'][0],
        artnr: `${data.artnr} - ${data.bezeich}`
      }
    }
        
    const onRowClick2 = (val) => {
      valTable = val
        if (use_input2[0].value !== '') {
          const x = use_input2.filter(i => [
              'Mess Unit Quantity',
              'Delivery Unit Quantity',
              'return'
            ].includes(i.name))
          for(const i of x){
            i.disable = false
          }
          for(const i of state.data){
            i.selected = false
          }
          val['selected'] = true
          const xi = ['Item Selected','Content', 'Unit Price', 'Amount',
          'Delivery Unit']
          const ky = ['artnr', 'lief-fax', 'endkum', 'rechnungspreis', 'warenwert']
          const xii = use_input2.filter(i => xi.includes(i.name))
          ky.map((x, i) => {
            xii[i].value = data_incomingsock(val)[x]
          })
        }
      };

    const unitQuantity = (value) => {
      const x = use_input2[5].value as any
      if (value == 'dileveryUnit') {
        if(!isNaN(x)){
          if (valTable.anzahl < Number(x)) {
            NotifyCreate('Wrong quantity')
          }
        } else {
            NotifyCreate('not a number')
        }
      }
    }

    const Clickreturn = () => {
      FETCH_API('getHTParam0', {
        casetype: 2,
        inpParam: 110
      })
    }

    const enterCencelReason = () => {
      const x = valTable.endkum <= 2 ?
      charts['p224'] : charts['p221']
      FETCH_API('pchaseStockInReturnQty', {
        transdate: charts['p474'],
        closedate: x,
        sArtnr: valTable.artnr,
        currLager: rowDN.substring(0, rowDN.indexOf('-')),
        qty: use_input2[5].value
      })
      FETCH_API('pchaseStockInReturnSave', {
        "lOrderRecId": charts['rec-id'],
        "sArtnr": valTable.artnr,
        "docuNr": "P190114001",
        "exchgRate": charts['docu-nr'],
        "priceDecimal": charts.priceDecimal,
        "liefNr": charts['lief-nr'],
        "currLager": rowDN.substring(0, rowDN.indexOf('-')),
        "lscheinnr": rowDev.lscheinnr,
        "fEndkum": charts.fEndkum,
        "bEndkum": charts.bEndkum,
        "mEndkum" : charts.mEndkum,
        "billdate" : charts.billdate,
        "fbClosedate": charts.fbClosedate,
        "mClosedate": charts.mClosedate,
        "reason": state.reasson,
        "userInit" : "01",
        "qty" : use_input2[5].value,
        "price": use_input2[7].value,
        "amount": valTable.rechnungspreis,
        "tAmount":  valTable.warenwert
      })
    }

    const saveReturn = () => {
      FETCH_API('pchaseStockInReturnUpdateAP', {
        docuNr: charts['docu-nr'],
        "tAmount": valTable.rechnungspreis,
        "liefNr": charts['lief-nr'],
        "billdate": charts.billdate,
        "lscheinnr" : rowDev.lscheinnr,
        "bedienerNr" : "01"
      })
    }

// batas

    const onClickCencelDeliveryNumber = () => {
      state.dialogModel = false
      // state.deliveryNumber = ''
      // state.storageNumber = ''
    }
    return {
      ...toRefs(state),
      Clickreturn,
      enterCencelReason,
      use_input,
      use_input2,
      unitQuantity,
      tableHeaders,
      onClickDeliveryNumber,
      onClickCencelDeliveryNumber,
      onRowClick,
      onRowClick2,
      dialogDeliveryNumber,
      DeliveryNumber,
      saveReturn,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
  max-height: 10px;
  height: 10px
  
}
.table-rooming-list {
  max-height: 50vh;
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

  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }
}
.table-rooming-list2 {
  max-height: 30vh;
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

  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }
}
</style>
