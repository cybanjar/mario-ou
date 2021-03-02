<template>
  <section style="marginLeft: 30px; marginTop: 20px" class="mt-7">
    <SInput
      :key="i.name"
      v-for="i in searches.use_input.filter(x => [
       'User'
      ].includes(x.name))"
      :label-text="i.name"
      :style="{width: i.width, marginTop: i.top, marginRight: i.right}"
      :disable="i.disable"
      v-model="i.value"
    />
    <SSelect
      :key="i.name"
      v-for="i in searches.use_input.filter(x => [
      'From Departement', 'To Departement', 'Articel Number'
      ].includes(x.name))"
      :label-text="i.name"
      :style="{width: i.width, marginTop: i.top, marginRight: i.right}"
      :disable="i.disable"
      v-model="i.value"
      :options="i.option"
      @input="selectInput(i)"
    />
    <SInput
      :key="i.name"
      v-for="i in searches.use_input.filter(x => [
      'Quantity',
      ].includes(x.name))"
      :label-text="i.name"
      :style="{width: i.width, marginTop: i.top, marginRight: i.right}"
      :disable="i.disable"
      v-model="i.value"
      @input="totalamount(i.value)"
    />
    <q-btn
      color="primary"
      icon="mdi-plus"
      label="add"
      style="width: 160px; height: 25px"
      size="sm"
      @click="add"
      unelevated
    />
    <q-separator style="border-width: 1px;" class="q-my-md" />
    <SRemarkLeftDrawer 
      class="col" 
      style="marginRight: 10px" 
      label="Price" 
      :value="price" />
    <SRemarkLeftDrawer 
      class="col" 
      style="marginRight: 10px" 
      label="Stock" 
      :value="stock" />
  </section>
</template>


<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import {Notify} from 'quasar'
import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
export default defineComponent({
  props: {
      searches: {} as any
  },
  setup(props, { emit }) {
    const state = reactive({
        price: '0',
        stock: '0'
    })
    const NotifyCreate = (message) => Notify.create({
        message: message,
        type: 'negative',
        position: 'top',
        textColor: 'white',
        timeout: 2000
      });
    const add = () => {
      emit('add', {...props});
    };
    const selectInput = (value) => {
      const input = props.searches.use_input
      if (value.name == 'From Departement') {
        if (input[1].value.label == input[2].value.label) {
          NotifyCreate('from store and to store must be different')
          input[3].disable = true
          input[4].disable = true
        }
        if (input[2].value !== '' && input[1].value.label !== input[2].value.label) {
          input[3].disable = false
          input[4].disable = false
        }
        input[2].disable = false
      }
      if (value.name == 'To Departement') {
        if (input[1].value.label == input[2].value.label) {
          NotifyCreate('from store and to store must be different')
          input[3].disable = true
          input[4].disable = true
        } else {
          input[3].disable = false
          input[4].disable = false
        }
      }

      if (value.name  == 'Articel Number') {
        state.stock = value.value.stock
        state.price = formatterMoney(value.value.price)
      }
    }

    const totalamount = (value) => {
      const input = props.searches.use_input
      if (!isNaN(value)) {
        if (Number(input[3].value.stock) < Number(value)) {
          NotifyCreate('Wrong quantity')
          input[4].value = ''
        }
        if (value == '0') {
          NotifyCreate('Wrong quantity')
          input[4].value = ''
        }
      } else {
        NotifyCreate('Wrong quantity')
        input[4].value = ''
      }
    }
    return {
      ...toRefs(state),
      add,
      selectInput,
      totalamount
    };
  },
});
</script>

