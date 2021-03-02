<template>
    <div class="container row">
        <div style="marginTop: 10px; alignItems: center;" class="column">
            <div>
                <q-circular-progress
                  show-value
                  class="text-light-blue q-ma-md"
                  :value="value"
                  size="120px"
                  color="light-blue"
                  track-color="grey-5"
                >
                    <div v-if="!value.toString().includes('.')">
                        {{ value}}%
                    </div>
                    <div v-else>
                        {{ value.toString().substring(0, value.toString().indexOf('.')) }}%
                    </div>
                </q-circular-progress>
            </div>

            <div>
                <div class="column" style="alignItems: center;">
                    <div style="fontSize: 24px; fontWeight: bold; color: #4f4f4f">Night Audit Checklist</div>
                    <div style="fontSize: 15px; color: #4f4f4f">Current date and time: {{newDate}} {{newTime}} | System Date: {{newDate}} </div>
                </div>
            </div>
            <div style="marginTop: 20px; marginBottom: 30px; alignItems: flex-end" class="row">
                <div style="width: 700px; marginRight: 10px">
                    <q-card flat bordered class="my-card" style="marginTop: 20px" v-for="item in data" :key="item.value">
                      <q-card-section>
                        <div style="fontSize: 20px; fontWeight: bold; color: #4f4f4f">{{item.name}}</div>
                        <div class="containerLoading">
                            <div class="percentage" :style="{'width': item.done}"/>
                        </div>
                        <div style="fontStyle: italic; color: #4f4f4f; fontSize: 12px; marginTop: 10px">Done {{item.length}}/{{item.auditProcess.length}}</div>
                      </q-card-section>
                      <div v-for="items in item.auditProcess" :key="items.value">
                        <q-separator inset /> 
                        <q-card-section>
                          <div class="row" style="alignItems: center; justifyContent: space-around">
                              <div class="col-9" style="fontSize: 15px; fontWeight: bold; color: #4f4f4f">
                                  {{items.name}}
                              </div>
                              <q-btn 
                                :disable="items.button"
                                @click="onClickProceed(items, item)" 
                                unelevated 
                                size="sm" 
                                style="height: 25px" 
                                label="proceed" 
                                color="primary" />
                              <q-checkbox @input="chekclist(items)" size="lg" v-model="items.chekclist" />
                          </div>
                          <div style="fontSize: 11px; color: #4f4f4f; marginLeft: 8px">
                              {{items.des}}
                          </div>
                        </q-card-section>
                      </div>
                    </q-card>
                </div>
                <q-btn
                  round
                  color="primary"
                  icon="mdi-arrow-up"
                  style="height: 35px; width: 35px"
                  size="sm"
                  @click="topFunction"
                  unelevated
                />
                <!-- <q-btn round color="primary" icon="mdi-arrow-up" /> -->
            </div>
            <DialogConfirmRunningNightAudit @onClickConfirm="onClickConfirm" :dialog="dialog"/> 
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from '@vue/composition-api';
import { stat } from 'fs/promises';
import PageINVReportSlowMovingStockOnHandVue from '../INV/PageINVReportSlowMovingStockOnHand.vue';
import {data} from './utils/nightaudit'
export default defineComponent({
    setup(_, {root: {$router, $api}}){
        let IncomeJournal = 0 
        let lengthIncomeJournal = 0

        let NightAuditProcess = 0 
        let lengthNightAuditProcess = 0
        
        let PostNightAuditProcess = 0 
        let lengthPostNightAuditProcess = 0

        let date = new Date()

        const state = reactive({
            shape: false,
            data: [],
            value: 0,
            newTime: `${date.getHours()}: ${date.getMinutes()}: ${date.getSeconds()}`,
            newDate: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
            dialog: {
                confirm: false,
                data: [],
                data2: []
            }
        })


        onMounted(() => {
            
            let dataa = sessionStorage.getItem('key') as any;
            let value = sessionStorage.getItem('value');
            if (dataa !== null && value !== null) {                
                state.data = JSON.parse(dataa)
                state.value = JSON.parse(value)
                lengthIncomeJournal = state.data[0]['length']
                IncomeJournal = Number(state.data[0]['done'].substring(0, state.data[0]['done'].indexOf('%')))
                NightAuditProcess = state.data[1]['length']
                lengthNightAuditProcess = Number(state.data[1]['done'].substring(0, state.data[1]['done'].indexOf('%')))
                lengthPostNightAuditProcess = state.data[2]['length']
                PostNightAuditProcess = Number(state.data[2]['done'].substring(0, state.data[2]['done'].indexOf('%')))
            } else {
                state.data = data.map(items => {
                    return {
                        auditProcess: items.auditProcess.map(item => ({
                            chekclist: false,
                            des: item.des,
                            name: item.name,
                            button: false
                        })),
                        done: '0%',
                        length: 0,
                        name: items.name
                    }
                })
            }
        })

        const pathReport = (items, item) => {
            switch (items.name) {
                case 'FO Transaction':
                    $router.push('/na/report/fo-transaction')
                    break;
                case 'Outstanding Folio':
                    $router.push('/na/report/outstanding-folio')
                    break;
                case 'Breakfast':
                    $router.push('/na/report/breakfast')
                    break;
                case 'Occupied Table':
                    $router.push('/na/report/occupied-table')
                    break;
                case 'Outlet Turnover':
                    $router.push('/na/report/outlet-turnover')
                    break;
                case 'Opened Master Bill':
                    $router.push('/na/report/opened-master-bill')
                    break;
                case 'Check In-house Guest Profile':
                    $router.push('/na/report/check-in-house-guest-profile')
                    break;
                case 'Competitor Statistic Entry':
                    $router.push('/na/report/competitor-statistic-entry')
                    break;
            
                default:
                    break;
            }
        }

        const onClickProceed = (items, item) => {
            if (!items['chekclist']) {
                state.value += 2.7027127
            } else {
                state.value -= 2.7027127
            }
            switch (item.name) {
                case 'Income Journal':
                    if (items['chekclist']) {
                        items['chekclist'] = false
                        IncomeJournal -= 5.9 
                        lengthIncomeJournal -= 1
                        item['done'] = IncomeJournal+'%'
                        item['length'] = lengthIncomeJournal
                    } else {
                        items['chekclist'] = true
                        IncomeJournal += 5.9
                        lengthIncomeJournal += 1
                        item['done'] = IncomeJournal+'%'
                        item['length'] = lengthIncomeJournal
                        pathReport(items, item)
                    }
                    break;
                case 'Night Audit Process':
                    if (items['chekclist']) {
                        items['chekclist'] = false
                        NightAuditProcess -= 100
                        lengthNightAuditProcess -= 1
                        item['done'] = NightAuditProcess+'%'
                        item['length'] = lengthNightAuditProcess
                    } else {
                        state.dialog["confirm"] = true
                        state.dialog['data'] = items
                        state.dialog['data2'] = item
                    }                    
                    break;
                default:
                    if (items['chekclist']) {
                        items['chekclist'] = false
                        PostNightAuditProcess -= 5.28 
                        lengthPostNightAuditProcess -= 1
                        item['done'] = PostNightAuditProcess+'%'
                        item['length'] = lengthPostNightAuditProcess
                    } else {
                        items['chekclist'] = true
                        PostNightAuditProcess += 5.28
                        lengthPostNightAuditProcess += 1
                        item['done'] = PostNightAuditProcess+'%'
                        item['length'] = lengthPostNightAuditProcess
                        pathReport(items, item)
                    } 
                    break;
            }
                sessionStorage.setItem('key', JSON.stringify(state.data))
                sessionStorage.setItem('value', JSON.stringify(state.value))
        }
        const chekclist = (items) => {
            if (items['chekclist']) {
                items['chekclist'] = false
            } else {
                items['chekclist'] = true
            }
        }

        function topFunction() {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }

        const onClickConfirm = (props) => {
            const xii = props.dialog
            NightAuditProcess += 100
            lengthNightAuditProcess += 1
            xii['data2']['done'] = NightAuditProcess+'%'
            xii['data2']['length'] = lengthNightAuditProcess
            xii['confirm'] = false
            xii['data']['button'] = true
            xii['data']['chekclist'] = true
            sessionStorage.setItem('key', JSON.stringify(state.data))
            sessionStorage.setItem('value', JSON.stringify(state.value))
        }

        return {
            ...toRefs(state),
            topFunction,
            onClickProceed,
            chekclist,
            onClickConfirm
        }
    },
    components: {
        DialogConfirmRunningNightAudit: () => import('./components/DialogConfirmRunningNightAudit.vue')
    }
})
</script>

<style lang="scss" scoped>
.container {
    background-color:#ededed;
    justify-content: center;
}

.containerLoading {
    background-color: rgba(79,79,79,1);
    border-radius: 20px;
    width: 300px;
    margin-top: 10px;
    height: 12px;
}

.percentage {
    border-radius: 10px;
    height: 12px;
    top: 1px;
    left: 1px;
    right: 1px;
    display: block;
    height: 100%;
    background-color: rgba(45,156,219,1);
    // background-size: 30px, 30px;
}
// @keyframes animate-stripes {
//     0% { background-position: 0 0;}
//     100% {background-position: 60% 0}
// }
</style>