<template>
  <q-card-section class="q-pt-none">
    <STable
      :loading="isFetching"
      :columns="tableHeaders"
      :data="data.getTaskReport"
      :rows-per-page-options="[0]"
      :pagination.sync="pagination"
      class="table-accounting-date scroll overflow"
      hide-bottom
    >
      <template v-slot:body="props">
        <q-tr :props="props" >
          <q-td key="id" :props="props">{{props.row.id}}</q-td>
          <q-td key="frdate" :props="props">
            <v-date-picker v-model="date"  :popover="{ visibility: 'click' }">
              <q-input
                readonly
                borderless
                slot-scope="{ inputProps }"
                v-bind="inputProps"
                clearable
              />
            </v-date-picker>
          </q-td>
          <q-td key="toDate" :props="props">
            <v-date-picker v-model="date"  :popover="{ visibility: 'click' }">
              <q-input
                readonly
                borderless
                slot-scope="{ inputProps }"
                v-bind="inputProps"
                clearable
              />
            </v-date-picker>
          </q-td>
          <q-td key="note" :props="props">
            <span v-if="props.row.note.length < 15">{{props.row.note}}</span>
            <span v-else>{{`${props.row.note.substr(0, 14)}...`}}</span>
              <q-tooltip v-if="props.row.note.length > 14" 
                content-class="bg-indigo" :offset="[10, 10]">
                {{props.row.note}}
              </q-tooltip>
            <q-popup-edit
              v-model="props.row.note"
            >
            <template v-slot="{set}">
              <q-input
                type="textarea"
                v-model="props.row.note"
                autofocus
                counter
                @keyup.enter.stop
              >
              <i class="mdi mdi-send  mdi-18px mdi-primary"  @click.stop="set"/>
              </q-input>
            </template>
            </q-popup-edit>
          </q-td>
          <q-td key="urgent" :props="props">
            <q-toggle size="xs" v-model="props.row.urgent"/>
          </q-td>
          <q-td key="done" :props="props">
            <q-toggle size="xs" v-model="props.row.done"/>
          </q-td>
          <q-td key="dept" :props="props" >
            <span v-text="selectDepartement(props.row.dept)"/>
              <q-tooltip
                v-if="valueDept(props.row.dept) !== undefined"
                content-class="bg-indigo" :offset="[10, 10]">
                <span v-text="valueDept(props.row.dept)"/>
              </q-tooltip>
            <q-popup-edit
              v-model="props.row.dept"
            >
              <template :props="props" v-slot="{set}">
                <div :style="{width: width, height: height}">
                  <q-select
                    @blur="set"
                    filled
                    multiple
                    use-input
                    use-chips
                    v-model="props.row.dept" 
                    :options="data.getHKDeptList" 
                    borderless  
                    dense/>
                </div>
              </template>
            </q-popup-edit>
          </q-td>
          <q-td key="ciflag" :props="props">
            <q-toggle size="xs" v-model="props.row.ciflag"/>
          </q-td>
          <q-td key="coflag" :props="props">
            <q-toggle size="xs" v-model="props.row.coflag"/>
          </q-td>
          <q-td key="rsv-detail" :props="props">
            <q-toggle size="xs" v-model="props.row['rsv-detail']"/>
          </q-td>
          <q-td key="bill-flag" :props="props">
            <q-toggle size="xs" v-model="props.row['bill-flag']"/>
          </q-td>
        </q-tr>
      </template>
    </STable>
  </q-card-section>
</template>


<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  watch,
  
} from '@vue/composition-api';
import {DatePicker} from 'v-calendar';
import {tableHeaders} from '../tables/taskReport.tables'
export default defineComponent({
    props: {
        data: {type: Object, default: true}
    },
  setup(props, { root: { $api } }) {
        const state = reactive({
            isFetching: false,
            date: new Date(),
            width: '200px',
            height: 'auto'
        })

        const selectDepartement = (value : any) => {
          if (value !== null) {
            let data = '' as any
            for(const i in value){
              data += value[i].label.substr(value[i].label.indexOf('- ')+2)+', '
            }          
              if (data.length > 50) {
                state.height = '120px'
              }
            if (data.length < 10) {
              return data
            } else {
              return data.substr(0, 9)+'...'
            }
          }
        }

        const valueDept = (value) => {
          if (value !== null) {
            let data = '' as any
            for(const i in value){
              data += value[i].label.substr(value[i].label.indexOf('- ')+2)+', '
            }
            return data
          }
        }

        return {
            ...toRefs(state),
            pagination: { page: 1, rowsPerPage: 0 },
            tableHeaders,
            selectDepartement,
            valueDept
        }
  },
  components: {
    'v-date-picker': DatePicker,
  },
})
</script>

<style lang="scss" scoped>
::v-deep .table-accounting-date {
  max-height: 400px;
  margin-top: 15px;
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
span.icon_circle {
  color: '#07de15'
}
</style>

