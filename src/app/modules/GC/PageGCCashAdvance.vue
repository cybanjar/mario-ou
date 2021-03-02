<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="225" persistent>
      <SearchCashAdvance @onSearch="onSearch"/>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn @click="onClickDialog" flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Add.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>
      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :hide-bottom="hide_bottom"
        class="table-accounting-date"
        flat
        bordered
      >
        <template #header-cell-actions="props">
          <q-th style="z-index: 5" :props="props" class="fixed-col right">
            {{ props.col.label }}
          </q-th>
        </template>

        <template #body="props">
          <q-tr
            :props="props"
            @click="onRowClick(props.row)"
            :class="{
              selected: props.row.selected,
            }"
          >
            <q-td
              :key="col.name"
              :props="props"
              v-for="col in props.cols.filter(
                (x) => !['actions'].includes(x.name)
              )"
            >
              {{ col.value }}
            </q-td>
            <q-td :props="props" key="actions" class="fixed-col right">
              <q-icon name="mdi-dots-vertical" size="16px">
                <q-menu auto-close anchor="bottom right" self="top right">
                  <q-list>
                    <q-item clickable v-ripple @click="onClickEdit(props.row)">
                      <q-item-section>Edit</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="deleteDataRow(props.row)"
                    >
                      <q-item-section>Delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </q-tr>
        </template>
      </STable>
    </div>
    <DialogCashAdvance @supplier="supplier" :dialog="dialog" />
    <FundCalculator :fund_calculator="fund_Calculator" />
    <Chequegiro
      @search_bankname="search_bankname"
      @onGroup="onGroup"
      @savecheckgiro="savecheckgiro" 
      @onDelete="onDelete"
      @onCheckGiro="onCheckGiro"
      :cheque_giro="cheque_Giro"/>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  ref,
} from '@vue/composition-api';
import {tableHeaders} from './tables/CashAdvance.table'
import { Search, use_input } from './Input/cash_advance'
import {dataTable, dataChildInput} from './utils/params.cashAdvance'
import {data_table, newValues} from './utils/params.Chequegiro'
import {FUNDCALCULATOR} from './utils/params.fundCalculator'
import {date, Notify} from 'quasar'
import {SET_APINVOICE} from './actions'
import { input_giro } from './Input/cheque_giro'
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let data_giro;
    const state = reactive({
      isFetching: false,
      data: [],
      hide_bottom: false,
      fund_Calculator: {
        dialog: false,
        data: [],
        hide_bottom: false,
      },
      cheque_Giro: {
        dialog: false,
        data: [],
        isFetching: false,
      },
      dialog: {
        dialog: false,
        key: 1,
        tab: 'ApplicationForm',
        amount: [],
        data: {},
      },
    });

    useExtraMenu([
      {
        handler: () => fund_calculator(),
        icon: 'GC/Icon-FundCalculator',
      },
      {
        handler: () => cheque_giro(),
        icon: 'GC/Icon-Chequegiro',
      },
    ]);

        const NotifyCreate = (message) => Notify.create({
          message: message,
          position: 'top',
          color: 'red',
          textColor: 'white',
          timeout: 2000,
        });
        const NotifySukses = (message) => Notify.create({
          message: message,
          position: 'top',
          type: 'positive',
          timeout: 2000,
        });
        const NotifyDelete = (message, val) => Notify.create({
          message: message,
          color: 'primary',
          textColor: 'white',
          type: 'info',
          timeout: 0,
          position: 'center',
          actions: [
            { label: 'Cancel', color: 'white', handler: () => { /* ... */ } },
            { label: 'Ok', color: 'white', handler: () => {
              FETCH_API('gcPilistDelete', {
                'Docu-nr': val['docu-nr'],
                'User-init': '01',
              });
            },
          },
        ],
      });
    const FETCH_API = async (api, body?) => {
      const [GET_DATA, GET_COMMON] = await Promise.all([
        $api.generalCashier.FetchAPI(api, body),
        $api.generalCashier.FetchCommon(api, body),
      ]);

      switch (api) {
        case 'gcPilist':
          const x = dataTable(GET_DATA);
          for (const ix of x) {
            ix['selected'] = false;
          }
          setTimeout(() => {
            state.isFetching = false;
            if (x.length !== 0) {
              state.data = x;
              state.hide_bottom = true;
            } else {
              NotifyCreate('Data not found');
            }
          }, 2000);
          break;
        case 'prepareAddGCPi':
          dataChildInput(GET_DATA);
          state.dialog.amount = GET_DATA.sList['s-list'];
          break;
        case 'selectSystemUser':
          dataChildInput(GET_COMMON);
          break;
        case 'readPiAcct':
          dataChildInput(GET_DATA);
          break;
        case 'getSupplierList':
          dataChildInput(GET_COMMON);
          break;
        case 'gcGiroRead':
          data_giro = data_table(GET_DATA);
          state.cheque_Giro.data = data_giro;
          dataChildInput(GET_DATA);
          state.cheque_Giro.isFetching = false;
          break;
        case 'selectAPInvoicePrepare':
          SET_APINVOICE(GET_DATA);
          break;
        case 'fundsReportChkAcctno':
          dataChildInput(GET_DATA);
          break;
        case 'gcGiroDelete':
          if (GET_DATA.successFlag == 'true') {
            NotifySukses('sukses');
            refresh();
          } else {
            NotifyCreate('Delete Failed');
          }
          break;
        case 'gcGiroSave':
          for (const i of input_giro) {
            i.value = '';
          }
          setTimeout(() => {
            refresh();
            if (GET_DATA.errCode == 1) {
              NotifyCreate('error');
            } else {
              NotifySukses('sukses');
            }
          }, 2000);
          break;
        case 'selectGCPI':
          state.fund_Calculator.data = dataChildInput(GET_DATA);
          if (state.fund_Calculator.data.length !== 0) {
            state.fund_Calculator.hide_bottom = true;
          }
          break;
        default:
          break;
      }
    };

    const refresh = () => {
      FETCH_API('gcGiroRead', {
        caseType: '1',
      });
    };

        onMounted(() => {
          FETCH_API('prepareAddGCPi', {
            "languageCode": 1,
		        "piNumber": "  ",
		        "userInit": "01"
          })
          FETCH_API('selectSystemUser', {
            caseType: 3,
            uname: ' '
          })
          FETCH_API('readPiAcct', {
            caseType: 1,
            int1: 0
          })
          FETCH_API('getSupplierList')
          FETCH_API('selectGCPI')
          FETCH_API('fundsReportChkAcctno', {
            currDate: "01/14/19"
          })
          FETCH_API('gcGiroRead', {
            caseType: '1'
          })
        })
        
        const onSearch = (value) => {
          const display = Search[2].value as any        
          state.isFetching = true
          FETCH_API('gcPilist', {
            "fromDate": date.formatDate(value.date.start, 'DD/MM/YYYY'),
		        "fromName": value.from_name !== ''? value.from_name: ' ',
		        "notClearing": value.checbox,
		        "sorttype": display.value,
		        "toDate": date.formatDate(value.date.end, 'DD/MM/YYYY'),
		        "toName": value.to_name,
          })
        }

    const supplier = (val) => {
      FETCH_API('selectAPInvoicePrepare', {
        liefNr: val.value.data['lief-nr'],
      });
    };

    const onClickDialog = () => {
      state.dialog.dialog = true;
      state.dialog.key = 1;
      use_input[2].value = 'APPLY';
    };

    const onClickEdit = (val) => {
      state.dialog.dialog = true;
      if (val['pi-status'] == 0) {
        state.dialog.tab = 'Payment';
        state.dialog.key = 2;
        state.dialog.data = val;
        use_input[2].value = 'APPLY';
      } else {
        state.dialog.tab = 'Settlement';
        state.dialog.key = 3;
        state.dialog.data = val;
        use_input[2].value = 'POSTED';
      }
    };

    const deleteDataRow = (val) => {
      NotifyDelete(
        'Are you sure you want to cancel the selected PI record',
        val
      );
    };

        const fund_calculator = () => {
          state.fund_Calculator.dialog = true
          FUNDCALCULATOR()
        }
        const cheque_giro = () => {
          state.cheque_Giro.dialog = true
        }
        const savecheckgiro = (e) => {
          state.cheque_Giro.isFetching = true
          FETCH_API('gcGiroSave', newValues(e))
        }
        const onDelete = (e) => {
          FETCH_API('gcGiroDelete', e)
        }
        let searchBankname
        const onGroup = (giro) => {
        if (searchBankname == undefined) {
          state.cheque_Giro.data = data_giro.filter(items => {
            return items['giro-status'].toLowerCase() == giro.toLowerCase()
          })  
        } else {
          const data = data_giro.filter(x => {
              return x.bankname
             .toLowerCase().includes(
               searchBankname.toLowerCase())
            })
            state.cheque_Giro.data = data.filter(items => {
              return items['giro-status'].toLowerCase() == giro.toLowerCase()
            })          
        }
        }

        const search_bankname = (val, giro) => {
          searchBankname = val
          const result = data_giro.filter(items => {
            return items['giro-status'].toLowerCase() == giro.toLowerCase()
          })     
          const data = result.filter(x => {
            return x.bankname
           .toLowerCase().includes(
             val.toLowerCase())
          })
          if(data.length !== 0){
            state.cheque_Giro.data = data
          } else {
            NotifyCreate('data not found')
          }      
        }

        const onRowClick = (datarow) => {
          for(const i of state.data){
            i.selected = false
          }
          datarow['selected'] = true; 
        }
        return {
            ...toRefs(state),
            tableHeaders,
            onSearch,
            onClickDialog,
            onClickEdit,
            supplier,
            deleteDataRow,
            fund_calculator,
            cheque_giro,
            savecheckgiro,
            onDelete,
            search_bankname,
            onGroup,
            onRowClick
        }
    },
    components: {
      SearchCashAdvance: () => import('./components/SearchCashAdvance.vue'),
      DialogCashAdvance: () => import('./components/DialogCashAdvance.vue'),
      FundCalculator: () => import('./components/FundCalculator.vue'),
      Chequegiro: () => import('./components/Chequegiro.vue'),
    },
})
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
::v-deep .table-accounting-date {
  max-height: 75vh;

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
