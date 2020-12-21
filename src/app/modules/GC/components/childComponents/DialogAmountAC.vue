<template>
    <q-dialog v-model="amount.dialog" persistent>
      <q-card style="width: 300px">
        <q-card-section style="backgroundColor: #2b32b2; height: 5px">
          <div style="marginTop: -9px; fontWeight: bold; color: white">Enter Amount</div>
        </q-card-section>

        <q-card-section style="marginTop: 10px" class="q-pt-none">
            <STable
              :columns="tableHeadersDialog"
              :data="amount.data"
              :rows-per-page-options="[0]"
              hide-bottom
              class="table-accounting-date"
            >
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td
                      v-if="key !== props.rowIndex"
                      @click="onClick(props)"
                      key="description" 
                      :props="props">{{ props.row.bezeich }}</q-td>
                      <q-input 
                      @keyup.enter="input_des(props)"
                       @blur="input_des(props)" 
                      v-model="des"
                      autofocus
                      v-else outlined dense/>
                    <q-td 
                      v-if="key2 !== props.rowIndex"
                      @click="onClick2(props)"
                      key="amount"
                      :props="props">{{ props.row.amount }}</q-td>
                    <q-input
                      mask="#"
                      fill-mask="0"
                      reverse-fill-mask
                      @keyup.enter="input_price(props)" 
                      @blur="input_price(props)" 
                      v-model="price" autofocus 
                      v-else outlined dense/>
                </q-tr>
            </template>
            </STable>
        </q-card-section>
         <q-separator />
        <q-card-actions align="right">
          <q-btn outline size="sm" label="Cencel" color="primary" v-close-popup />
          <q-btn @click="saveAmount" size="sm" label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
    import { defineComponent, reactive, toRefs} from '@vue/composition-api';
    import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
    import {use_inputchild} from '../../Input/cash_advance'
    export default defineComponent({
        props : {
            amount: {} as any
        },
        setup(props){
            const state = reactive({
                key: '',
                key2: '',
                des: '',
                price: '',
                tableHeadersDialog: [
                    {
                        label: 'Description',
                        field: 'bezeich',
                        name: 'description',
                        align: 'left',
                        sortable: false,
                    },
                    {
                        label: 'Amount',
                        field: 'amount',
                        name: 'amount',
                        align: 'right',
                        sortable: false,
                    },
                ]
                })
            const onClick = (val) => {
                state.key = val.rowIndex
                state.key2 = ''
                state.des = props.amount.data[val.pageIndex].bezeich
            }
            const onClick2 = (val) => {
                state.key2 = val.rowIndex
                state.key = ''
                state.price = props.amount.data[val.pageIndex].amount
            }
            const input_des = (val) => {
                props.amount.data[val.pageIndex].bezeich = state.des
                state.des = ''
                state.key = ''
            }
            const input_price = (val) => {
                props.amount.data[val.pageIndex].amount = state.price
                state.price = ''
                state.key2 = ''
            }
            const saveAmount = () => {
                let jumlah = 0
                for(const i of props.amount.data){
                    jumlah = Number(i.amount) + jumlah
                }
                use_inputchild.appForm[4].value = formatterMoney(jumlah)
            }

            return {
                ...toRefs(state),
                onClick,
                onClick2,
                input_des,
                input_price,
                saveAmount
            }
        }
    })
</script>