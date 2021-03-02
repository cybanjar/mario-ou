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
      <ActionReportTableStyleSetup 
        :colors="colors" 
        @onSave="onSave"
        />
    </div>
    <div class="col">
      <STable
        flat
        bordered
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
    </div>
    <CheckPermission :dialogConfirm="dialogConfirm" />
    <DialogInformation :dialogInformation="dialogInformation" />
    <DialogDelete :dialogDelete="dialogDelete" @onClickDelete="onClickDelete"/>
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
import { tableHeaders } from './tables/ReportTableStyleSetup.table';
import { sinput } from './utils/TableStyleSetup';
import {Notify} from 'quasar'

export default defineComponent({
  setup(_, { root: { $api } }) {
    let dataEdit
    const state = reactive({
      data: [],
      isFetching: false,
      hide_bottom: false,
      colors: 'grey',
      onKey: 'add',
      dialogConfirm: {
        confirm: false,
        message: '',
      },
      dialogInformation: {
        confirm: false,
        message: '',
      },
      dialogDelete: {
        confirm: false,
        message: '',
        data: ''
      }
    });

    const NotifyPositive = () => Notify.create({
      message: 'Sukses',
      position: 'top',
      type: 'positive',
      timeout: 2000,
    });


    const FETCH_API = async (api, body?) => {
      const GET_DATA = await $api.systemsetting.FetchAPIST(api, body)
      switch (api) {
        case 'basetupAdminPrepare':
          for(const item of GET_DATA.tBkSetup['t-bk-setup']){
            item['selected'] = false
          }
          state.data = GET_DATA.tBkSetup['t-bk-setup']
          sinput[0].value = (Number(state.data[state.data.length - 1]['setup-id']) + 1).toString()
          if (state.data.length !== 0) {
            state.hide_bottom = true
          }
          break;
        case 'basetupAdminBtnExit':
          setTimeout(() => {
            state.isFetching = false
            if (GET_DATA['outputOkFlag'] == 'true') {
            for(const item of sinput){
              item.value = ''
            }
            for(const i of sinput){
              i.disable = true
            }
            NotifyPositive()
            onRefresh()
            }
          },1000)
          break;
        case 'basetupAdminBtnDelart':
          state.dialogDelete.confirm = false
          state.isFetching = true
          setTimeout(() => {
            state.isFetching = false
            if (GET_DATA['outputOkFlag'] == 'true') {
              NotifyPositive()
              onRefresh()
            }
          },1000)
          break;
        default:
          break;
      }
      
    }

    const onRowClick = (datarow) => {
      for (const i of state.data) {
        i.selected = false;
      }
      datarow['selected'] = true;
    };

    const onRefresh = () => {
      FETCH_API('basetupAdminPrepare')
    }
    onMounted(() => {
      onRefresh()
    });

    const onAdd = () => {
      state.colors = 'primary';
      sinput[1].disable = false
      state.onKey = 'add'
    };

    const onClickEdit = (row) => {
      dataEdit = row
      state.onKey = 'edit'
      sinput[0].value = row['setup-id']
      sinput[1].value = row['bezeichnung']
      state.colors = 'primary';
      sinput[1].disable = false
    };

    const onSave = () => {
      const description = []
      for(const des of state.data){
        if (state.onKey == 'add') {
          description.push(des['bezeichnung'].toLowerCase())
        } else {
          if (des['bezeichnung'].toLowerCase() !== sinput[1].value.toLowerCase()) {
            description.push(des['bezeichnung'].toLowerCase())
          }
        }
      }

      let xii = true
      for(const i in sinput){
        if (sinput[i].value == '') {
          xii = false
        }
      }
      if (description.includes(sinput[1].value.toLowerCase())) {
        state.dialogInformation.confirm = true
        state.dialogInformation.message = 'Description already exits, use other name'
      } else if (!xii) {
        state.dialogInformation.confirm = true
        state.dialogInformation.message = 'Unfilled field(s) detected'
      } else {      
          state.isFetching = true
          FETCH_API('basetupAdminBtnExit', {
            "iCase": state.onKey == 'add' ? 1 : 2,
            "recidBkSetup": state.onKey == 'add'? 0 : dataEdit['rec-id'],
            "baList": {
              "ba-list": [{
                "betriebsnr": 0,
                "bezeichnung": sinput[1].value,
                "bname": "",
                "departement": 0,
                "nachlauf": 0,
                "rec-id": 0,
                "segmentcode": 0,
                "setup-id": Number(sinput[0].value),
                "vname": "",
                "vorbereit": 0
              }]
            }
          })
      }
    }

    const deleteDataRow = (row) => {
      state.dialogDelete.data = row
      state.dialogDelete.confirm = true
      state.dialogDelete.message = `Do you really want to REMOVE the Event Type <br/> ${row['setup-id']} - ${row['bezeichnung']}?`
    }

    const onClickDelete =(row) => {
      FETCH_API('basetupAdminBtnDelart', {
        recidBkSetup: row['data']['rec-id']
      })
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onRowClick,
      onAdd,
      onClickEdit,
      onSave,
      deleteDataRow,
      onClickDelete
    };
  },
  components: {
    ActionReportTableStyleSetup: () =>
    import('./components/ActionReportTableStyleSetup.vue'),
    CheckPermission: () => import('./helpers/DialogCheckPermission.vue'),
    DialogInformation: () => import('./helpers/DialogInformation.vue'),
    DialogDelete: () => import('./helpers/DialogDelete.vue')
  },
});
</script>
<style lang="scss" scoped>
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

  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }
}
</style>
