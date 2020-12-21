<template>
    <q-dialog v-model="dataTaskReport.modal" persistent>
      <q-card style="width: 900px; height: auto;  max-width: 90vw;">
        <q-toolbar>
            <q-toolbar-title class="text-white text-weight-medium">Task Report</q-toolbar-title>
        </q-toolbar>
          <tableTaskReport :data="data"/>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn 
          max-height="5"
          style="height: 25px" 
          flat 
          size="sm"
          label="Cancel" 
          color="primary" 
          v-close-popup />
          <q-btn
          @click="buttonSave" 
          label="OK" 
          size="sm"
          color="primary" 
          max-height="5"
          style="height: 25px"
          v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  watch,
  
} from '@vue/composition-api';
import {departementList} from '../utils/TaskList'
import {dataTable} from '../tables/taskReport.tables'
export default defineComponent({
    props: {
        dataTaskReport: {type: Object, default: true}
    },
    setup(props, { root: { $api } }) {
          const state = reactive({
            isFetching: false,
            data: {},
            text: ''
          })

          const FETCH_API = async (api, body) => {
            switch (api) {
              case 'getTaskReport':                
                const [getTaskReport, getHKDeptList] = await Promise.all([
                $api.telephoneOperator.fetchApiTaskRep(api, body[0]),
                $api.telephoneOperator.fetchApiTaskRep('getHKDeptList', body[1])
                ])
                state.data = {
                  getTaskReport: dataTable(getTaskReport.sList['s-list']),
                  getHKDeptList: departementList(getHKDeptList.deptList['dept-list'])
                } 
                break;
              default:
                const addTaskReport = await $api.telephoneOperator.fetchApiTaskRep('addTaskReport', body)
                console.log('sukses', addTaskReport)
                break;
            }
          }
      
          onMounted(() => {
            const data = [
              {
              tResnr: "28251",
		          tReslinnr: "1",
		          serInit: "01"
              },
              {
                inpDept: ' '
              }]
            FETCH_API('getTaskReport', data)
          })

          const buttonSave = () => {
            const dataRow = props.dataTaskReport.dataRow
            const data = {
              caseType: '2',
              n: 1,
              resnr: dataRow.resnr,
              reslinnr: dataRow.reslinnr,
              userInit: '01',
              sList: {
                's-list': [{
                  newflag: '',
                  id: 1,
                  frdate: '01/01/19',
                  datum: '01/01/19',
                  note: 'tes',
                  urgent: false,
                  done: true,
                  dept: true,
                  ciflag: false,
                  coflag: false
                }]
              }
            }
            FETCH_API('addTaskReport', data)
          }
      
          return {
              ...toRefs(state),
              buttonSave,
              pagination: { page: 1, rowsPerPage: 0 },
          }
    },
  components: {
    tableTaskReport: () => import('../components/TableTaskReport.vue')
  }
})
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>