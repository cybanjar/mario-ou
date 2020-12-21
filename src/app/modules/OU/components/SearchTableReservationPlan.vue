<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <div class="row q-gutter-xs">
        <div class="col">
          <v-date-picker v-model="searches.date" :popover="{ visibility: 'click' }">
            <SInput
              label-text="Date"
              placeholder="Select Date"
              slot-scope="{ inputProps }"
              readonly
              v-bind="inputProps"/>
          </v-date-picker>
        </div>

        <div class="col">
          <div class="row q-gutter-xs">
            <div class="col">
              <q-btn color="white" text-color="black" label="L" />
            </div>

            <div class="col">
              <q-btn color="white" text-color="black" label="R" />
            </div>
              
            <div class="col">
              <q-btn color="white" text-color="black" label="D" />
            </div>

            <div class="col">
              <q-btn color="white" text-color="black" label="U" />
            </div>
          </div>
        </div>

        <div class="col">
          <q-field outlined label="Info" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{reservationDetail}}</div>
            </template>
          </q-field>
        </div>

          <!-- <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="onSearch"/> -->

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
        console.log(" ")
        // state.date = props.searches.date;
        // state.adult = props.searches.adult;
        // state.child = props.searches.child;
        // state.comp = props.searches.comp;
    })

    return {
      ...toRefs(state),
      onSearch,
    };
  },
  components: {
    'v-date-picker': DatePicker,
  }
});
</script>

<style lang="scss" scoped></style>
