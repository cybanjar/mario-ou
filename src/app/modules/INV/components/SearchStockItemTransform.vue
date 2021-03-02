<template>
  <section class="mt-7">
    <div class="row" style="margin: 10px; marginTop: 20px">
      <v-date-picker class="col" v-model="searches.date"  :popover="{ visibility: 'click' }">
        <SInput
          label-text="Posting Date"
          slot-scope="{ inputProps }"
          placeholder="From - Until"
          readonly
          v-bind="inputProps"
          clearable
          style="marginRight:10px"
        />
      </v-date-picker>
        <SSelect
          class="col"
          style="marginRight:10px"
          label-text="From Store" 
          :options="searches.fromStore" 
          v-model="searches.store" 
          @input="addx"
        />
    </div>
      <SInput
        label-text="Trans-Code" 
        v-model="searches.store.code"
        disable
        style="margin: 10px; width: 140px; marginTop: -15px"
      />
    <q-card style="margin: 10px" class="my-card" flat bordered>
           <div style="margin: 14px">Transform-Out Stock Item</div>
            <q-separator inset/>
           <div style="margin: 10px" class="row">
            <SSelect
              class="col"
              style="marginRight:10px"
              label-text="Articel Number" 
              :options="searches.articelNumber"
              v-model="searches.art1"
              :disable="add"
              @input="inputarticelNumber(searches.art1)"
            />
            <SInput
              class="col" 
              label-text="Quantity" 
              v-model="searches.qty"
              :disable="add"
              @input="inputArticles(searches.qty)"
              @blur="inputArticles(searches.qty)"
              @keyup.enter="inputArticles(searches.qty)"
            />
           </div>
           
           <q-btn
             color="primary"
             style="height: 25px; width: 146px; right: -166px; bottom:10px"
             icon="mdi-plus"
             size="sm"
             label="Add"
             @click="ADD"
             :disable="add"
           />
    </q-card>
    <div style="margin: 10px" class="row">
          <SRemarkLeftDrawer 
            class="col" 
            style="marginRight: 10px" 
            label="Price" 
            :value="searches.price" />
          <SRemarkLeftDrawer 
            class="col" 
            label="Total Amount" 
            :value="searches.amount" />
    </div>
    <q-card style="margin: 10px" class="my-card" flat bordered>
           <div style="margin: 14px">Transform-In Stock Item</div>
            <q-separator inset/>
           <div style="margin: 10px" class="row">
            <SSelect
              class="col"
              style="marginRight:10px"
              label-text="Articel Number" 
              :options="searches.articelNumber"
              v-model="searches.art2"
              :disable="searches.disableTransform"
            />
            <SInput
              class="col" 
              label-text="Quantity"
              :disable="searches.disableTransform"
            />
           </div>
           <q-btn
             block
             color="primary"
             max-height="10"
             style="height: 25px; width: 146px; right: -166px; bottom:10px"
             size="sm"
             label="Save"
             :disable="searches.disableTransform"
             @click="transformIN"
           />
    </q-card>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { Notify } from 'quasar';
import {formatterMoney} from '~/app/helpers/formatterMoney.helper'

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(props, { emit }) {
     const state = reactive({
       add: true,
       articel: '0'
     })
    const ADD = () => {
      emit('ADD', { ...props, ...state });
    };

    const NotifyCreate = (mess, col?, position?, key?) => Notify.create({
          message: mess,
          color: col,
          position,
        });

    const transformIN = () => {
        emit('transformIN', {...props})
    }
    const addx = () => {
      state.add = false
    }

    const inputarticelNumber = (val) => {
      props.searches.price = formatterMoney(val.price)
      state.articel = val.artNumber
    }

    const inputArticles = (val) => {
      if (!isNaN(val)){
        if (Number(val) <= props.searches.art1.qty) {
          props.searches.amount = formatterMoney(
            Number(props.searches.price.replace(/,/g, '')) * Number(val)
          )
        } else {
          NotifyCreate('Wrong quantity', 'red', 'top')
          props.searches.qty = ''
        }
      } else {
        props.searches.qty = ''
        NotifyCreate('Wrong quantity', 'red', 'top')
      }
    }

    return {
      ...toRefs(state),
      ADD,
      transformIN,
      addx,
      inputarticelNumber,
      inputArticles
    };
  },
  components: {
    'v-date-picker': DatePicker,
  },
});
</script>

<style lang="scss" scoped>
#input {
  width: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#radio {
  margin-left: -9px;
}
</style>
