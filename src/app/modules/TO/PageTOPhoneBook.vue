<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <SearchPhoneBook  @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn @click="showModal" flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Add.svg')" height="25" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" @click="doPrint" height="25" />
        </q-btn>
      </div>
      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        :hide-bottom="hide_bottom"
        class="table-accounting-date"
        id="printMe"
      >
        <template #header-cell-actions="props">
          <q-th 
          style="z-index: 5" 
          :props="props" 
          class="fixed-col right">
          {{ props.col.label }}
          </q-th>
        </template>

        <template v-slot:body="props">
          <q-tr 
          :props="props" 
          @click="onRowClick(props.row)"
          :class="{
            selected : props.row.selected
          }"
          >
           <q-td 
           :key="col.name" 
           :props="props" 
           v-for="col in props.cols.filter(x => !['actions'].includes(x.name))">
              {{col.value}} 
           </q-td>
           <q-td :props="props" key="actions" class="fixed-col right">
            <q-icon name="mdi-dots-vertical" size="16px">
              <q-menu auto-close anchor="bottom right" self="top right">
                <q-list>
                  <q-item clickable v-ripple @click="onClickEdit(props.row)">
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple @click="onClickDeleted(props.row)">
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
          </q-tr>
        </template>
      </STable>
      <DialogDelete
        :deleted="deleted"
        @onDeleted="onDeleted"
        :data-selected="dataforDelete"
      />
      <DialogAdd
        :modal="modal"
        @onSave="onSave"
      />
      <DialogCheckPermission
        :CheckPermission="CheckPermission"
      />
      <DialogDeletedRow
        :DeletedRow="DeletedRow"
        @onClickDeletedData="onClickDeletedData"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
} from '@vue/composition-api';
import { tableHeaders } from './tables/phoneBook.table';
import { Notify, date } from 'quasar';
import {store} from '~/store'
import { SInputAddPhoneBook } from './utils/paramsPhoneBook'
import print from 'print-js';
import {rawHeader} from './utils/RawHeaderPrint'
import {PrintJs} from '~/app/helpers/PrintJs'

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts, keyaddedit, recIdModify, recIdDeleted;
    const {user} = store.state.auth
    const state = reactive({
      isFetching: false,
      SInputAddPhoneBook: SInputAddPhoneBook,
      data: [],
      hide_bottom: false,
      dialog: false,
      deleted: false,
      modal: {
        dialog : false,
        loading: false
      },
      CheckPermission: {
        confirm: false,
        message: ''
      },
      DeletedRow: {
        confirm: false,
        message: ''
      },
      dataSelected: {},
      dataforDelete:{}
    });

    const FETCH_DATA = async (api, body?) => {
      const [GET_COMMON, GET_DATA ] = await Promise.all([
        $api.telephoneOperator.fetchApiCommon(api, body),
        $api.telephoneOperator.fetchApiTelephoneOperator(api, body)
      ]) 
      switch (api) {
        case 'checkPermission':
          if (GET_COMMON.zugriff =='false') {
            state.CheckPermission.confirm = true
            state.CheckPermission.message = GET_COMMON.messStr
          } else {
            if (body.expectedNr == '2') {
              if (keyaddedit == 'deleted') {
                state.DeletedRow.confirm = true
                state.DeletedRow.message = `${recIdDeleted.name} - ${recIdDeleted.telephone}`
              } else {
                state.modal.dialog = true
                if (keyaddedit == 'edit') {
                  onCreateDataEdit()
                }
              }
            }
          }
        break;
        case 'phoneListSave':
          state.modal.loading = true
          setTimeout(() => {
            state.modal.loading = false
            state.modal.dialog = false
            if (GET_DATA.successFlag == 'true') {
              Notify.create({
                message: 'Sukses',
                type: 'positive'
              });
              if (state.data.length !== 0) {
                onRefresh()
              }
            } else {            
              Notify.create({
                message: 'Error',
                type: 'negative'
              });
            }
          }, 1500)
          break
        case 'phoneListRead':
          const utilsModify = [
            'Dept','name','adresse1',
            'land','wohnort','prefix',
            'telex','telephone','ext',
            'mobil-telefon','vorname',
            'adresse2'
          ]
            for(const items in utilsModify){
              SInputAddPhoneBook[
                items
              ].value = 
              GET_DATA.tTelephone[
                't-telephone'
              ][0][
                utilsModify[items]
              ]
            }
          break;
        case 'phoneListDelete':
          state.DeletedRow.confirm = false
          onRefresh()
          break;
        default:
        charts = GET_DATA || [];
        for(const data of charts.tPhoneList['t-phone-list']){
          data['selected'] = false
        }
        state.data = charts.tPhoneList['t-phone-list'];
        if(state.data.length !== 0){
          state.isFetching = false
          state.hide_bottom = true
        }
        break;
      }
    }

    onMounted(async () => {
      FETCH_DATA('checkPermission', {
          userInit: user.userInit,
          arrayNr: "37",
          expectedNr: "1",
      })
    });

    const onCreateDataEdit = () => {
      FETCH_DATA('phoneListRead', {
        caseType: "99",
        int1: recIdModify,
        int2: ' ',
        char1: ' ',
        char2: ' ',
        char3: ' ',
        char4: ' '
      })
    }

    function doPrint() {
      if (state.data.length !== 0) {     
        PrintJs(state.data, tableHeaders, 'Phone Book')   
        // print({
        //   printable: 'printMe',
        //   type: 'html',
        //   targetStyles: ['*'],
        //   maxWidth: 3600,
        //   header: rawHeader('Phone Book'),
        //   style: '.custom-h3 { color: black; }',
        // });
      }
    }

    const onRefresh = () => {
      FETCH_DATA('phoneList',{
        caseType: 1,
        name1:' ',
        dept1: ' ',
        phoneNr: ' ',
        pn: ' ',
        mobileNr:  ' ',
        lvCOldMobilNR: ' '
      })
    }

    const onSearch = (state2) => {
      state.isFetching = true
      FETCH_DATA('phoneList',{
        caseType: 1,
        name1: state2.Name === null || state2.Name === '' ? ' ' : state2.Name,
        dept1: state2.Department === null || state2.Department === '' ? ' ' : state2.Department,
        phoneNr: state2.Phone === null || state2.Phone === '' ? ' ' : state2.Phone,
        pn: ' ',
        mobileNr: state2.Mobile === null || state2.Mobile === '' ? ' ' : state2.Mobile,
        lvCOldMobilNR: ' ',
      })
    };

    const showModal = () => {
      for(const items of SInputAddPhoneBook){
        items.value = ''
      }
      keyaddedit = 'add'
      FETCH_DATA('checkPermission', {
          userInit: user.userInit,
          arrayNr: "37",
          expectedNr: "2",
      })
    }; 

    const onSave = (sinput) => {
      if (
        SInputAddPhoneBook[0].value == '' ||
        SInputAddPhoneBook[1].value == '' ||
        SInputAddPhoneBook[7].value == '') {
              Notify.create({
                message: 'Departement, name and telephone must be filled-in',
                color: 'red'
              });
      } else {
        if (keyaddedit == 'add') {        
          FETCH_DATA('phoneListSave', {
            "caseType": "2",
            "int1": " ",
            "tTelephone": {
              "t-telephone": [{
                "dept": sinput[0].value,
                "name": sinput[1].value,
                "adresse1": sinput[2].value,
                "land": sinput[3].value,
                "wohnort": sinput[4].value,
                "prefix": sinput[5].value,
                "telex": sinput[6].value,
                "telephone": sinput[7].value,
                "ext": sinput[8].value,
                "mobil-telefon": sinput[9].value,
                "vorname": sinput[10].value,
                "adresse2": sinput[11].value
              }]
            }
          })
        } else {
          FETCH_DATA('phoneListSave', {
            "caseType": "1",
            "int1": recIdModify,
            "tTelephone": {
              "t-telephone": [{
                "dept": sinput[0].value,
                "name": sinput[1].value,
                "adresse1": sinput[2].value,
                "land": sinput[3].value,
                "wohnort": sinput[4].value,
                "prefix": sinput[5].value,
                "telex": sinput[6].value,
                "telephone": sinput[7].value,
                "ext": sinput[8].value,
                "mobil-telefon": sinput[9].value,
                "vorname": sinput[10].value,
                "adresse2": sinput[11].value
              }]
            }
          })
        }
      }
    }

    const onClickEdit = (dataRow) => {
      for(const items of SInputAddPhoneBook){
        items.value = ''
      }
      recIdModify = dataRow['rec-id']
      keyaddedit = 'edit'
      FETCH_DATA('checkPermission', {
        userInit: user.userInit,
        arrayNr: "37",
        expectedNr: "2",
      })
    }

    const onClickDeleted = (dataRow) => {
      recIdDeleted = dataRow
      keyaddedit = 'deleted'
      FETCH_DATA('checkPermission', {
        userInit: user.userInit,
        arrayNr: "37",
        expectedNr: "2",
      })
    }

    const onClickDeletedData= () => {
      FETCH_DATA('phoneListDelete', {
        caseType: 1,
        int1: ' ',
        char1: recIdDeleted.telephone,
        char2: recIdDeleted.name
      })
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
      onSave,
      showModal,
      onRowClick,
      onClickEdit,
      onClickDeleted,
      onClickDeletedData,
      doPrint,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    SearchPhoneBook: () => import('./components/SearchPhoneBook.vue'),
    DialogAdd: () => import('./components/DialogAdd.vue'),
    DialogDelete: () => import('./components/DialogDelete.vue'),
    DialogCheckPermission: () => import('./components/DialogCheckPermission.vue'),
    DialogDeletedRow: () => import('./components/DialogDeleted.vue')
  },
});
</script>

<style lang="scss" scoped>
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

  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }
}
</style>
