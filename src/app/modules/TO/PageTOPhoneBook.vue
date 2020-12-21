<template>
  <div id="app" v-if="zugriff == 'false'">
    {{ messStr }}
  </div>
  <div id="app" v-else>
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
        <template #body-cell-actions="props">
          <q-td :props="props" class="fixed-col right">
            <q-icon name="mdi-dots-vertical" size="16px">
              <q-menu auto-close anchor="bottom right" self="top right">
                <q-list>
                  <q-item clickable v-ripple @click="showDialog(props.row)">
                    <q-item-section>edit</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple @click="showDeleted(props.row)">
                    <q-item-section>delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </template>
      </STable>
      <DialogDelete
        :deleted="deleted"
        @onDeleted="onDeleted"
        :data-selected="dataforDelete"
      />
      <DialogAdd
        :modal="modal"
        @onModal="onModal"
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


export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: false,
      data: [],
      hide_bottom: false,
      messStr: '',
      zugriff: '',
      messStr2: '',
      zugriff2: '',
      dialog: false,
      deleted: false,
      modal: false,
      dataSelected: {},
      dataforDelete:{}
    });

    const FETCH_DATA = async (api, body?) => {
      const GET_DATA = await  $api.telephoneOperator
      .fetchApiTelephoneOperator(api, body)
      switch (api) {
        case 'checkPermission':
          state.zugriff = GET_DATA.zugriff;
          state.messStr = GET_DATA.messStr;
          state.zugriff2 = GET_DATA.zugriff;
          state.messStr2 = GET_DATA.messStr;
        break;
        default:
        charts = GET_DATA || [];
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
        userInit: "01",
          arrayNr: "37",
          expectedNr: "1",
      })
    });

    const onSearch = (state2) => {
      state.isFetching = true
      FETCH_DATA('phoneList',{
        caseType: 1,
        name1: state2.Name === null ? ' ' : state2.Name,
        dept1: state2.Department === null ? ' ' : state2.Department,
        phoneNr: state2.Phone === null ? ' ' : state2.Phone,
        pn: ' ',
        mobileNr: state2.Mobile === null ? ' ' : state2.Mobile,
        lvCOldMobilNR: ' ',
      })
    };

    const onDialog = (val) => {
      state.dialog = val;
    };

    const onDeleted = (val) => {
      state.deleted = val;
    };

    const onModal = (val) => {
      state.modal = val;
    };

    // const onRowClick = (_, dataRow) => {
    //   console.log(dataRow);
    //   state.dataSelected = dataRow;
    // };

    const showDialog = (dataRow) => {
      if (state.zugriff2 === 'false') {
        Notify.create({
          message: state.messStr2,
          color: 'red',
        });
      } else {
        console.log(dataRow);
        state.dataSelected = dataRow;
        onModal(true);
      }
    };

    const showDeleted = (dataRow) => {
      if (state.zugriff2 === 'false') {
        Notify.create({
          message: state.messStr2,
          color: 'red',
        });
      } else {
        console.log(dataRow);
        state.dataforDelete = dataRow;
        onDeleted(true);
      }
    }; 

    const showModal = () => {
      if (state.zugriff2 === 'false') {
        Notify.create({
          message: state.messStr2,
          color: 'red',
        });
      } else {
        onModal(true);
      }
    }; 


    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      onDialog,
      showDialog,
      onDeleted,
      showDeleted,
      onModal,
      showModal,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    SearchPhoneBook: () => import('./components/SearchPhoneBook.vue'),
    DialogAdd: () => import('./components/DialogAdd.vue'),
    DialogDelete: () => import('./components/DialogDelete.vue'),
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
}
</style>
