<template>
  <div class="column" style="margin: 20px">
    <div class="col">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img
            :src="require('~/app/icons/Icon-Add.svg')"
            height="25"
            @click="onAdd"
          />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
      </div>
    </div>
    <div class="col">
      <SearchRoomMeeting @onCancelOke="onCancelOke" @onSave="onSave" :searches="searches" />
    </div>
    <div class="col">
      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        :hide-bottom="hide_bottom"
        class="table-accounting-date"
      >
        <template #header="props">
          <q-tr style="height: 40px" :props="props">
            <q-th
              :props="props"
              v-for="col in props.cols"
              :key="col.name"
              :style="col.style"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
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
            <q-td :props="props" key="actions">
              <q-icon name="mdi-dots-vertical" size="16px">
                <q-menu
                  :props="props"
                  auto-close
                  anchor="bottom right"
                  self="top right"
                >
                  <q-list :props="props">
                    <q-item
                      :props="props"
                      @click="onClickEdit(props.row)"
                      clickable
                      v-ripple
                    >
                      <q-item-section>Edit</q-item-section>
                    </q-item>
                    <q-item
                      @click="deleteDataRow(props.row)"
                      clickable
                      v-ripple
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
    <CheckPermission
      :dialogConfirm="dialogConfirm" 
    />
    <DialogDelete 
    @onClickOke="onClickOke"
    :dialogDelete="dialogDelete" />
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
import { store } from '~/store';
import { tableHeaders } from './tables/RoomMeetingSetup.table';
import { data_table, sinput, parentRoom } from './utils/RoomMeeting'
import { Notify } from 'quasar'
// import { use_input, table_input, dataTable } from './utils/DailyReportSetup';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      data: [],
      isFetching: false,
      hide_bottom: false,
      colors: 'grey',
      keyOnOke: '',
      searches: {
        active: false
      },
      dialogConfirm: {
        confirm: false,
        message: 'Not Users'
      },
      dialogDelete: {
        confirm: false,
        message: '',
        value: ''
      }
    });

    const NotifyCreate = (message) => Notify.create({
      message: message,
      position: 'top',
      color: 'red',
      textColor: 'white',
      timeout: 2000,
    });
    const NotifyPositive = () => Notify.create({
      message: 'Sukses',
      position: 'top',
      type: 'positive',
      timeout: 2000,
    });


    const Fetch_API = async (api, body?) => {
      const [GET_DATA, GET_COMMON] = await Promise.all(
        [
          $api.systemsetting.FetchAPIST(api, body),
          $api.systemsetting.FetchCommon(api, body),
        ]
      )
  
      switch (api) {
        case 'checkPermission':
            if (GET_COMMON['zugriff'] == 'false') {
              state.dialogConfirm.confirm = true
              state.dialogConfirm.message = GET_COMMON['messStr']
            }
          break;
        case 'baRaumPrepare':
            state.data = data_table(GET_DATA)
            if (state.data.length !== 0) {
              state.hide_bottom = true
            }
          break;
        case 'fillBkRaum':
          const valueInput = ['', '', '', '', '0', '0', '0', '', '', false]
          setTimeout(()=> {
            for(const items in valueInput){
              sinput[items].value = valueInput[items]
            }
            onRefresh()
            NotifyPositive()
            state.isFetching = false
            if (state.keyOnOke == 'add') {
              state.keyOnOke = 'add'
            }
            if (state.keyOnOke == 'edit') {
              state.keyOnOke = ''
              for(const i in sinput){
                sinput[i].disable = true
                if (i == '9') {
                  sinput[i].value = false
                } else {
                  sinput[i].value = ''
                }
              }
            }
          },1000)
            
          break;
        case 'baraumEdit':
            const valueModify = [
              'raum', 'bezeich', 'groesse', 
              'nebenstelle', 'personen', 'Preis',
              'vorbereit', 'lu-raum', 'vname'
              ]
            for(const items in valueModify){
              sinput[items].value = GET_DATA.bkList['bk-list'][0][valueModify[items]]
            }
            for(const x of sinput){
              x.disable = false
            }
          break;
        case 'selectBaraum':
          sinput[7].options = parentRoom(GET_DATA)
          break;
        case 'baraumDelete':
          state.dialogDelete.confirm = false
          setTimeout(() => {
            state.isFetching = false
            NotifyPositive()
            onRefresh()
          },1000)
          break;
        default:
          break;
      }
    } 

    const onRefresh = () => {
      Fetch_API('baRaumPrepare')
    }

    onMounted(() => {
      const { userInit } = store.state.auth.user
      Fetch_API('checkPermission', {
        userInit: userInit,
        arrayNr: 48,
        expectedNr: 2
      })
      Fetch_API('baRaumPrepare')
      Fetch_API('selectBaraum')
    });

    const onRowClick = (datarow) => {
      for(const items of state.data){
        items['selected'] = false
      }
      datarow['selected'] = true
    };


    const onAdd = () => {
      if (state.keyOnOke !== 'edit') {   
        state.searches.active = true
        state.keyOnOke = 'add'
        for(const x of sinput){
          x.disable = false
        }
      }
    };

    const onSave = () => {  
      let xi =  sinput[0].value as any
      let xii =  sinput[1].value as any
      let dataRoom = []
      let dataDescription = []
      for(const item of state.data){
        if (state.keyOnOke == 'add') 
          {          
            dataRoom.push(item['Code'].toLowerCase())
            dataDescription.push(item['Description'].toLowerCase())
          } else 
            {
              if (
                item['Code'].toLowerCase() !== xi.toLowerCase()
              ){
                dataRoom.push(item['Code'].toLowerCase())
              }
              if (
                item['Description'].toLowerCase() !== xii.toLowerCase()
              ) {
                dataDescription.push(item['Description'].toLowerCase())
              }
            }
      }
      if (sinput[0].value !== '' || sinput[1].value !== '') {  
        if (!dataRoom.includes(xi.toLowerCase())) {    
          if (!dataDescription.includes(xii.toLowerCase())) {   
            state.isFetching = true       
            Fetch_API('fillBkRaum', {
              "currSelect": state.keyOnOke == 'add'? 'add' : 'chg',
              "tRaum": state.keyOnOke == 'add'? xi.toUpperCase(): sinput[0].value,
                "bkList": {
                  "bk-list": [{
                    "raum": xi.toUpperCase(),
                    "bezeich": sinput[1].value,
                    "groesse": sinput[2].value,
                    "Preis": sinput[5].value,
                    "nebenstelle": sinput[3].value,
                    "personen": sinput[4].value,
                    "vorbereit": sinput[6].value,
                    "vname": sinput[8].value['type'],
                    "lu-raum": sinput[7].value['value'],
                    "flag-desc": sinput[9].value
                  }]
                }
            })
          } else {
            NotifyCreate('Description already exists, use other name')
          }    
        }  else {
          NotifyCreate('The parent room can not be the same room')
        }    
      } else {
          NotifyCreate('Unfilled field(s) detected')
      }
    }

    const onClickEdit = (props) => {
      if (state.keyOnOke !== 'add') {        
        state.keyOnOke = 'edit'
        state.searches.active = true
        Fetch_API('baraumEdit', {
           "raum" : props['Code']
        })      
      }
    };

    const deleteDataRow = (row) => {
      state.dialogDelete.confirm = true
      state.dialogDelete.value = row
      state.dialogDelete.message = `Do you really want to delete the record <br/> ${row['Code']} - ${row['Description']}`
    }

    const onClickOke = (row) => {
      state.isFetching = true
      Fetch_API('baraumDelete', {
         "recId" : row['rec-id']
      })      
    }

    const onCancelOke = () => {
      state.keyOnOke = ''
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onRowClick,
      onAdd,
      onSave,
      onClickEdit,
      deleteDataRow,
      onClickOke,
      onCancelOke
    };
  },
  components: {
    SearchRoomMeeting: () => import('./components/SearchRoomMeetingSetup.vue'),
    CheckPermission: () => import('./components/DialogCheckPermission.vue'),
    DialogDelete: () => import('./components/DialogDelete.vue')
  },
});
</script>
<style lang="scss" scoped>
::v-deep .table-accounting-date {
  max-height: 35vh;

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
