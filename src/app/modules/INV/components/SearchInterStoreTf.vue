<template>
    <div style="marginLeft: 20px; marginTop: 25px">
        <div class="row">
           <v-date-picker
           :popover="{ visibility: 'click' }"
            v-model='date'
           >
            <SInput
            label-text="Posting Date"
            style="width: 145px; marginRight: 20px"
            v-bind="inputProps"
            slot-scope="{ inputProps }"
            />
           </v-date-picker>
            <SInput
            :key="i.name"
            v-for="i in searches.use_input.filter(x => [
            'Trans-Code'
            ].includes(x.name))"
            :label-text="i.name"
            :style="{width: i.width, marginRight: i.right}"
            :disable="i.disable"
            v-model="i.value"
          />
          <SSelect
            :key="i.name"
            v-for="i in searches.use_input.filter(x => [
            'From Store', 'To Store', 'Articles Name'
            ].includes(x.name))"
            :label-text="i.name"
            :style="{width: i.width, marginTop: i.top, marginRight: i.right}"
            :disable="i.disable"
            v-model="i.value"
            :options="i.option"
            @input="x(i)"
          />
          <SInput
            :key="i.name"
            v-for="i in searches.use_input.filter(x => [
            'Quantity'
            ].includes(x.name))"
            :label-text="i.name"
            :style="{width: i.width, marginRight: i.right}"
            :disable="i.disable"
            v-model="i.value"
            @input="quantity(i.value)"
          />
          <q-btn
            color="primary"
            style="height: 25px; width: 146px; right: -166px;"
            icon="mdi-plus"
            size="sm"
            label="Add"
            @click="ADD"
            :disable="buttonDisable"
          />
        </div>
        <div style="marginRight: 25px; marginTop: 20px;" class="row">
          <SRemarkLeftDrawer 
            class="col" 
            style="marginRight: 20px; width: 120px" 
            label="Price" 
            :value="price" />
          <SRemarkLeftDrawer 
            class="col" 
            label="Total Amount" 
            :value="totalamount" />
        </div>
    </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  ref,
} from '@vue/composition-api';
import { DatePicker } from 'v-calendar';
import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
import {Notify} from 'quasar'
export default defineComponent({
    props: {
        searches: {} as any
    },
    setup(props, { emit }) {
        const state = reactive({
          price: '0',
          totalamount: '0',
          buttonDisable: true
        })

        const NotifyCreate = (mess, col?, position?,) => Notify.create({
          message: mess,
          color: col,
          position
        });

        const ADD = () => {
            emit('ADD', {...props}, {...state})
            state.price = '0'
            state.totalamount = '0'
            state.buttonDisable = true
        }

        const x: Object = (value: any) => {
          const xi = props.searches.use_input
          if(value.onClikc == '1'){
            xi[0].value = value.value.code
            xi[2].disable = false
            emit('toStore')
          }
          if(value.onClikc == '2'){
           state.price = formatterMoney(xi[3].value.price)
          }
          if (value.onClikc == '3') {
            emit('toStore')
          }
        } 

        const quantity = (qty) => {
          const xi = props.searches.use_input
          if (!isNaN(qty)) {
            if (Number(qty) <= xi[3].value.qty && Number(qty) !== 0) {               
              const hasil = Number(qty) * Number(state.price.replace(/,/g,''))
              state.totalamount  = formatterMoney(hasil)
              state.buttonDisable = false
              emit('quantity', qty)
            } else {
              NotifyCreate('Wrong quantity', 'red', 'top')
              xi[4].value = ''
              state.buttonDisable = true
            }
          } else {
              NotifyCreate('Wrong quantity', 'red', 'top')
              xi[4].value = ''
              state.buttonDisable = true
          }
        }
        return {
          ...toRefs(state),
          date: new Date(2018, 0, 25),
          DatePicker,
          ADD ,
          x,
          quantity
        }
    },
    components: {
    'v-date-picker': DatePicker,
    },
})
</script>