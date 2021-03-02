<template>
  <div>
    <div class="row q-gutter-md">
      <div class="col">
        <SInput
          label-text="Deposit"
          v-model="day"
          :disable="!searches['active']"
        />
      </div>
      <div class="col-2">
        <SDateInput
          placeholder="Select Date"
          v-model="date"
          label-text="Limit Date"
          :disable="!searches['active']"
        />
      </div>
      <div class="col">
        <q-btn
          unelevated
          size="sm"
          style="marginTop: 1.5rem"
          color="primary"
          label="Edit"
          :disable="!searches['active']"
        />
      </div>
    </div>
    <q-separator />
    <div class="row q-gutter-md" style="marginTop: -0.5rem">
      <div class="col">
        <SInput
          label-text="Number"
          v-model="day"
          :disable="!searches['active']"
        />
      </div>
      <div class="col">
        <SSelect
          label-text="Article"
          :options="searches.article"
          :disable="!searches['active']"
        />
      </div>
      <div class="col">
        <SInput
          label-text="Amount"
          v-model="day"
          :disable="!searches['active']"
        />
      </div>
      <div class="col">
        <SInput
          label-text="Voucher Number"
          v-model="day"
          :disable="!searches['active']"
        />
      </div>
      <div class="col">
        <div v-if="searches['edit']">
          <q-btn
            unelevated
            size="sm"
            style="marginTop: 1.5rem"
            class="q-mr-md"
            color="primary"
            label="Refund"
            :disable="!searches['active']"
          />
          <q-btn
            unelevated
            size="sm"
            style="marginTop: 1.5rem"
            color="primary"
            label="Cancel"
            :disable="!searches['active']"
          />
        </div>
        <div v-else>
          <q-btn
            unelevated
            size="sm"
            style="marginTop: 1.5rem"
            color="primary"
            class="q-mr-md"
            label="Payment"
            :disable="!searches['active']"
          />
           <q-btn
            unelevated
            size="sm"
            style="marginTop: 1.5rem"
            color="primary"
            label="Cancel"
            :disable="!searches['active']"
          />
        </div>
      </div>
    </div>
    <div class="row q-gutter-md" style="marginTop: -1rem">
      <div style="width:38.6667%">
        <SInput label-text="Total Paid" v-model="day" :disable="true" />
      </div>
      <div style="width:38.6667%">
        <SInput label-text="Remain Balance" v-model="day" :disable="true" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from '@vue/composition-api';
import { date } from 'quasar';
export default defineComponent({
  props: {
    searches: {} as any,
  },
  setup(_, { root: { $api } }) {
    const state = reactive({
      duit: 1000,
      date: new Date(),
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>
