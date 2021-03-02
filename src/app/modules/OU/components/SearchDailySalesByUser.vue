<template>
  <section class="mt-7">
    <div class="q-pa-md">

        <DateRangeInput
          label-text="Date"
          :position-fixed="true"
          v-model="searches.date"
        />

        <SSelect
            label-text="Department"
            :options="searches.dept"
            v-model="searches.deptVal">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No data
                </q-item-section>
              </q-item>
            </template>
        </SSelect>

        <q-checkbox v-model="searches.checkSuppressComp" label="Suppress compliments VAT and service" />
        <q-checkbox v-model="searches.checkDiscToFood" label="Separate Discount to food Beverage and Other" />
        <q-checkbox v-model="searches.checkExcludeComp" label="Exclude Compliment" />

        <q-checkbox v-model="searches.showMultiCash" label="Show Multi Cash" />

        <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="showDialog(searches, dataPrepare)"/>
    </div>

    <dialogDailySalesByUserSelectUser :show="show" :searches="searches" :dataPrepare="dataPrepare" @onDialog="onDialog" @assignDataTable="assignDataTable"/>

  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import DateRangeInput from '~/app/modules/FR/components/common/DateRangeInput.vue';

export default defineComponent({
  components: {
    DateRangeInput,
    dialogDailySalesByUserSelectUser: () => import('./DialogDailySalesByUserSelectUser.vue'),
  },

  props: {
    searches: { type: Object, required: true },
    dataPrepare: {type: Object, required: true}
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      show: false,
    });

    const assignDataTable = (state2) => {
      emit('assignDataTable', state2)
    }

    const onDialog = (val) => {
      state.show = val;
    };

    const showDialog = (searches, dataPrepare) => {
      onDialog(true);
    };

    return {
      ...toRefs(state),
      onDialog, 
      showDialog,
      assignDataTable,
    };
  },
});
</script>

<style lang="scss" scoped></style>
