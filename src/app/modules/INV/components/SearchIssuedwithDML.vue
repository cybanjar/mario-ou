<template>
    <div style="marginLeft: 20px; marginTop: 25px">
        <div class="row">
          <SSelect
            :key="i.name"
            v-for="i in searches.use_input.filter(x => [
            'Department No', 'Supplier No', 'To Store'
            ].includes(x.name))"
            :label-text="i.name"
            :style="{width: i.width, marginTop: i.top, marginRight: i.right}"
            :disable="i.disable"
            v-model="i.value"
            :options="i.option"
          />
          <SInput
            :key="i.name"
            v-for="i in searches.use_input.filter(x => [
            'Delivery Note', 'Cost Center'
            ].includes(x.name))"
            :label-text="i.name"
            :style="{width: i.width, marginRight: i.right}"
            :disable="i.disable"
            v-model="i.value"
          />
           <SSelect
            :key="i.name"
            v-for="i in searches.use_input.filter(x => [
            'Articel Name'
            ].includes(x.name))"
            :label-text="i.name"
            :style="{width: i.width, marginTop: i.top, marginRight: i.right}"
            :disable="i.disable"
            v-model="i.value"
            :options="i.option"
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
          />
          <q-btn
            color="primary"
            style="height: 25px; width: 146px; right: -166px; marginTop: 10px"
            icon="mdi-plus"
            size="sm"
            label="Add"
            @click="ADD"
          />
        </div>
        <div style="marginRight: 25px; marginTop: 20px;" class="row">
          <SRemarkLeftDrawer 
            class="col" 
            style="marginRight: 20px; width: 120px" 
            label="Total Price" 
            :value="price" />
          <SRemarkLeftDrawer 
            class="col" 
            label="Total" 
            :value="searches.totalPrice" />
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
export default defineComponent({
    props: {
        searches: {} as any
    },
    setup(props, { emit }) {
        const state = reactive({
          price: 0
        })
        const ADD = () => {
            emit('ADD', {...props})
        }
        const x: Object = (value: any) => {
          const xi = props.searches.use_input
          if(value.onClikc == '1'){
            xi[0].value = value.value.code
          }
           if(value.onClikc == '2'){
            state.price = xi[3].value.price
           }
        } 
        return {
          ...toRefs(state),
          date: new Date(2018, 0, 25),
          DatePicker,
          ADD ,
          x
        }
    },
    components: {
    'v-date-picker': DatePicker,
    },
})
</script>