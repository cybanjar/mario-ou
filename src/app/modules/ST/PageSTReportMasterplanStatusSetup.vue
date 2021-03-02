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
      <SearchMasterplanStatusSetup :searches="searches" @onSave="onSave" />
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
    </div>
    <DialogInfromation :dialogInformation="dialogInformation"/>
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
import { tableHeaders } from './tables/MasterplanStatusSetup.table';
import { sinput, valueType } from './utils/MasterPlan';
import { Notify } from 'quasar'

export default defineComponent({
  setup(_, { root: { $api } }) {
    let onKey
    const state = reactive({
      data: [],
      isFetching: false,
      hide_bottom: false,
      colors: 'grey',
      dialogInformation: {
        confirm: false,
        message: ''
      },
      searches: {
        active: false
      },
      dialogDelete: {
        confirm: false,
        message: 'Do You Want To Delete This Record?',
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
      const GET_DATA =await $api.systemsetting.FetchAPISC(api, body)
      switch (api) {
        case 'bkQueasyRead':
          for(const x of GET_DATA.tBkqueasy['t-bkqueasy']){
            x['selected'] = false
          }
          state.data = GET_DATA.tBkqueasy['t-bkqueasy']
          sinput[0].value = (Number(state.data[state.data.length - 1]['number1']) + 1).toString()
          if (state.data.length !== 0) {
            state.hide_bottom = true
          }
          break;
        case 'bkQueasyWrite':
          setTimeout(() => {
            state.isFetching = false
            onRefresh()
            NotifyPositive()
            for(const x of sinput){
              x.value = ''
              x.disable = true
            }
          },1000)
          break;
        case 'bkQueasyDelete':
          state.dialogDelete.confirm = false
          setTimeout(() => {
            state.isFetching = false
            onRefresh()
            NotifyPositive()
            if (state.data.length == 0) {
              state.hide_bottom = true
            }
          },1000)
          break;
        default:
          break;
      }
    }

    function onRefresh() {    
      FETCH_API('bkQueasyRead', {
        "caseType" : 1,
        "intKey" : 1
      })
    }

    onMounted(() => {
      onRefresh()
    })

    const onRowClick = (datarow) => {
        for (const i of state.data) {
          i.selected = false;
        }
        datarow['selected'] = true;
    };

    const onAdd = () => {
      state.searches.active = true;
      onKey = 'add'
      for(const x of sinput.filter(x => !['No'].includes(x.label))){
        x.disable = false
      }
    };

    const onSave = () => {
      const validateCode = []
      const validateDescription = []
      for(const xi of state.data){
        if (onKey == 'add') {
          validateCode.push(xi['char1'].toLowerCase())
          validateDescription.push(xi['char2'].toLowerCase())
        } else {
          if (
            xi['char1'].toLowerCase() !== sinput[1].value.toLowerCase() && 
            xi['char2'].toLowerCase() !== sinput[2].value.toLowerCase()) {
              validateCode.push(xi['char1'].toLowerCase())
              validateDescription.push(xi['char2'].toLowerCase())
          }
        }
      }
      if (validateCode.includes(sinput[1].value.toLowerCase())) {
        state.dialogInformation.confirm = true
        state.dialogInformation.message = 'Code already exist'
      } else if (validateDescription.includes(sinput[2].value.toLowerCase())) {
        state.dialogInformation.confirm = true
        state.dialogInformation.message = 'Description already exist'
      } else if (sinput[1].value == '') {
        state.dialogInformation.confirm = true
        state.dialogInformation.message = 'Code cannot be empty'
      } else if (sinput[2].value == '') {
        state.dialogInformation.confirm = true
        state.dialogInformation.message = 'Description cannot be empty'
      } else if(sinput[3].value == ''){
        state.dialogInformation.confirm = true
        state.dialogInformation.message = 'Type cannot be empty'
      } else {
        state.isFetching = true
        FETCH_API('bkQueasyWrite', {
          "caseType": 1,
	        	"tBkqueasy": {
	        		"t-bkqueasy": [{
	        			"betriebsnr": 0,
	        			"char1": sinput[1].value.toUpperCase(),
	        			"char2": sinput[2].value.toUpperCase(),
	        			"char3": "01",
	        			"date1": null,
	        			"date2": null,
	        			"date3": null,
	        			"deci1": 0,
	        			"deci2": 0,
	        			"deci3": 0,
	        			"key": 1,
	        			"logi1": false,
	        			"logi2": false,
	        			"logi3": false,
	        			"number1": Number(sinput[0].value),
	        			"number2": Number(sinput[3].value['value']),
	        			"number3": 0
	        		}]
	          }
        })

      }
    }

    const onClickEdit = (row) => {
      state.searches.active = true
      onKey = 'edit'
      const value = ['number1', 'char1', 'char2']
         for(const x of sinput.filter(x => !['No'].includes(x.label))){
           x.disable = false
      }
      const type = valueType.filter(x => x['value'] == row['number2'].toString())
      for(const x in value){
        sinput[x].value = row[value[x]]
      }
      sinput[3].value = type[0] as any
      state.colors = 'primary';
    };

    const deleteDataRow = (row) => {
      state.dialogDelete.confirm = true
      state.dialogDelete.data = row
    }

    const onClickDelete = (row) => {
      state.isFetching = true
      FETCH_API('bkQueasyDelete', {
        caseType: 1, 
        tBkqueasy: {
          't-bkqueasy': row['data']
        }
      })
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onRowClick,
      onAdd,
      onSave,
      onClickEdit,
      deleteDataRow,
      onClickDelete
    };
  },
  components: {
    SearchMasterplanStatusSetup: () => import('./components/SearchMasterplanStatusSetup.vue'),
    DialogInfromation: () => import('./helpers/DialogInformation.vue'),
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
