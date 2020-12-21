<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <SSelect label-text="Sorting" :options="optionsSorting" v-model="sorting"/>
      <v-date-picker
          mode="range"
          v-model="date"
          :columns="2"
          :popover="{ visibility: 'click' }"
      >
          <SInput
            label-text="Date"
            slot-scope="{ inputProps }"
            placeholder="From - Until"
            readonly
            v-bind="inputProps"
            clearable
            @clear="date = null"
          >
          <template v-slot:append>
            <q-icon name="mdi-event" />
          </template>
        </SInput>
      </v-date-picker>
      <SInput :options="searches" v-model="input.fromExtension" label-text="From Extension"/>
      <SInput :options="searches" v-model="input.toExtension" label-text="To Extension"/>
      <SInput :options="searches" v-model="input.dialedNo" label-text="Dialed No"/>
      <q-btn
        color="primary"
        size="sm"
        icon="mdi-magnify"
        label="Search"
        type="submit"
        class="q-mt-md full-width"
        @click="onSearch"
      />
      <q-separator style="border-width: 1px;" class="q-my-md" />
    <span>Calls Type</span>
    <div style="marginLeft: -10">
    <q-option-group
      :options="optionsRadio"
      label="Notifications"
      type="radio"
      size="sm"
      v-model="groupRadio"
    />
    </div>
    <q-checkbox size="xs" v-model="groupCheckBox" val="printPABX" label="Print Includes PABX Rate" />
    <q-checkbox disable size="xs" v-model="groupCheckBox" val="printSummary" label="Print Summary" />
    </div>
  </section>
</template>


<script lang="ts">
import { defineComponent, toRefs, reactive} from "@vue/composition-api";
import {setupCalendar, DatePicker } from 'v-calendar'
import {formatDates} from '../../../helpers/dateFormat.helpers'


export default defineComponent({
    props: {searches: {type: Object, default: null}},
    setup(_,{emit}){
     const state = reactive({
      date: {
        start: new Date(),
        end: new Date(),
      },
      groupRadio: 1,
      groupCheckBox: [''],
      sorting: {label: 'Date', value: 1},
      input: {
        fromExtension: '0',
        toExtension: '9999999',
        dialedNo: ''
      },
      optionsRadio: [
        { label: 'Posted Calls', value: 1 },
        { label: 'Non Posted Calls', value: 0 },
      ],
      optionsSorting: [
        {label: 'Date', value: 1},
        {label: 'Extension ', value: 2},
        {label: 'DialedNumber', value: 3},
      ]
    });
    const onSearch = () => {
      emit('onSearch', {...state})
    }
    return {
      ...toRefs(state),
      onSearch
    }
    },
      components: {
    'v-date-picker': DatePicker
  },
})

</script>