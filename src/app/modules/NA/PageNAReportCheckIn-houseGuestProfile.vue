<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="235" persistent>
    <SearchCheckinGuestProfile :data="data"/>
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
            <q-tr style="height: 40px; z-index: 3" :props="props">
                <q-th
                :props="props"
                v-for="col in props.cols.filter(items=> ![
                'actions'
                ].includes(items.name))"
                :key="col.name"
                :style="col.style"
                >
                    {{col.label}}
                </q-th>
                <q-th
                :props="props"
                style="z-index : 5"
                v-for="col in props.cols.filter(items=> [
                'actions'
                ].includes(items.name))"
                :key="col.name"
                :style="col.style"
                class="fixed-col right"
                >
                    {{col.label}}
                </q-th>
            </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr 
          :props="props"
          :class="{
            selected : props.row.selected
          }"
          @click="onRowClick(props.row)" >
            <q-td :props="props" key="roomNumber">
              {{props.row.roomNumber}}
              <span v-if="props.row.status == 14" style="color: #bfb906" class="mdi mdi-alert float-right">
                <q-tooltip>
                  Plase Fill The Date
                </q-tooltip>
              </span>
              <span v-if="props.row.status == 15" style="color: #bfb906" class="mdi mdi-alert-circle float-right">
                <q-tooltip>
                  Plase Fill The Date
                </q-tooltip>
              </span>
           </q-td>

           <q-td 
           :key="col.name" 
           :props="props" 
           v-for="col in props.cols.filter(cols => [
              'guestName', 'adult',
            ].includes(cols.name))">
              {{col.value}} 
           </q-td>

           <q-td :props="props" key="compliment">
                {{props.row.compliment}}
                <span 
                  v-if="props.row.compliment > 0 && props.row.adult > 0" 
                  style="color: #bfb906" class="mdi mdi-alert float-right">
                  <q-tooltip>
                    Plase Fill The Date
                  </q-tooltip>
                </span>
           </q-td>

           <q-td 
           :key="col.name" 
           :props="props" 
           v-for="col in props.cols.filter(cols => ![
            'actions', 'roomNumber', 'country', 'nationality', 
            'local', 'email', 'guestName', 'adult', 'compliment',
            'source', 'segmentcode'
            ].includes(cols.name))">
              {{col.value}} 
           </q-td>

            <q-td :props="props" key="country">
              {{props.row.country}}
              <span 
              v-if="props.row.country == '' ||
              !props.row.nationOk && props.row.nationality !== '-'
              " 
              style="color: #bfb906" class="mdi mdi-alert float-right">
                <q-tooltip>
                  Plase Fill The Date
                </q-tooltip>
              </span>
           </q-td>

            <q-td :props="props" key="nationality">
                {{props.row.nationality}}
                <span 
                  v-if="props.row.nationality == '' ||
                  !props.row.nationOk && props.row.nationality !== '-'" 
                  style="color: #bfb906" class="mdi mdi-alert float-right">
                <q-tooltip>
                  Plase Fill The Date
                </q-tooltip>
              </span>
           </q-td>

            <q-td :props="props" key="local">
                {{props.row.local}}
                <span v-if="props.row.local == ''" style="color: #bfb906" class="mdi mdi-alert float-right">
                  <q-tooltip>
                    Plase Fill The Date
                  </q-tooltip>
                </span>
           </q-td>

            <q-td :props="props" key="email">
                {{props.row.email}}
           </q-td>

            <q-td :props="props" key="source">
                {{props.row.source}}
                <span v-if="props.row.source == 0 && props.row.nationality !== '-'" style="color: #bfb906" class="mdi mdi-alert float-right">
                  <q-tooltip>
                    Plase Fill The Date
                  </q-tooltip>
                </span>
           </q-td>

            <q-td :props="props" key="segmentcode">
                {{props.row.segmentcode}}
                <span v-if="props.row.segmentcode == 0 && props.row.nationality !== '-'" style="color: #bfb906" class="mdi mdi-alert float-right">
                  <q-tooltip>
                    Plase Fill The Date
                  </q-tooltip>
                </span>
           </q-td>

            <q-td :props="props.row.actions" class="fixed-col right">
              <q-icon name="mdi-dots-vertical" size="16px">
                <q-menu :props="props" auto-close anchor="bottom right" self="top right">
                  <q-list :props="props">
                    <q-item @click="onEdit(props.row)" :props="props" clickable v-ripple>
                      <q-item-section>Modify Guest Profile</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </q-tr>
        </template>
      </STable>
    </div>
    <DialogCheckPermission :dialogConfirm="dialogConfirm"/>
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
import {tableHeaders} from './Tables/ReportCheckinGuestProfile.table'
import {store} from '~/store'
import { data_table } from './utils/CheckinGuestProfile'

export default defineComponent({
    setup(_, {root: {$api}}){
        const state = reactive({
            isFetching: false,
            hide_bottom: false,
            data: [],
            dialogConfirm: {
              confirm: false,
              message: ''
            },
        })

        const onRowClick = (datarow) => {
          for(const i of state.data){
            i.selected = false
          }
          datarow['selected'] = true;
        }


        const FETCH_API = async (api, body?) => {
          const [GET_DATA, GET_DATA2 ]= await Promise.all([
            $api.incomeaudit.FetchCommon(api, body),
            $api.incomeaudit.FetchAPINA(api, body)
          ]) 
          switch (api) {
            case "checkPermission":
              if (GET_DATA['zugriff'] !== "true") {
                state.dialogConfirm.confirm = true
                state.dialogConfirm.message = GET_DATA['messStr']
              }
              break;
            case 'pGuestCheck':
              state.data = data_table(GET_DATA2)
             if (state.data.length !== 0) {
               state.hide_bottom = true
               state.isFetching = false
             }
              break;
            default:
              break;
          }
        }

        onMounted(() => {
          const {userInit} = store.state.auth.user
          state.isFetching = true
          FETCH_API('checkPermission', {
            userInit: userInit,
            arrayNr: '1',
            expectedNr: '1'
          })
          FETCH_API('pGuestCheck', {
            "pvILanguage": 1
          })
        })

        return {
            pagination: {
              rowsPerPage: 0,
            },
            tableHeaders,
            ...toRefs(state),
            onRowClick
        }
    },
    components: {
        SearchCheckinGuestProfile: () => import('./components/SearchCheckinGuestProfile.vue'),
        DialogCheckPermission: () => import('./components/DialogCheckPermission.vue'),
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
