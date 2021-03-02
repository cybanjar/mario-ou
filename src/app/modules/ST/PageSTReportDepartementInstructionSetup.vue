<template>
  <div style="margin: 20px">
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
    <SearchDepartementInstructionSetup :searches="searches" @onSave="onSave" />
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
    <DialogInformation :dialogInformation="dialogInformation"/>
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
import { tableHeaders } from './tables/DepartementInstruction.table';
import { sinput } from './utils/DepartementInstructionSetup';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let onKey , recid
    const state = reactive({
      data: [],
      isFetching: false,
      hide_bottom: false,
      colors: 'grey',
      dialogInformation: {
        confirm: false,
        message: ''
      },
      dialogDelete: {
        confirm: false,
        message: '',
        data: ''
      },
      searches: {
        room: '',
        store: [],
        active: false,
      },
    });

    const FETCH_API = async (api, body?) => {
      const GET_DATA = await $api.systemsetting.FetchAPIST(api, body)
      switch (api) {
        case 'bqtbeoAdminPrepare':
          for(const i of GET_DATA.qList['q-list']){
            i['selected'] = false
          }
          state.data = GET_DATA.qList['q-list']
          sinput[0].value = (Number(state.data[state.data.length - 1]['number1']) + 1).toString()
          if (state.data.length !== 0) {
            state.hide_bottom = true
          }
          break;

        case 'bqtbeoAdminBtnExit':
          setTimeout(() => {
            state.isFetching = false
            sinput[1].disable = true
            sinput[1].value = ''
            onRefresh()
          }, 1000)
          break;
        
        case 'bqtbeoAdminBtnDel':
          state.isFetching = true
          state.dialogDelete.confirm = false
          setTimeout(() => {
            state.isFetching = false
            onRefresh()
          }, 1000)
          break;
        default:
          break;
      }
    }

    function onRefresh() {
      FETCH_API('bqtbeoAdminPrepare')
    }


    onMounted(() => {
      onRefresh()
    });

    const onRowClick = (datarow) => {
      for (const i of state.data) {
        i.selected = false;
      }
      datarow['selected'] = true;
    };


    const onAdd = () => {
      state.searches.active = true;
      sinput[1].disable = false
      onKey = 'add'
    };

    const onSave = () => {
      const validasiDes = []
      for(const item of state.data){
        if (onKey == 'add') {
          validasiDes.push(item['char3'].toLowerCase())
        } else {
          if (item['char3'].toLowerCase() !== sinput[1].value.toLowerCase()) {
            validasiDes.push(item['char3'].toLowerCase())
          }
        }
      }

      if (sinput[1].value == '') {
        state.dialogInformation.confirm = true
        state.dialogInformation.message = 'Unfilled field(s) detected.'
      } else if (validasiDes.includes(sinput[1].value.toLowerCase())) {
        state.dialogInformation.confirm = true
        state.dialogInformation.message = 'Category already exists.'
      } else if (state.data.length >= 12) {
        state.dialogInformation.confirm = true
        state.dialogInformation.message = 'Reach Maximum of Fild'
      } else {
        state.isFetching = true
        FETCH_API('bqtbeoAdminBtnExit', {
          "iCase": onKey == 'add'? 1 : 2,
		      "recidQueasy": onKey == 'add'? 0 : recid,
		      "queasyList": {
		      	"queasy-list": [{
		      		"key": 1,
		      		"number1": Number(sinput[0].value),
		      		"number2": 0,
		      		"number3": 0,
		      		"date1": null,
		      		"date2": null,
		      		"date3": null,
		      		"char1": "",
		      		"char2": "",
		      		"char3": sinput[1].value.toUpperCase(),
		      		"deci1": 0,
		      		"deci2": 0,
		      		"deci3": 0,
		      		"logi1": false,
		      		"logi2": false,
		      		"logi3": false,
		      		"betriebsnr": 0
		      	}]
		      }
        })
      }
    }

    const onClickEdit = (row) => {
      state.colors = 'primary';
      state.searches.active = true
      sinput[1].disable = false
      sinput[0].value = row['number1']
      sinput[1].value = row['char3']
      onKey = 'edit'
      recid = row['rec-id']
    };

    const deleteDataRow = (row) => {
      state.dialogDelete.data = row
      state.dialogDelete.confirm = true
      state.dialogDelete.message = `REMOVE the Categoty <br/> ${row['number1']} - ${row['char3']}`
    }

    const onClickDelete = (row) => {
      FETCH_API('bqtbeoAdminBtnDel', {
        recidQueasy: row.data['rec-id']
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
    SearchDepartementInstructionSetup: () => import('./components/SearchDepartementInstructionSetup.vue'),
    DialogInformation: () => import('./helpers/DialogInformation.vue'),
    DialogDelete: () => import('./helpers/DialogDelete.vue')
  },
});
</script>
<style lang="scss" scoped>
::v-deep .table-accounting-date {
  max-height: 45vh;

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
