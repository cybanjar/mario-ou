<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <v-date-picker mode="range" v-model="date" :columns="2" :popover="{ visibility: 'click' }">
        <SInput
          label-text="Date"
          placeholder="Select Date"
          slot-scope="{ inputProps }"
          readonly
          v-bind="inputProps"/>
      </v-date-picker>

      <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="onSearch"/>
    </div>

    <div class="q-pa-md">
        <q-field outlined label="Reservation &amp; Name Address" stack-label>
            <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{searches.reservationDetail}}</div>
            </template>
        </q-field>
    </div>    

    <div class="q-pa-md">
        <q-field outlined label="Reservation Comments" stack-label>
            <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{searches.reservationComments}}</div>
            </template>
        </q-field>
    </div>

    <div class="q-pa-md">
        <div className="mb0 mt0 text-capitalize">Total</div>
        
        <div>
          <p
            className="dashed-remark mb1 p1 text-capitalize">
            Adult: {{searches.adult}}<br/>
            Child : {{searches.child}}<br/>
            Compliment: {{searches.comp}}
          </p>
        </div>
    </div>
    
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watchEffect } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { watch } from 'fs';
import { date } from 'quasar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(props, { emit }) {
    const state = reactive({
        date: {start: (new Date()), end: (new Date())},
        reservationDetail: '',
        reservationComments: '',
        adult: 0,
        child: 0,
        comp: 0
    });

    const onSearch = () => {
      emit('onSearch', { ...props.searches });
    };

    watchEffect(() => {
        state.date = props.searches.date;
        state.adult = props.searches.adult;
        state.child = props.searches.child;
        state.comp = props.searches.comp;
    })

    return {
      ...toRefs(props.searches),
      onSearch,
    };
  },
  components: {
    'v-date-picker': DatePicker,
  }
});
</script>

<style lang="scss" scoped></style>
