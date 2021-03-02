<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <div class="row q-gutter-xs">
        <div class="col">
          <DateInput
            label-text="Date"
            v-model="searches.date" />
        </div>

        <div class="col">
          <q-field outlined label="Info" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{reservationDetail}}</div>
            </template>
          </q-field>
        </div>
      </div>
    </div>
    
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch } from '@vue/composition-api';
import DateInput from '~/app/modules/FR/components/common/DateInput.vue';

// import { setupCalendar, DatePicker } from 'v-calendar';
// import { watch } from 'fs';
// import { date } from 'quasar';


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
    
    watch(
      () => props.searches.date, (dates) => {
        console.log('date change');
        emit('getResPlanDataLoad', { ...props.searches });
      }
    );

    // watchEffect(() => {
    //     console.log(" ")
    //     // state.date = props.searches.date;
    //     // state.adult = props.searches.adult;
    //     // state.child = props.searches.child;
    //     // state.comp = props.searches.comp;
    // })

    return {
      ...toRefs(state),
    };
  },
  components: {
    DateInput,
  }
});
</script>

<style lang="scss" scoped></style>
