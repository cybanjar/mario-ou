<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="235" persistent>
    <SearchDailyReport/>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
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
      >
        <template v-slot:header="props">
            <q-tr style="height: 45px" :props="props">
                <q-th
                :props="props"
                v-for="col in props.cols"
                :key="col.name"
                :style="col.style"
                >
                    {{col.label}}
                </q-th>
            </q-tr>
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
           v-for="col in props.cols">
              {{col.value}} 
           </q-td>
          </q-tr>
        </template>
      </STable>
    </div>
    <DialogSaveExcel 
      @onClickConfirm="onClickConfirm" 
      :dialogConfirm="dialogConfirm"/>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  ref,
  watch
} from '@vue/composition-api';
import {tableHeaders} from './Tables/DailyReport.table'
import ky from 'ky'
import {GoogleSpreadsheet} from 'google-spreadsheet'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';


export default defineComponent({
    setup(_, {root: {$api, $router}}){
        const state = reactive({
            isFetching: false,
            hide_bottom: false,
            data: [],
            dialogConfirm: {
              confirm: false,
              message: '',
              data: {}
            },
        })


        const doc = new GoogleSpreadsheet("1FRc9c_BnEp9hLNsVcpjpnHQ0OzUIZmRabdO4kNOeeR0");
        const xii = {
          "type": "service_account",
          "project_id": "norse-lotus-301404",
          "private_key_id": "84a0f970816f9be908a7158f6205a38435a40961",
          "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDLekA6L5n9bM11\ncboz8lshc5782giSjuLTOJDPMaKVqSXQW6Cf2IxYcLc079SlA/Vty3E6V844GHbU\nIyFaupXmxJikoqx1XxgM/YGIGPbRgB6JThdKwbicMBSG6hyfbmniGLhFgKsOm6WR\nG38WtraOQ4ydHC6qB3x/brGKOHUJ6wiXgm5Tq9QYvujVzjH3SozAHe4C1z8sn13l\nHc92jWNMvYVjQ0+bKljrWbxW5/8GqB9JzEMLn44RN2SYi4X22UxaUyCN4VUPyPJV\niNmgQrON0/WWWW+/fPY3fzjKG2wW6mGmKE0Vdj/7gHJmDj5CW/qmUP/tar4WRXPk\nNUDvQV8XAgMBAAECggEADCPBDTel0k7ZezZLy6mb8kT5qVBAzq2jrsJjMVlev9sV\nnHa7AI5k4SnoZEoiv62ayPAoUzjF3ubmwAVQih8zrk7wZHIoI+CGiM/fGIWUxC8G\no157WURxhTABKYNyLbjirFCZPdxNWFPE7wFa9bn07kvtaboytoY30UqDYSG5Kdw2\nloWzab1PN/dQt0qDBsuCt6KGroVEWX2JzXy2SNmxZD08HM9hhfJdIWwVu57/J2wQ\nfcf4Jb2VQsBgu2caX6H3Q1QFXz78JVmY7CdfqTafE5uatHQDnMSdgZJ1iwGfH6qm\n+zp/xwBwJXKFCRYAb3G8M3IWBuRVNNcMhCYsM7glEQKBgQD3Z3cPE9gnIJNU7bO0\nr/M9w1j2odGbAFD39WLowPHHr3RqEPIZq9QbteR90qDzTYKTCEyJK1y/oAUHRmGH\nvU5vdEYBAet5uxJsBOPfbm5eSrpEqPLkakoriVVw82eIour3la6IPk1y6VYQGhY9\ncmbVTtCkkb0fjNnK6x+8sY8CTQKBgQDSjBSsadA1VPnniqiLmOKq1jCVXNXJ94rP\niv+pt5LRkZcgr/ocDTM0thk+iTSpnfYFISACTu2gMjw4JYWrjKvNfkH6zH5XtTy6\nDhq1zWAIpL3glok9oWTtG1/rXDEQi5UsqInPN8icf1THacGxGjFnhffyA2WXpprX\nxfhK5MLw8wKBgGYN3gTwMKfjPiM4cnrEYdhGbro+AhKoTL4cERLmFFZEwAbIurVw\nNezAWWK1sgLrJEO2lqu2oWnCfpCDrdOqeWJsWjwsKJBsZKr+UWlnSkvHE5MjBh7G\n4ZWX7xDKtxib68T5j6dP2+7c5c16lVX/jP/MpTBdleAf3+9ekhbqP425AoGBAKK6\nGZBYB8/waWWHSVT7SNT4znviUGnUpLhbmdW2SAcpG0DsQcZEfXsT8tbefJFLwMWe\nIHsoPYg+y0Qp2/IGuxILrzsDqfJn5RN3qzUwEjUb/pUCQ/gaMUMAkVX63wEGoLjv\nWfOKDcbGsuOc3VLgB6cXZ9bowTBAWBTEsW5Q+En5AoGBAIEN6LQIyiJtG68OvkHY\npYyxVYpY/NuxZOWa8Os3spSEV81UPkZF9PYl9AZSffNNKGQsCbXPbaw0evQfpax8\nTPByRvo7MzeTyKwWUinzilT0Pd2+2LpXgcQjCjpX0fBPI9TwW4qE8r8YyNnXRMzi\n3VLo9MUw1QYAYPjRMYlqQBI2\n-----END PRIVATE KEY-----\n",
          "client_email": "demo-651@norse-lotus-301404.iam.gserviceaccount.com",
          "client_id": "101031598111646267519",
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://oauth2.googleapis.com/token",
          "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/demo-651%40norse-lotus-301404.iam.gserviceaccount.com"
        }


        let wb = XLSX.utils.book_new();
        wb.Props = {
                Title: "SheetJS Tutorial",
                Subject: "Test",
                Author: "Red Stapler",
                CreatedDate: new Date(2017,12,19)
        };
        
        wb.SheetNames.push("DailyReport Sheet");
        function s2ab(s) {
                let buf = new ArrayBuffer(s.length);
                let view = new Uint8Array(buf);
                for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
                
        }

        const onRowClick = (datarow) => {
          for(const i of state.data){
            i.selected = false
          }
          datarow['selected'] = true; 
          state.dialogConfirm.data = datarow
          state.dialogConfirm.confirm = true
          state.dialogConfirm.message = 'Are you sure you want to generate this report?'
        }

        const onClickConfirm = (datarow) => {
          state.dialogConfirm.confirm = false
          const ws_data = [
            {
              'File Number': datarow['filenumber'],
              'Description': datarow['des'],
              'File Name': datarow['filename']
            }
          ];
          const ws = XLSX.utils.json_to_sheet(ws_data);
          wb.Sheets["DailyReport Sheet"] = ws;
          const wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});       
          saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Daily Report.xlsx')
        }
        
        const FETCH_DATA = async (api, body?, row?) => {
          switch (api) {
            case "foreportPrepare":
              const GET_DATA = await $api.incomeaudit.FetchAPINA(api, body)
              state.data = GET_DATA.tBrief['t-brief'].map(items => ({
                filenumber: items['briefnr'],
                des: items['briefbezeich'],
                filename: items['fname'],
                selected: false
              }))
              if(state.data.length !== 0){
                state.hide_bottom = true
              }
              break;
          
            default:
              const data = {
                'File Number': row['filenumber'],
                'Description': row['des'],
                'File Name': row['filenumber']
              }
              try {
                await doc.useServiceAccountAuth({
                  client_email: xii.client_email,
                  private_key: xii.private_key
                  });
                // loads document properties and worksheets
                await doc.loadInfo();
      
                const sheet = doc.sheetsById[0];
                const result = await sheet.addRow(data);
                // const rows = await sheet.getRows()

                // console.log('sukses', rows);
                // const result = await rows[0].save()
                
              } catch (e) {
                console.log('sukses: ', e);
              }
              break;
          }

        }

        onMounted(() => {
          FETCH_DATA('foreportPrepare')
        })

        return {
            pagination: {
              rowsPerPage: 10,
            },
            tableHeaders,
            ...toRefs(state),
            onRowClick,
            onClickConfirm
        }
    },
    components: {
        SearchDailyReport: () => import('./components/SearchDaliyReport.vue'),
        DialogSaveExcel: () => import('./components/DialogSaveExcel.vue')
    }
})
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
